@echo off
chcp 65001 >nul
echo ================================================
echo   明日堇sumire 个人网站 - 本地开发服务器
echo ================================================
echo.
echo 服务器启动中...
echo.
echo 访问地址：
echo   http://localhost:8000
echo.
echo 按 Ctrl+C 停止服务器
echo ================================================
echo.

python -m http.server 8000

if errorlevel 1 (
    echo.
    echo 错误：未找到 Python
    echo.
    echo 请先安装 Python：
    echo   https://www.python.org/downloads/
    echo.
    echo 或者使用其他方法启动服务器：
    echo   1. VS Code Live Server 扩展
    echo   2. Node.js http-server: npm install -g http-server
    echo.
    pause
)
