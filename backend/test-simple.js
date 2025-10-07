// Simple test for product extraction
import simplifiedUniversalExtractor from './controllers/simplifiedUniversalExtractor.js';

async function testExtraction() {
  console.log('🧪 Testing product extraction...\n');
  
  const testUrls = [
    'https://www.amazon.com/dp/B08N5WRWNW',
    'https://www.zara.com/tr/en/wide-fit-jeans-p05585360.html?v1=473299386&v2=2432131',
    'https://www.ebay.com/itm/123456789',
    'https://www.walmart.com/ip/product/123456',
    'https://www.target.com/p/product-name/-/A-123456'
  ];

  for (const url of testUrls) {
    try {
      console.log(`🔍 Testing: ${url}`);
      const result = await simplifiedUniversalExtractor.extractProduct(url);
      console.log('✅ Result:', {
        title: result.title,
        price: result.price,
        image: result.image ? 'Found' : 'Not found',
        colors: result.colors,
        sizes: result.sizes
      });
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    console.log('---');
  }
}

testExtraction().catch(console.error);
