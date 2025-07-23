# Gitignore Validation Script
Write-Host "Gitignore Validation Script" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

Write-Host "`nChecking .gitignore files..." -ForegroundColor Yellow

# Check main .gitignore
if (Test-Path ".gitignore") {
    Write-Host "Main .gitignore:" -ForegroundColor Green
    $content = Get-Content ".gitignore"
    $hasEnvProtection = $content | Select-String -Pattern "!\.env\.(example|backup|dev)|!sample\.env"
    if ($hasEnvProtection) {
        Write-Host "  Environment protection: OK" -ForegroundColor Green
    } else {
        Write-Host "  Environment protection: MISSING" -ForegroundColor Red
    }
} else {
    Write-Host "Main .gitignore: MISSING" -ForegroundColor Red
}

# Check webapp-ui .gitignore
if (Test-Path "webapp-ui/.gitignore") {
    Write-Host "webapp-ui/.gitignore:" -ForegroundColor Green
    $content = Get-Content "webapp-ui/.gitignore"
    $hasEnvProtection = $content | Select-String -Pattern "!\.env\.(example|backup|dev)"
    if ($hasEnvProtection) {
        Write-Host "  Environment protection: OK" -ForegroundColor Green
    } else {
        Write-Host "  Environment protection: MISSING" -ForegroundColor Red
    }
} else {
    Write-Host "webapp-ui/.gitignore: MISSING" -ForegroundColor Red
}

# Check backend .gitignore
if (Test-Path "Webapp_API-Develop/.gitignore") {
    Write-Host "Webapp_API-Develop/.gitignore:" -ForegroundColor Green
    $content = Get-Content "Webapp_API-Develop/.gitignore"
    $hasEnvProtection = $content | Select-String -Pattern "!\.env\.(example|backup|dev)|!sample\.env"
    if ($hasEnvProtection) {
        Write-Host "  Environment protection: OK" -ForegroundColor Green
    } else {
        Write-Host "  Environment protection: MISSING" -ForegroundColor Red
    }
} else {
    Write-Host "Webapp_API-Develop/.gitignore: MISSING" -ForegroundColor Red
}

Write-Host "`nChecking tracked files..." -ForegroundColor Yellow

# Check important files are tracked
$importantFiles = @(".env.example", ".env.backup", "webapp-ui/.env.example", "Webapp_API-Develop/sample.env")
foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        $tracked = git ls-files $file 2>$null
        if ($tracked) {
            Write-Host "Tracked: $file" -ForegroundColor Green
        } else {
            Write-Host "NOT tracked: $file" -ForegroundColor Red
        }
    } else {
        Write-Host "Missing: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nChecking ignored files..." -ForegroundColor Yellow

# Check important files are ignored
$ignoredFiles = @(".env", "webapp-ui/.env", "Webapp_API-Develop/.env")
foreach ($file in $ignoredFiles) {
    if (Test-Path $file) {
        $ignored = git check-ignore $file 2>$null
        if ($ignored) {
            Write-Host "Ignored: $file" -ForegroundColor Green
        } else {
            Write-Host "NOT ignored: $file" -ForegroundColor Red
        }
    } else {
        Write-Host "Not present: $file" -ForegroundColor Gray
    }
}

Write-Host "`nValidation complete!" -ForegroundColor Cyan 