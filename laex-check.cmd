@echo off
PowerShell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\laex-preflight.ps1"
exit /b %errorlevel%
