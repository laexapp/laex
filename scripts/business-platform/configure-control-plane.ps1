[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$environmentFile = Join-Path $repositoryRoot '.env.local'

if (-not (Test-Path -LiteralPath $environmentFile)) {
    throw '.env.local no existe en el repositorio.'
}

function Read-AdministrativePassword {
    while ($true) {
        $first = Read-Host 'Contraseña administrativa del Control Plane' -AsSecureString
        $second = Read-Host 'Confirme la contraseña administrativa' -AsSecureString
        $firstPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($first)
        $secondPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($second)
        try {
            $firstText = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($firstPtr)
            $secondText = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secondPtr)
            if ($firstText -ne $secondText) {
                Write-Host 'Las contraseñas no coinciden. Inténtelo nuevamente.' -ForegroundColor Yellow
                continue
            }
            if ($firstText.Length -lt 16) {
                Write-Host 'Use al menos 16 caracteres.' -ForegroundColor Yellow
                continue
            }
            return $firstText
        }
        finally {
            if ($firstPtr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($firstPtr) }
            if ($secondPtr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secondPtr) }
        }
    }
}

function New-ControlPlaneSecret {
    $bytes = [byte[]]::new(48)
    $generator = [Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $generator.GetBytes($bytes)
        return [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    }
    finally {
        $generator.Dispose()
        [Array]::Clear($bytes, 0, $bytes.Length)
    }
}

function Set-EnvironmentValue([string[]]$Lines, [string]$Name, [string]$Value) {
    $replacement = "$Name=$Value"
    $matched = $false
    $updated = foreach ($line in $Lines) {
        if ($line -match "^\s*$([regex]::Escape($Name))\s*=") {
            if (-not $matched) { $replacement }
            $matched = $true
        }
        else { $line }
    }
    if (-not $matched) { $updated += $replacement }
    return [string[]]$updated
}

$password = Read-AdministrativePassword
$signingSecret = New-ControlPlaneSecret
try {
    $lines = [IO.File]::ReadAllLines($environmentFile)
    $lines = Set-EnvironmentValue $lines 'LAEX_CONTROL_PLANE_PASSWORD' $password
    $lines = Set-EnvironmentValue $lines 'LAEX_CONTROL_PLANE_SECRET' $signingSecret
    [IO.File]::WriteAllLines($environmentFile, $lines, [Text.UTF8Encoding]::new($false))
    Write-Host 'Configuración guardada. Puede cerrar esta ventana.' -ForegroundColor Green
}
finally {
    $password = $null
    $signingSecret = $null
}
