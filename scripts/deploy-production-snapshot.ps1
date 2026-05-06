param(
  [string]$SourcePath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$SnapshotPath = (Join-Path $env:TEMP 'paperpe-vercel-publish'),
  [switch]$CleanupSnapshot
)

$ErrorActionPreference = 'Stop'

$vercelCmd = Join-Path $env:APPDATA 'npm\vercel.cmd'
if (-not (Test-Path -LiteralPath $vercelCmd)) {
  throw "Vercel CLI not found at $vercelCmd. Install it with 'npm install -g vercel' first."
}

$excludeNames = @(
  '.git',
  '.next',
  'node_modules',
  'artifacts'
)

Write-Host "Creating clean deployment snapshot from $SourcePath" -ForegroundColor Cyan

if (Test-Path -LiteralPath $SnapshotPath) {
  Remove-Item -LiteralPath $SnapshotPath -Recurse -Force
}

New-Item -ItemType Directory -Path $SnapshotPath | Out-Null

Get-ChildItem -LiteralPath $SourcePath -Force |
  Where-Object { $_.Name -notin $excludeNames } |
  ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $SnapshotPath -Recurse -Force
  }

Write-Host "Snapshot prepared at $SnapshotPath" -ForegroundColor Green
Write-Host "Deploying to Vercel production without git metadata..." -ForegroundColor Cyan

Push-Location $SnapshotPath
try {
  & $vercelCmd deploy --prod --yes --logs --debug
}
finally {
  Pop-Location

  if ($CleanupSnapshot -and (Test-Path -LiteralPath $SnapshotPath)) {
    Remove-Item -LiteralPath $SnapshotPath -Recurse -Force
    Write-Host "Removed snapshot at $SnapshotPath" -ForegroundColor DarkGray
  } else {
    Write-Host "Snapshot preserved at $SnapshotPath" -ForegroundColor Yellow
  }
}
