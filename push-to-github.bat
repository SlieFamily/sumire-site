@echo off
chcp 65001 >nul
REM GitHub 推送脚本 (Windows 版本)
REM 使用前请先在 GitHub 创建仓库，然后修改下面的仓库地址

REM 请将下面的地址替换为你的 GitHub 仓库地址
set GITHUB_REPO=https://github.com/你的用户名/sumire-site.git

echo ==========================================
echo 明日堇sumire网站 - GitHub 推送脚本
echo ==========================================
echo.

REM 检查是否已设置远程仓库
git remote | findstr "origin" >nul
if %errorlevel% equ 0 (
    echo ✓ 远程仓库已设置
    for /f "delims=" %%i in ('git remote get-url origin') do set CURRENT_REPO=%%i
    echo 当前远程仓库: %CURRENT_REPO%
    echo.
    set /p update_remote="是否要更新远程仓库地址？(y/n): "
    if /i "%update_remote%"=="y" (
        git remote set-url origin %GITHUB_REPO%
        echo ✓ 远程仓库地址已更新
    )
) else (
    echo → 添加远程仓库...
    git remote add origin %GITHUB_REPO%
    echo ✓ 远程仓库已添加
)

echo.
echo → 检查分支...
git branch -M main
echo ✓ 分支已设置为 main

echo.
echo → 推送代码到 GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo ✓ 推送成功！
    echo ==========================================
    echo.
    echo 下一步：
    echo 1. 访问你的 GitHub 仓库查看代码
    echo 2. 访问 https://vercel.com 部署网站
    echo 3. 查看 DEPLOYMENT.md 了解详细部署步骤
) else (
    echo.
    echo ==========================================
    echo ✗ 推送失败
    echo ==========================================
    echo.
    echo 可能的原因：
    echo 1. GitHub 仓库地址不正确
    echo 2. 没有推送权限
    echo 3. 网络连接问题
    echo.
    echo 请检查后重试
)

echo.
pause
