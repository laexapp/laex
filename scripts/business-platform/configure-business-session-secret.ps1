[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$environmentFile = Join-Path $repositoryRoot '.env.local'
$lines = [IO.File]::ReadAllLines($environmentFile)

function Get-EnvironmentValue([string]$Name) {
    $entry = $lines | Where-Object { $_ -match "^\s*$([regex]::Escape($Name))\s*=" } | Select-Object -Last 1
    if (-not $entry) { return $null }
    return ($entry -split '=', 2)[1].Trim()
}

$generator = [Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = [byte[]]::new(48)
try {
    do {
        $generator.GetBytes($bytes)
        $sessionSecret = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    } while ($sessionSecret -eq (Get-EnvironmentValue 'LAEX_CONTROL_PLANE_PASSWORD') -or $sessionSecret -eq (Get-EnvironmentValue 'LAEX_CONTROL_PLANE_SECRET') -or $sessionSecret -eq (Get-EnvironmentValue 'BUSINESS_DATABASE_URL'))

    $replacement = "BUSINESS_SESSION_SECRET=$sessionSecret"
    $matched = $false
    $updated = foreach ($line in $lines) {
        if ($line -match '^\s*BUSINESS_SESSION_SECRET\s*=') {
            if (-not $matched) { $replacement }
            $matched = $true
        }
        else { $line }
    }
    if (-not $matched) { $updated += $replacement }
    [IO.File]::WriteAllLines($environmentFile, [string[]]$updated, [Text.UTF8Encoding]::new($false))
}
finally {
    $sessionSecret = $null
    [Array]::Clear($bytes, 0, $bytes.Length)
    $generator.Dispose()
}
