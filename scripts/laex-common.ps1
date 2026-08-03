$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$script:LaexRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$script:LaexPorts = @(3000, 3100)

function Write-LaexStep([string]$Message) {
  Write-Host "`n[LAEX] $Message" -ForegroundColor Cyan
}

function Invoke-LaexCommand([string]$Label, [string]$Command, [string[]]$Arguments) {
  Write-LaexStep $Label
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Label fall?? con c??digo $LASTEXITCODE."
  }
}

function Get-LaexNextProcesses {
  $escapedRoot = [Regex]::Escape($script:LaexRoot)
  try {
    return @(Get-CimInstance Win32_Process -ErrorAction Stop | Where-Object {
      $_.Name -match '^(node|node\.exe|npm|npm\.cmd)$' -and
      $_.CommandLine -and
      $_.CommandLine -match 'next' -and
      $_.CommandLine -match $escapedRoot
    })
  } catch {
    Write-Warning "No se pudo inspeccionar la l??nea de comandos de los procesos: $($_.Exception.Message)"
    return @()
  }
}

function Get-LaexPortOwners([int]$Port) {
  $matches = netstat -ano -p tcp | Select-String -Pattern ":$Port\s+.*LISTENING\s+(\d+)$"
  return @($matches | ForEach-Object {
    if ($_.Matches.Count -gt 0) { [int]$_.Matches[0].Groups[1].Value }
  } | Sort-Object -Unique)
}

function Stop-LaexDevelopmentProcesses {
  Write-LaexStep "Buscando servidores Next.js de este repositorio"
  $nextProcesses = @(Get-LaexNextProcesses)
  foreach ($process in $nextProcesses) {
    Write-Host "Deteniendo Next.js PID $($process.ProcessId)..." -ForegroundColor Yellow
    Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
  }

  Start-Sleep -Milliseconds 400
  foreach ($port in $script:LaexPorts) {
    foreach ($processId in @(Get-LaexPortOwners $port)) {
      $known = $nextProcesses | Where-Object { $_.ProcessId -eq $processId }
      if ($known) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        continue
      }
      $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
      throw "El puerto $port est?? ocupado por un proceso ajeno a este Next.js (PID $processId, $($process.ProcessName)). No se detuvo por seguridad."
    }
  }
  Write-Host "Puertos LAEX disponibles." -ForegroundColor Green
}

function Test-LaexDependencies {
  Write-LaexStep "Verificando dependencias"
  & npm.cmd ls --depth=0 --silent
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Dependencias incompletas. Ejecutando npm install..." -ForegroundColor Yellow
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) { throw "npm install no pudo recuperar las dependencias." }
  }
  Write-Host "Dependencias correctas." -ForegroundColor Green
}

function Show-LaexRoutes([int]$Port = 3000) {
  Write-Host "`nLAEX esta listo:" -ForegroundColor Green
  @(
    "/",
    "/media-intelligence",
    "/media-intelligence/operations",
    "/media-intelligence/operations/flow"
  ) | ForEach-Object { Write-Host "  http://localhost:$Port$_" -ForegroundColor White }
}



