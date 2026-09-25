param(
  [string]$GeneratedRoot = $env:FLORES_GENERATED_ASSETS
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

if (-not $GeneratedRoot) {
  $GeneratedRoot = Join-Path $env:USERPROFILE ".codex\generated_images\01a0c40f-b479-7102-8612-2eb0ea0d17a6"
}

$assets = @(
  @{ Source = "prepared-character\girlfriend-run-v2.png"; Destination = "public\assets\custom\girlfriend\girlfriend-run-v2.png" },
  @{ Source = "prepared-character\girlfriend-idle-v2.png"; Destination = "public\assets\custom\girlfriend\girlfriend-idle-v2.png" },
  @{ Source = "prepared-character\girlfriend-jump-v2.png"; Destination = "public\assets\custom\girlfriend\girlfriend-jump-v2.png" },
  @{ Source = "exec-034ffc47-cce2-499b-89b6-54dc2a2bc546.png"; Destination = "public\assets\custom\flowers\yellow-flower.png" },
  @{ Source = "exec-44d9c798-5483-4043-9212-61bede9382c0.png"; Destination = "public\assets\custom\bouquet\bouquet.png" },
  @{ Source = "exec-dc3b5129-fd05-4f07-bad7-de99aeb7e7ed.png"; Destination = "public\assets\custom\bouquet\petal.png" },
  @{ Source = "exec-23f3fb1a-e488-42fc-9b14-d42be2a29d29.png"; Destination = "public\assets\custom\ui\dialogue-panel.png" }
)

foreach ($asset in $assets) {
  $source = Join-Path $GeneratedRoot $asset.Source
  $destination = Join-Path $projectRoot $asset.Destination
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "Falta el asset generado: $source"
  }
  $destinationDirectory = Split-Path -Parent $destination
  if (-not (Test-Path -LiteralPath $destinationDirectory -PathType Container)) {
    New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
  }
  $bytes = [System.IO.File]::ReadAllBytes($source)
  [System.IO.File]::WriteAllBytes($destination, $bytes)
  Write-Host "Instalado: $($asset.Destination)"
}

Write-Host "Listo: los siete PNG personalizados ya están dentro de public/assets/custom."
