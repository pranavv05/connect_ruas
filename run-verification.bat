@echo off
echo 🔍 Verifying deployment configuration...
echo.

echo 📋 Required Environment Variables:
echo   DATABASE_URL: %DATABASE_URL%
echo   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: %NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY%
echo   CLERK_SECRET_KEY: %CLERK_SECRET_KEY%
echo   GEMINI_API_KEY: %GEMINI_API_KEY%

echo.
echo 📋 Optional Environment Variables:
echo   EMAIL_USER: %EMAIL_USER%
echo   EMAIL_PASS: %EMAIL_PASS%

echo.
echo 🔍 Database URL Validation:
echo   %DATABASE_URL% | findstr /C:"postgresql://" >nul
if %errorlevel% == 0 (
    echo   ✅ Database URL format is correct
) else (
    echo   %DATABASE_URL% | findstr /C:"postgres://" >nul
    if %errorlevel% == 0 (
        echo   ✅ Database URL format is correct
    ) else (
        echo   ❌ Database URL must start with postgresql:// or postgres://
    )
)

echo.
echo 📊 Verification complete!
echo.