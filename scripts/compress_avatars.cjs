const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = 'public/assets/images/avatar';
const targetDir = 'public/assets/images/avatar/thumbnails';

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 获取所有图片文件
const files = fs.readdirSync(sourceDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
});

console.log('开始压缩头像图片为 64x64 webp 格式...\n');

let count = 0;
let success = 0;
let failed = 0;

// 处理每个文件
Promise.all(files.map(async (file) => {
    count++;
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(targetDir, `${path.parse(file).name}.webp`);

    console.log(`[${count}] 正在处理: ${file}`);

    try {
        await sharp(inputPath)
            .resize(64, 64, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 85 })
            .toFile(outputPath);

        console.log(`    ✓ 已生成: ${path.parse(file).name}.webp`);
        success++;
    } catch (error) {
        console.log(`    ✗ 失败: ${file} - ${error.message}`);
        failed++;
    }
    console.log('');
})).then(() => {
    console.log(`\n完成！共处理 ${count} 个文件`);
    console.log(`成功: ${success}, 失败: ${failed}`);
});
