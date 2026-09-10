const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '../assets/images/gallery');
const thumbnailDir = path.join(__dirname, '../assets/images/gallery/thumbnails');
const costumesDir = path.join(__dirname, '../assets/images/costumes');
const costumesThumbnailDir = path.join(__dirname, '../assets/images/costumes/thumbnails');

// 缩略图配置
const THUMBNAIL_WIDTH = 600; // 宽度600px足够瀑布流显示
const THUMBNAIL_QUALITY = 80; // JPEG质量80%

// 创建缩略图目录
if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
}

if (!fs.existsSync(costumesThumbnailDir)) {
    fs.mkdirSync(costumesThumbnailDir, { recursive: true });
}

// 处理单个图片
async function generateThumbnail(inputPath, outputPath, width = THUMBNAIL_WIDTH) {
    try {
        const ext = path.extname(inputPath).toLowerCase();

        // 跳过GIF文件（保持原样）
        if (ext === '.gif') {
            console.log(`跳过GIF: ${path.basename(inputPath)}`);
            return;
        }

        // 检查缩略图是否已存在且较新
        if (fs.existsSync(outputPath)) {
            const inputStat = fs.statSync(inputPath);
            const outputStat = fs.statSync(outputPath);

            if (outputStat.mtime >= inputStat.mtime) {
                console.log(`跳过（已存在）: ${path.basename(inputPath)}`);
                return;
            }
        }

        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // 如果图片宽度已经小于目标宽度，跳过
        if (metadata.width <= width) {
            console.log(`跳过小图: ${path.basename(inputPath)} (${metadata.width}px)`);
            return;
        }

        // 生成缩略图
        await image
            .resize(width, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality: THUMBNAIL_QUALITY, progressive: true })
            .toFile(outputPath);

        const inputSize = fs.statSync(inputPath).size;
        const outputSize = fs.statSync(outputPath).size;
        const ratio = ((1 - outputSize / inputSize) * 100).toFixed(1);

        console.log(`✓ ${path.basename(inputPath)}: ${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024).toFixed(0)}KB (减少${ratio}%)`);
    } catch (error) {
        console.error(`✗ 处理失败 ${path.basename(inputPath)}:`, error.message);
    }
}

// 批量处理目录
async function processDirectory(inputDir, outputDir) {
    const files = fs.readdirSync(inputDir);

    console.log(`\n处理目录: ${path.basename(inputDir)}`);
    console.log('='.repeat(60));

    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const stat = fs.statSync(inputPath);

        // 跳过目录
        if (stat.isDirectory()) continue;

        // 只处理图片文件
        const ext = path.extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) continue;

        // GIF文件复制到缩略图目录
        if (ext === '.gif') {
            const outputPath = path.join(outputDir, file);
            fs.copyFileSync(inputPath, outputPath);
            console.log(`复制GIF: ${file}`);
            continue;
        }

        // 生成缩略图（转为.jpg）
        const outputFile = file.replace(/\.(png|jpeg)$/i, '.jpg');
        const outputPath = path.join(outputDir, outputFile);

        await generateThumbnail(inputPath, outputPath);
    }
}

// 主函数
async function main() {
    console.log('开始生成缩略图...\n');

    // 处理gallery目录
    await processDirectory(galleryDir, thumbnailDir);

    // 处理costumes目录
    await processDirectory(costumesDir, costumesThumbnailDir);

    console.log('\n' + '='.repeat(60));
    console.log('✓ 所有缩略图生成完成！');
}

main().catch(console.error);
