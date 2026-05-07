import path from 'node:path';

const TRADINGVIEW_UPLOAD_MANIFEST = Object.freeze([
  Object.freeze({
    slug: 'aria-supreme',
    sourceName: 'aria-supreme.pine',
    uploadName: 'aria-supreme.pine',
  }),
  Object.freeze({
    slug: 'fear-greed',
    sourceName: 'fear-greed-meter-v2.pine',
    uploadName: 'fear-greed-meter-v2.pine',
  }),
  Object.freeze({
    slug: 'oi-pulse',
    sourceName: 'oi-pulse-v2.pine',
    uploadName: 'oi-pulse-v2.pine',
  }),
  Object.freeze({
    slug: 'smart-sr',
    sourceName: 'smart-sr-zones-v2.pine',
    uploadName: 'smart-sr-zones-v2.pine',
  }),
  Object.freeze({
    slug: 'complete-bundle',
    sourceName: 'complete-bundle.zip',
    uploadName: 'complete-bundle.zip',
    bundleEntries: Object.freeze([
      'aria-supreme.pine',
      'fear-greed-meter-v2.pine',
      'oi-pulse-v2.pine',
      'smart-sr-zones-v2.pine',
    ]),
  }),
]);

export function getTradingViewUploadManifest() {
  return TRADINGVIEW_UPLOAD_MANIFEST.map((entry) => ({
    ...entry,
    ...(entry.bundleEntries ? { bundleEntries: [...entry.bundleEntries] } : {}),
  }));
}

export function resolveTradingViewUploadPlan(indicatorsRoot) {
  return getTradingViewUploadManifest().map((entry) => ({
    ...entry,
    sourcePath: path.join(indicatorsRoot, entry.sourceName),
    bundleSourcePaths: entry.bundleEntries
      ? entry.bundleEntries.map((bundleEntry) => path.join(indicatorsRoot, bundleEntry))
      : undefined,
  }));
}
