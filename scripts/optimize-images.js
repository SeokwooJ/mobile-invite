const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// optimized 폴더가 없으면 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 이미지 파일 목록
const imageFiles = fs.readdirSync(imagesDir).filter(file => 
  /\.(jpg|jpeg|png)$/i.test(file)
);

console.log(`Found ${imageFiles.length} images to optimize...`);

async function optimizeImage(filename) {
  const inputPath = path.join(imagesDir, filename);
  const outputPath = path.join(outputDir, filename);
  
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    // JPEG 최적화 (품질 80%, progressive)
    await sharp(inputPath)
      .jpeg({ 
        quality: 80, 
        progressive: true,
        mozjpeg: true 
      })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${filename}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${reduction}% 감소)`);
    
    return { filename, originalSize, newSize, reduction };
  } catch (error) {
    console.error(`✗ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function optimizeAll() {
  console.log('Starting image optimization...\n');
  
  const results = await Promise.all(
    imageFiles.map(file => optimizeImage(file))
  );
  
  const successful = results.filter(r => r !== null);
  const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = successful.reduce((sum, r) => sum + r.newSize, 0);
  const totalReduction = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  
  console.log(`\n=== Optimization Complete ===`);
  console.log(`Optimized: ${successful.length}/${imageFiles.length} images`);
  console.log(`Total size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total reduction: ${totalReduction}%`);
  console.log(`\nOptimized images saved to: ${outputDir}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the optimized images`);
  console.log(`2. If satisfied, replace original images with optimized ones`);
  console.log(`3. Or update image paths to use optimized folder`);
}

optimizeAll().catch(console.error);
