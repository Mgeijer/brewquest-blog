// Debug script to check California state data
const fs = require('fs');
const path = require('path');

// Read the stateProgress.ts file
const stateProgressPath = path.join(__dirname, 'src/lib/data/stateProgress.ts');
const content = fs.readFileSync(stateProgressPath, 'utf8');

// Extract California section
const californiaMatch = content.match(/\/\/ Week 5: California[\s\S]*?(?=\/\/ Week 6:|export)/);
if (californiaMatch) {
  console.log('=== CALIFORNIA STATE DATA ===');
  console.log(californiaMatch[0]);

  // Look for Anchor Steam specifically
  const anchorMatch = californiaMatch[0].match(/name: 'Anchor Steam Beer'[\s\S]*?imageUrl: '[^']*'/);
  if (anchorMatch) {
    console.log('\n=== ANCHOR STEAM BEER DATA ===');
    console.log(anchorMatch[0]);
  }

  // Look for Sierra Nevada specifically
  const sierraMatch = californiaMatch[0].match(/name: 'Sierra Nevada Pale Ale'[\s\S]*?imageUrl: '[^']*'/);
  if (sierraMatch) {
    console.log('\n=== SIERRA NEVADA BEER DATA ===');
    console.log(sierraMatch[0]);
  }
} else {
  console.log('California section not found');
}

// Check if the image files exist
const anchorImagePath = path.join(__dirname, 'public/images/Beer images/California/anchor-steam-beer.jpg');
const sierraImagePath = path.join(__dirname, 'public/images/Beer images/California/sierra-nevada-pale-ale.jpg');

console.log('\n=== FILE EXISTENCE CHECK ===');
console.log('Anchor Steam image exists:', fs.existsSync(anchorImagePath));
console.log('Sierra Nevada image exists:', fs.existsSync(sierraImagePath));

if (fs.existsSync(anchorImagePath)) {
  const stats = fs.statSync(anchorImagePath);
  console.log('Anchor Steam image size:', stats.size, 'bytes');
  console.log('Anchor Steam image modified:', stats.mtime);
}

if (fs.existsSync(sierraImagePath)) {
  const stats = fs.statSync(sierraImagePath);
  console.log('Sierra Nevada image size:', stats.size, 'bytes');
  console.log('Sierra Nevada image modified:', stats.mtime);
}