import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { resolveTradingViewUploadPlan } from '../lib/admin/tradingview-indicators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(repoRoot, '..', '..');

const DEFAULT_INDICATORS_ROOT = path.join(workspaceRoot, 'tradingview-indicators');
const DEFAULT_ENV_FILE = path.join(repoRoot, '.vercel', '.env.production.local');

function parseArgs(argv) {
  const options = {
    indicatorsRoot: DEFAULT_INDICATORS_ROOT,
    envFile: DEFAULT_ENV_FILE,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (token === '--indicators-root') {
      options.indicatorsRoot = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    if (token === '--env-file') {
      options.envFile = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
  }

  return options;
}

function parseDotEnv(text) {
  const env = {};

  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function requireEnv(env, key) {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function guessContentType(fileName) {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.pine') || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
    return 'text/plain; charset=utf-8';
  }

  if (lowerName.endsWith('.zip')) {
    return 'application/zip';
  }

  return 'application/octet-stream';
}

async function assertFilesExist(plan) {
  for (const entry of plan) {
    if (entry.bundleSourcePaths) {
      for (const bundleSourcePath of entry.bundleSourcePaths) {
        await fs.access(bundleSourcePath);
      }
      continue;
    }

    await fs.access(entry.sourcePath);
  }
}

function createBundleZip(bundleZipPath, sourcePaths) {
  const command = [
    "$destination = $args[0]",
    "$paths = $args[1..($args.Length - 1)]",
    "if (Test-Path -LiteralPath $destination) { Remove-Item -LiteralPath $destination -Force }",
    "Compress-Archive -LiteralPath $paths -DestinationPath $destination -Force",
  ].join('; ');

  execFileSync(
    'powershell.exe',
    ['-NoProfile', '-Command', command, bundleZipPath, ...sourcePaths],
    { stdio: 'inherit' }
  );
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}: ${text}`);
  }

  return data;
}

async function uploadFile({ supabaseUrl, serviceRoleKey, storagePath, fileName, buffer, dryRun }) {
  if (dryRun) {
    return { ok: true, storagePath, dryRun: true };
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/object/products/${storagePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'x-upsert': 'true',
      'Content-Type': guessContentType(fileName),
    },
    body: buffer,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Storage upload failed (${response.status}) for ${storagePath}: ${text}`);
  }

  return text ? JSON.parse(text) : { ok: true };
}

async function updateProductFileUrl({ supabaseUrl, serviceRoleKey, productId, storagePath, dryRun }) {
  if (dryRun) {
    return { ok: true, file_url: storagePath, dryRun: true };
  }

  return fetchJson(`${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ file_url: storagePath }),
  });
}

async function getProductsBySlug({ supabaseUrl, serviceRoleKey, slugs }) {
  const slugFilter = slugs.map((slug) => `"${slug}"`).join(',');
  const url = `${supabaseUrl}/rest/v1/products?select=id,slug,name,file_url,is_active&slug=in.(${encodeURIComponent(slugFilter)})`;
  const products = await fetchJson(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      Accept: 'application/json',
    },
  });

  return new Map(products.map((product) => [product.slug, product]));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const envText = await fs.readFile(options.envFile, 'utf8');
  const env = parseDotEnv(envText);

  const supabaseUrl = requireEnv(env, 'NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = requireEnv(env, 'SUPABASE_SERVICE_ROLE_KEY');

  const uploadPlan = resolveTradingViewUploadPlan(options.indicatorsRoot);
  await assertFilesExist(uploadPlan);

  const bundleEntry = uploadPlan.find((entry) => entry.slug === 'complete-bundle');
  const bundleZipPath = path.join(os.tmpdir(), 'paperpe-complete-bundle.zip');

  if (bundleEntry?.bundleSourcePaths) {
    createBundleZip(bundleZipPath, bundleEntry.bundleSourcePaths);
    bundleEntry.sourcePath = bundleZipPath;
  }

  const productsBySlug = await getProductsBySlug({
    supabaseUrl,
    serviceRoleKey,
    slugs: uploadPlan.map((entry) => entry.slug),
  });

  const results = [];

  try {
    for (const entry of uploadPlan) {
      const product = productsBySlug.get(entry.slug);
      if (!product) {
        throw new Error(`No live product found for slug "${entry.slug}"`);
      }

      const buffer = await fs.readFile(entry.sourcePath);
      const storagePath = `indicators/${product.id}/${entry.uploadName}`;

      await uploadFile({
        supabaseUrl,
        serviceRoleKey,
        storagePath,
        fileName: entry.uploadName,
        buffer,
        dryRun: options.dryRun,
      });

      await updateProductFileUrl({
        supabaseUrl,
        serviceRoleKey,
        productId: product.id,
        storagePath,
        dryRun: options.dryRun,
      });

      results.push({
        slug: entry.slug,
        productId: product.id,
        uploadName: entry.uploadName,
        storagePath,
        dryRun: options.dryRun,
      });
    }
  } finally {
    await fs.rm(bundleZipPath, { force: true });
  }

  const earlyBirdProduct = await getProductsBySlug({
    supabaseUrl,
    serviceRoleKey,
    slugs: ['early-bird'],
  });

  console.log(JSON.stringify({
    indicatorsRoot: options.indicatorsRoot,
    envFile: options.envFile,
    dryRun: options.dryRun,
    uploaded: results,
    warnings: earlyBirdProduct.has('early-bird')
      ? ['early-bird is not mapped to a file in this script; review it separately if it is still sold live']
      : [],
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
