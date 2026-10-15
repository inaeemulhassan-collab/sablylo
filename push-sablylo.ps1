$ErrorActionPreference = 'Stop'
$repo = 'https://github.com/inaeemulhassan-collab/sablylo.git'
$zip = Join-Path $PSScriptRoot 'horizons-export-4bc584c1-11dd-46ff-a521-64ad3b34c342.zip'
$folder = Join-Path $PSScriptRoot 'sablylo-source'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is not installed. Install Git for Windows from https://git-scm.com/downloads/win' }
if (-not (Test-Path $zip)) { throw "Place this script next to the original ZIP: $zip" }
if (Test-Path $folder) { throw "Folder already exists: $folder. Rename it before running again." }
Expand-Archive -LiteralPath $zip -DestinationPath $folder
@'
node_modules/
dist/
build/
.env
.env.*
!.env.example
.DS_Store
*.log
'@ | Set-Content -Encoding utf8 (Join-Path $folder '.gitignore')
Push-Location $folder
try {
  git init -b main
  git add .
  git -c user.name='Sablylo Code Import' -c user.email='inaeemulhassan-collab@users.noreply.github.com' commit -m 'Import Hostinger Horizons website source'
  git remote add origin $repo
  git push -u origin main
  Write-Host 'Pushed successfully to https://github.com/inaeemulhassan-collab/sablylo' -ForegroundColor Green
} finally { Pop-Location }
