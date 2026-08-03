@echo off
PowerShell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\laex-start.ps1"
exit /b %errorlevel%

