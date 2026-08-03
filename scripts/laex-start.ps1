. (Join-Path $PSScriptRoot "laex-common.ps1")
Set-Location $script:LaexRoot
$server = $null

function Wait-LaexPort([int]$Port, [int]$TimeoutSeconds = 45) {
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  do {
    if (@(Get-LaexPortOwners $Port).Count -gt 0) { return }
    Start-Sleep -Milliseconds 500
  } while ((Get-Date) -lt $deadline)
  throw "LAEX no respondio en el puerto $Port dentro de $TimeoutSeconds segundos."
}

try {
  Stop-LaexDevelopmentProcesses
  Test-LaexDependencies
  & (Join-Path $PSScriptRoot "laex-preflight.ps1")
  if ($LASTEXITCODE -ne 0) { throw "El preflight fallo; el servidor no se iniciara." }

  Write-LaexStep "Iniciando una unica instancia en el puerto 3000"
  $server = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev", "--", "--port", "3000") -WorkingDirectory $script:LaexRoot -NoNewWindow -PassThru
  Wait-LaexPort -Port 3000
  if ($server.HasExited) { throw "Next.js finalizo antes de completar el inicio." }

  Write-Host "`nLAEX iniciado correctamente." -ForegroundColor Green
  Write-Host "`nLocal:" -ForegroundColor Cyan
  Write-Host "http://localhost:3000" -ForegroundColor White
  Write-Host "`nManten esta ventana abierta. Ctrl+C detiene LAEX." -ForegroundColor DarkGray
  Wait-Process -Id $server.Id
  exit $server.ExitCode
} catch {
  Write-Host "`nLAEX NO PUDO INICIARSE" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
} finally {
  if ($null -ne $server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
  }
}
