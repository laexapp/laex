. (Join-Path $PSScriptRoot "laex-common.ps1")
Set-Location $script:LaexRoot

try {
  Stop-LaexDevelopmentProcesses
  Test-LaexDependencies

  & (Join-Path $PSScriptRoot "laex-preflight.ps1")
  if ($LASTEXITCODE -ne 0) { throw "El preflight fall??; el servidor no se iniciar??." }

  Show-LaexRoutes -Port 3000
  Write-Host "`nIniciando Next.js. Mant??n esta ventana abierta; Ctrl+C detiene LAEX." -ForegroundColor Cyan
  & npm.cmd run dev
  exit $LASTEXITCODE
} catch {
  Write-Host "`n??- LAEX NO PUDO INICIARSE" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
}


