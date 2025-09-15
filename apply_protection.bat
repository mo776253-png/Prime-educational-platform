@echo off
echo Applying inspection protection to all HTML files...

REM Apply protection to detail2.html through detail6.html
for %%i in (detail2.html detail3.html detail4.html detail5.html detail6.html) do (
    echo Processing %%i...
    powershell -Command "(Get-Content '%%i') -replace '<meta content=\"Free HTML Templates\" name=\"description\">', '<meta content=\"Free HTML Templates\" name=\"description\">\n    \n    <!-- Additional Security Meta Tags -->\n    <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\">\n    <meta http-equiv=\"Pragma\" content=\"no-cache\">\n    <meta http-equiv=\"Expires\" content=\"0\">\n    <meta name=\"robots\" content=\"noindex, nofollow, noarchive, nosnippet, noimageindex\">\n    <meta name=\"googlebot\" content=\"noindex, nofollow, noarchive, nosnippet, noimageindex\">' | Set-Content '%%i'"
)

REM Apply protection to course content pages
for %%i in (course-content-*.html) do (
    echo Processing %%i...
    powershell -Command "(Get-Content '%%i') -replace '<meta content=\"Free HTML Templates\" name=\"description\">', '<meta content=\"Free HTML Templates\" name=\"description\">\n    \n    <!-- Additional Security Meta Tags -->\n    <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\">\n    <meta http-equiv=\"Pragma\" content=\"no-cache\">\n    <meta http-equiv=\"Expires\" content=\"0\">\n    <meta name=\"robots\" content=\"noindex, nofollow, noarchive, nosnippet, noimageindex\">\n    <meta name=\"googlebot\" content=\"noindex, nofollow, noarchive, nosnippet, noimageindex\">' | Set-Content '%%i'"
)

echo Protection applied to all HTML files!
pause
