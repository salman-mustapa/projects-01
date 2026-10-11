@echo off
title Push Media Pembelajaran ke GitHub
echo ===================================================
echo   PUSH MEDIA PEMBELAJARAN KE GITHUB
echo   Repository: https://github.com/salman-mustapa/projects-01.git
echo ===================================================
echo.
echo Melakukan sinkronisasi dan push ke branch main...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUKSES] Berhasil melakukan push ke GitHub!
) else (
    echo [INFO] Jika diminta login, silakan login melalui popup browser yang muncul.
)
echo.
pause
