$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$script:LaexRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Write-LaexStep([string]$Message) {
  Write-Host "`n[LAEX] $Message" -ForegroundColor Cyan
}

function Invoke-LaexCommand([string]$Label, [string]$Command, [string[]]$Arguments) {
  Write-LaexStep $Label
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) { throw "$Label fallo con codigo $LASTEXITCODE." }
}

function Get-LaexNextProcesses {
  $escapedRoot = [Regex]::Escape($script:LaexRoot)
  try {
    return @(Get-CimInstance Win32_Process -ErrorAction Stop | Where-Object {
      $_.Name -match '^(node|node\.exe|npm|npm\.cmd)$' -and
      $_.CommandLine -and
      $_.CommandLine -match '(next(\.exe|\.cmd)?\s+dev|next[/\\]dist)' -and
      $_.CommandLine -match $escapedRoot
    })
  } catch {
    Write-Warning "No se pudo inspeccionar la linea de comandos: $($_.Exception.Message)"
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
  Write-LaexStep "Cerrando instancias anteriores de este repositorio"
  $processes = @(Get-LaexNextProcesses)
  foreach ($item in ($processes | Sort-Object ProcessId -Descending)) {
    Write-Host "Deteniendo instancia LAEX (PID $($item.ProcessId))..." -ForegroundColor Yellow
    Stop-Process -Id $item.ProcessId -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Milliseconds 800

  $owners = @(Get-LaexPortOwners 3000)
  if ($owners.Count -gt 0) {
    $details = $owners | ForEach-Object {
      $process = Get-Process -Id $_ -ErrorAction SilentlyContinue
      "PID $_ ($($process.ProcessName))"
    }
    throw "El puerto 3000 esta ocupado por un proceso ajeno a este repositorio: $($details -join ', '). No se detuvo por seguridad."
  }
  Write-Host "Puerto 3000 libre y verificado." -ForegroundColor Green
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
