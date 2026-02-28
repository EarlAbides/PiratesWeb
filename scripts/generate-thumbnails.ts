import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { resolve, join, basename, extname } from 'node:path';

const inputDir = resolve('static/images/cards');
const outputDir = resolve('static/images/thumbs');
const THUMB_WIDTH = 200;

mkdirSync(outputDir, { recursive: true });

const jpgFiles = readdirSync(inputDir).filter(
	(f) => extname(f).toLowerCase() === '.jpg'
);

let count = 0;
for (const file of jpgFiles) {
	const inputPath = join(inputDir, file);
	const outputName = basename(file, extname(file)) + '.webp';
	const outputPath = join(outputDir, outputName);

	await sharp(inputPath).resize({ width: THUMB_WIDTH }).webp({ quality: 80 }).toFile(outputPath);

	count++;
}

console.log(`Generated ${count} WebP thumbnails in ${outputDir}`);
