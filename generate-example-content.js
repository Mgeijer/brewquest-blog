// Quick test script to generate example social media content
const { SocialMediaContentGenerator, exampleAlabamaData } = require('./src/lib/social-media/content-generator.ts');

console.log('🍺 Generating Example Social Media Content Pack...\n');

const generator = new SocialMediaContentGenerator();
const contentPack = generator.generateWeeklyContent(1, exampleAlabamaData);
const formattedOutput = generator.generateFormattedOutput(contentPack);

console.log(formattedOutput);

// Save to file
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'generated-content');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const filename = 'example-week-1-alabama-social-content.md';
const filepath = path.join(outputDir, filename);

fs.writeFileSync(filepath, formattedOutput);

console.log(`\n✅ Content saved to: ${filepath}`);
console.log(`\n📊 Content Statistics:`);
console.log(`   - Instagram: ${contentPack.weeklyPosts.instagram.characterCount} characters`);
console.log(`   - Twitter: ${contentPack.weeklyPosts.twitter.characterCount} characters`);
console.log(`   - Facebook: ${contentPack.weeklyPosts.facebook.characterCount} characters`);
console.log(`   - LinkedIn: ${contentPack.weeklyPosts.linkedin.characterCount} characters`);
console.log(`   - Daily posts: ${Object.keys(contentPack.dailyPosts).length} days generated`);
console.log(`\n🎉 Ready for copy-paste to all social media platforms!`);