# Environment Files Protection Script
Write-Host "Environment Files Protection Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check critical environment files
$criticalFiles = @(".env.example", ".env.backup", "webapp-ui/.env.example")

Write-Host "`nChecking critical environment files..." -ForegroundColor Yellow

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $tracked = git ls-files $file 2>$null
        if ($tracked) {
            Write-Host "Tracked: $file" -ForegroundColor Green
        } else {
            Write-Host "NOT tracked: $file - adding..." -ForegroundColor Yellow
            git add $file
        }
    } else {
        Write-Host "Missing: $file" -ForegroundColor Red
    }
}

# Check critical folders
$criticalFolders = @("webapp-ui/", "Webapp_API-Develop/")

Write-Host "`nChecking critical project folders..." -ForegroundColor Yellow

foreach ($folder in $criticalFolders) {
    if (Test-Path $folder) {
        $trackedFiles = git ls-files $folder 2>$null
        if ($trackedFiles) {
            Write-Host "Tracked: $folder ($($trackedFiles.Count) files)" -ForegroundColor Green
        } else {
            Write-Host "NOT tracked: $folder - adding..." -ForegroundColor Yellow
            git add $folder
        }
    } else {
        Write-Host "Missing: $folder" -ForegroundColor Red
    }
}

# Check .gitignore files
$gitignoreFiles = @(".gitignore", "webapp-ui/.gitignore", "Webapp_API-Develop/.gitignore")

Write-Host "`nChecking .gitignore protection..." -ForegroundColor Yellow

foreach ($gitignoreFile in $gitignoreFiles) {
    if (Test-Path $gitignoreFile) {
        $content = Get-Content $gitignoreFile
        $hasProtection = $content | Select-String -Pattern "!\.env\.(example|backup|dev)|!sample\.env"
        if ($hasProtection) {
            Write-Host "Protected: $gitignoreFile" -ForegroundColor Green
        } else {
            Write-Host "Missing protection: $gitignoreFile" -ForegroundColor Red
        }
    } else {
        Write-Host "Missing: $gitignoreFile" -ForegroundColor Red
    }
}

Write-Host "`nProtection check complete!" -ForegroundColor Cyan 