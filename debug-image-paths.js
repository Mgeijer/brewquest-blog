// Debug Next.js image path encoding
const paths = [
  '/images/Beer images/California/anchor-steam-beer.jpg',
  '/images/Beer%20images/California/anchor-steam-beer.jpg',
  '/images/Beer images/California/sierra-nevada-pale-ale.jpg'
];

console.log('=== IMAGE PATH ANALYSIS ===');
paths.forEach(path => {
  console.log(`\nOriginal: ${path}`);
  console.log(`Encoded:  ${encodeURI(path)}`);
  console.log(`Component: ${encodeURIComponent(path)}`);

  // Next.js image optimization URL format
  const nextUrl = `/_next/image?url=${encodeURIComponent(path)}&w=640&q=75`;
  console.log(`Next.js:  ${nextUrl}`);
});

// Check if spaces are the issue
console.log('\n=== SPACE HANDLING ===');
const withSpaces = '/images/Beer images/California/anchor-steam-beer.jpg';
const withoutSpaces = '/images/Beer-images/California/anchor-steam-beer.jpg';
console.log('With spaces in path:', withSpaces);
console.log('URL encoded:', encodeURI(withSpaces));
console.log('Component encoded:', encodeURIComponent(withSpaces));