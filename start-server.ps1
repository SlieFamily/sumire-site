# 本地开发服务器启动脚本
# 使用方法：双击运行此文件

# 检测 Python 版本并启动服务器

$pythonCommand = $null

# 尝试 Python 3
try {
    $version = python --version 2>&1
    if ($version -match "Python 3") {
        $pythonCommand = "python"
    }
} catch {}

# 尝试 Python 2
if (-not $pythonCommand) {
    try {
        $version = python --version 2>&1
        if ($version -match "Python 2") {
            $pythonCommand = "python"
        }
    } catch {}
}

# 尝试 py 命令
if (-not $pythonCommand) {
    try {
        $version = py --version 2>&1
        if ($version -match "Python") {
            $pythonCommand = "py"
        }
    } catch {}
}

if ($pythonCommand) {
    Write-Host "================================================"
    Write-Host "  明日堇sumire 个人网站 - 本地开发服务器"
    Write-Host "================================================"
    Write-Host ""
    Write-Host "服务器启动中..."
    Write-Host ""
    Write-Host "访问地址："
    Write-Host "  http://localhost:8000"
    Write-Host ""
    Write-Host "按 Ctrl+C 停止服务器"
    Write-Host "================================================"
    Write-Host ""

    # 启动服务器
    & $pythonCommand -m http.server 8000
} else {
    Write-Host "错误：未找到 Python" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装 Python："
    Write-Host "  https://www.python.org/downloads/"
    Write-Host ""
    Write-Host "或者使用其他方法启动服务器：" -ForegroundColor Yellow
    Write-Host "  1. VS Code Live Server 扩展"
    Write-Host "  2. Node.js http-server: npm install -g http-server"
    Write-Host ""
    pause
}
