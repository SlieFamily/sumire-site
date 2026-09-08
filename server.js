const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 文件未找到</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('服务器错误: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function startServer(port) {
    server.listen(port, () => {
        console.log('================================================');
        console.log('  明日堇sumire 个人网站 - 本地开发服务器');
        console.log('================================================');
        console.log('');
        console.log('服务器已启动！');
        console.log('');
        console.log('访问地址：');
        console.log(`  http://localhost:${port}`);
        console.log('');
        console.log('按 Ctrl+C 停止服务器');
        console.log('================================================');
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`端口 ${port} 已被占用，尝试 ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('服务器启动失败:', err);
        }
    });
}

startServer(PORT);
