// Test the real Zara URL with advanced extraction
import advancedUniversalExtractor from './controllers/advancedUniversalExtractor.js';

async function testZaraExtraction() {
  console.log('🧪 Testing Zara URL with Advanced Extraction...\n');
  
  const zaraUrl = 'https://www.zara.com/tr/en/wide-fit-jeans-p05585360.html?v1=473299386&v2=2432131';
  
  try {
    console.log(`🔍 Testing: ${zaraUrl}`);
    const startTime = Date.now();
    
    const result = await advancedUniversalExtractor.extractProduct(zaraUrl);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✅ Result:', {
      title: result.title,
      price: result.price,
      image: result.image ? 'Found' : 'Not found',
      colors: result.colors,
      sizes: result.sizes,
      method: result.extractionMethod,
      duration: `${duration}ms`
    });
    
    // Check if we got meaningful data
    if (result.title && result.title.length > 3 && !result.title.includes('Product from')) {
      console.log('🎉 SUCCESS: Got real product data!');
    } else {
      console.log('⚠️ Got fallback data - manual input would be required');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Clean up
  await advancedUniversalExtractor.close();
  console.log('\n🧹 Cleanup completed');
}

// Run the test
testZaraExtraction().catch(console.error);
