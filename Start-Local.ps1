param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectDirectory = $PSScriptRoot
$previewUrl = 'http://127.0.0.1:4173/'

function Test-LocalPreview {
    try {
        $response = Invoke-WebRequest ($previewUrl + 'site-config.js') -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200 -and $response.Content -match 'filterProducts'
    } catch { return $false }
}

if (-not (Test-LocalPreview)) {
    if (Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue) {
        throw 'Port 4173 is already used by another application.'
    }
    $nodeExecutable = (Get-Command node.exe -ErrorAction Stop).Source
    $logDirectory = Join-Path $projectDirectory 'output'
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
    Start-Process -FilePath $nodeExecutable -ArgumentList 'serve.mjs' -WorkingDirectory $projectDirectory -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'local-server.log') -RedirectStandardError (Join-Path $logDirectory 'local-server-error.log')
    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        if (Test-LocalPreview) { break }
        Start-Sleep -Milliseconds 150
    }
    if (-not (Test-LocalPreview)) { throw 'Local preview did not start. See output/local-server-error.log.' }
}

Write-Host "Local website: $previewUrl"
Write-Host "Project files: $projectDirectory"
if (-not $NoBrowser) { Start-Process $previewUrl }
