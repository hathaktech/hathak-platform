// Test the advanced product extraction system
import advancedUniversalExtractor from './controllers/advancedUniversalExtractor.js';

async function testAdvancedExtraction() {
  console.log('🧪 Testing Advanced Product Extraction System...\n');
  
  // Test URLs from various international stores
  const testUrls = [
    // Amazon (US)
    'https://www.amazon.com/dp/B08N5WRWNW',
    // Amazon (UK)
    'https://www.amazon.co.uk/dp/B08N5WRWNW',
    // eBay
    'https://www.ebay.com/itm/123456789',
    // Walmart
    'https://www.walmart.com/ip/product/123456',
    // Target
    'https://www.target.com/p/product-name/-/A-123456',
    // Best Buy
    'https://www.bestbuy.com/site/product/123456',
    // AliExpress
    'https://www.aliexpress.com/item/123456789.html',
    // Etsy
    'https://www.etsy.com/listing/123456789/product-name',
    // Zara
    'https://www.zara.com/us/en/product-name-p123456.html',
    // H&M
    'https://www2.hm.com/en_us/productpage.123456.html',
    // Nike
    'https://www.nike.com/t/product-name-123456',
    // Adidas
    'https://www.adidas.com/us/product-name/123456.html'
  ];

  let successCount = 0;
  let totalTests = testUrls.length;

  for (const url of testUrls) {
    try {
      console.log(`🔍 Testing: ${url}`);
      const startTime = Date.now();
      
      const result = await advancedUniversalExtractor.extractProduct(url);
      
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
        successCount++;
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    console.log('---');
  }

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Successful extractions: ${successCount}/${totalTests}`);
  console.log(`📈 Success rate: ${((successCount / totalTests) * 100).toFixed(1)}%`);
  
  // Test specific extraction methods
  console.log('\n🔬 Testing specific extraction methods...');
  
  const testUrl = 'https://www.amazon.com/dp/B08N5WRWNW';
  
  try {
    console.log(`\n🧪 Testing structured data extraction for: ${testUrl}`);
    const structuredResult = await advancedUniversalExtractor.extractWithStructuredData(testUrl);
    console.log('Structured data result:', structuredResult?.title || 'No structured data found');
  } catch (error) {
    console.log('Structured data extraction failed:', error.message);
  }
  
  try {
    console.log(`\n🧪 Testing meta tags extraction for: ${testUrl}`);
    const metaResult = await advancedUniversalExtractor.extractWithMetaTags(testUrl);
    console.log('Meta tags result:', metaResult?.title || 'No meta data found');
  } catch (error) {
    console.log('Meta tags extraction failed:', error.message);
  }
  
  try {
    console.log(`\n🧪 Testing smart selectors extraction for: ${testUrl}`);
    const selectorResult = await advancedUniversalExtractor.extractWithSmartSelectors(testUrl);
    console.log('Smart selectors result:', selectorResult?.title || 'No selector data found');
  } catch (error) {
    console.log('Smart selectors extraction failed:', error.message);
  }
  
  // Clean up
  await advancedUniversalExtractor.close();
  console.log('\n🧹 Cleanup completed');
}

// Run the test
testAdvancedExtraction().catch(console.error);
