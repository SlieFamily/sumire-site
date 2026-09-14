const fs = require('fs');
const path = require('path');

// 需要处理的文件列表
const files = [
    'data/relationship.json',
    'gallery.html',
    'music.html',
    'index.html',
    'costumes.html',
    'changelog.html',
    'about.html',
    'js/creators-loader.js'
];

console.log('开始重定向头像路径到thumbnails目录...\n');

let totalReplacements = 0;

files.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  文件不存在: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 替换路径模式：assets/images/avatar/xxx.jpg -> assets/images/avatar/thumbnails/xxx.webp
    // 支持 .jpg, .jpeg, .png, .webp 扩展名
    content = content.replace(
        /(\.\/)?assets\/images\/avatar\/(?!thumbnails\/)([^\/\s"']+)\.(jpg|jpeg|png|webp)/g,
        'assets/images/avatar/thumbnails/$2.webp'
    );

    if (content !== originalContent) {
        // 统计替换次数
        const matches = originalContent.match(/(\.\/)?assets\/images\/avatar\/(?!thumbnails\/)([^\/\s"']+)\.(jpg|jpeg|png|webp)/g);
        const count = matches ? matches.length : 0;

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ ${file} - 替换了 ${count} 处引用`);
        totalReplacements += count;
    } else {
        console.log(`- ${file} - 无需修改`);
    }
});

console.log(`\n完成！共替换 ${totalReplacements} 处头像引用`);
