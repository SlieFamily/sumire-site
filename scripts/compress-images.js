const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 目标图片配置
const images = [
    {
        input: path.join(__dirname, '../assets/images/card.png'),
        output: path.join(__dirname, '../assets/images/card-compressed.jpg'),
        width: 1200,
        quality: 85
    },
    {
        input: path.join(__dirname, '../assets/images/games/apex.jpg'),
        output: path.join(__dirname, '../assets/images/games/apex-compressed.jpg'),
        width: 800,
        quality: 82
    },
    {
        input: path.join(__dirname, '../assets/images/games/pubg.jpg'),
        output: path.join(__dirname, '../assets/images/games/pubg-compressed.jpg'),
        width: 800,
        quality: 82
    },
    {
        input: path.join(__dirname, '../assets/images/games/valorant.jpg'),
        output: path.join(__dirname, '../assets/images/games/valorant-compressed.jpg'),
        width: 800,
        quality: 82
    },
    {
        input: path.join(__dirname, '../assets/images/games/zzz.jpg'),
        output: path.join(__dirname, '../assets/images/games/zzz-compressed.jpg'),
        width: 800,
        quality: 82
    }
];

async function compressImage(config) {
    try {
        const { input, output, width, quality } = config;

        if (!fs.existsSync(input)) {
            console.log(`✗ 文件不存在: ${path.basename(input)}`);
            return;
        }

        const image = sharp(input);
        const metadata = await image.metadata();

        await image
            .resize(width, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality, progressive: true })
            .toFile(output);

        const inputSize = fs.statSync(input).size;
        const outputSize = fs.statSync(output).size;
        const ratio = ((1 - outputSize / inputSize) * 100).toFixed(1);

        console.log(`✓ ${path.basename(input)}: ${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024).toFixed(0)}KB (减少${ratio}%)`);
    } catch (error) {
        console.error(`✗ 压缩失败 ${path.basename(config.input)}:`, error.message);
    }
}

async function main() {
    console.log('开始压缩图片...\n');
    console.log('='.repeat(60));

    for (const config of images) {
        await compressImage(config);
    }

    console.log('='.repeat(60));
    console.log('\n✓ 所有图片压缩完成！');
}

main().catch(console.error);
