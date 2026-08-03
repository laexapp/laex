param([switch]$SkipBuild)

. (Join-Path $PSScriptRoot "laex-common.ps1")
Set-Location $script:LaexRoot

try {
  Test-LaexDependencies
  Invoke-LaexCommand "TypeScript" "npx.cmd" @("tsc", "--noEmit")
  Invoke-LaexCommand "Codificacion UTF-8" "node.exe" @("scripts/check-source-integrity.mjs")
  Invoke-LaexCommand "Pruebas Media Intelligence" "npm.cmd" @("run", "test:media")
  Invoke-LaexCommand "Lint del alcance LAEX modificado" "npx.cmd" @(
    "eslint",
    "app/api/media-intelligence",
    "app/media-intelligence",
    "modules/media-intelligence",
    "tests/media-intelligence",
    "--ignore-pattern", ".tmp-media-tests/**"
  )
  if (-not $SkipBuild) {
    Invoke-LaexCommand "Build productivo" "npm.cmd" @("run", "build")
  }
  Invoke-LaexCommand "Integridad del diff" "git.exe" @("diff", "--check")

  Write-LaexStep "Estado del repositorio"
  git.exe status --short
  if ($LASTEXITCODE -ne 0) { throw "No se pudo consultar git status." }

  Write-Host "`nOK - PREFLIGHT LAEX APROBADO - listo para commit o push." -ForegroundColor Green
  exit 0
} catch {
  Write-Host "`nERROR - PREFLIGHT LAEX FALLO" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host "No hagas commit ni push hasta corregir este error." -ForegroundColor Yellow
  exit 1
}



