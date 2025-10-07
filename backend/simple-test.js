// Simple test to verify universal extraction is working
import simplifiedUniversalExtractor from './controllers/simplifiedUniversalExtractor.js';

async function simpleTest() {
  try {
    console.log('🧪 Simple Universal Extraction Test');

    // Test with a known working URL
    const testUrl = 'https://www.amazon.com/dp/B08N5WRWNW';
    console.log('Testing URL:', testUrl);

    const result = await simplifiedUniversalExtractor.extractProduct(testUrl);

    console.log('✅ Extraction successful!');
    console.log('Title:', result.title);
    console.log('Price:', result.price);
    console.log('Image found:', !!result.image);
    console.log('Colors:', result.colors);
    console.log('Sizes:', result.sizes);

  } catch (error) {
    console.log('❌ Extraction failed:', error.message);
  }
}

simpleTest();