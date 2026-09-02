import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Starting Aiman Collection Netlify Production Build...');

// Helper to recursively copy directories
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

// Clear or create dist folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy standalone files
const filesToCopy = [
  'index.html',
  'styles.css',
  'app.js',
  'favicon.svg',
  'googlef360c93cdc6e6eea.html',
  'FIGMA_DESIGN_SYSTEM.md',
  'README.md'
];

filesToCopy.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Copied ${file}`);
  }
});

// Copy directories
const dirsToCopy = [
  'images',
  'apps',
  'packages'
];

dirsToCopy.forEach(dir => {
  const src = path.join(rootDir, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    copyRecursiveSync(src, dest);
    console.log(`  ✓ Copied directory ${dir}/`);
  }
});

// Create Netlify _redirects file
const redirectsContent = `/*    /index.html   200\n`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
console.log('  ✓ Created Netlify _redirects file');

console.log('\n✨ Production build complete! All files ready inside: c:\\Users\\Lenovo\\Desktop\\Aiman Collectiion\\dist');
