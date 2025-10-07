// Test the NEW simplified product extraction system
import newProductExtractorController from './controllers/newProductExtractorController.js';

const realUrls = [
  'https://www.zara.com/tr/en/wide-fit-jeans-p05585360.html?v1=473299386&v2=2432131',
  'https://www.target.com/p/beats-studio-pro-bluetooth-wireless-headphones/-/A-89459966?preselect=89401493#lnk=sametab',
  'https://www.walmart.com/ip/Dolce-Gabbana-The-One-Men-Eau-De-Parfum-Spray-Cologne-for-Men-5-0-oz/668334187?classType=VARIANT&from=/search',
  'https://www.ebay.com/itm/157255816880?itmmeta=01K4KVRPJWXKAR7QF278XPJDPC&hash=item249d2d56b0:g:LXEAAeSw8eRopIXa&itmprp=enc%3AAQAKAAAA4MHg7L1Zz0LA5DYYmRTS30log18QAWU8YFMvLL8bqy9FuWF0JcQYF6Jtp3nJ1QZkwKTAwieLWmJrfvBM7kOO7d2zMOtbZJCoFE1MwfsmUZAHm3x94LSQELPPkpdZyyeIN6sgkI7Bth%2FNk0HI1Qww4Yq03jBbf4zUO2pPPdybRov%2Fea1C8Rh2CdZ2S1xtQ%2B%2FSEV7AtVSWTnB4gVH6U%2FhCVAJti%2B8Xh0fANjNlfhAGkl8qjI%2FH0QVeGWjGbDynNJekiZS5t0%2FwBU5Zq%2BFeFtnGGBetwezdtbsKb0ahGdWbQKeD%7Ctkp%3ABFBMyOni-6Rm&var=458750343579',
  'https://www.amazon.com/ANRABESS-Womens-Sleeve-Blouses-Clothes/dp/B0DJJPN62D/ref=sr_1_10?_encoding=UTF8&content-id=amzn1.sym.1cb3993a-41fc-4a2a-b2ee-016e70298d9f&crid=19AKO4YZK6ZPJ&dib=eyJ2IjoiMSJ9.JA-ZOcbalcbQXTlzU4reOLT_oir1E5dgePERen3OuDVcqqzfyRx-AG5WClDeCfY3LbClZxMDybROSWvJjGeQvNulLQtKmyYx2Oi3H643aTRpxGBentRU8krPuQNKfLPshQtsDu5szFF9xtIEylxMvr89pUtEnaTTVqPmhjZicBgzSJuWdEg-f8ehFjSavifsSW5l0F7COWn0dmaDR7oFSw5ybEOwEJixws22AhlhaKSJ7ghRjuJTyOtUmqJdDusCNMiocCNXOmHZJ3lOXQeOfZKD4-gOCZZzZndDlQtcpU0.70sl70tpknLcZj6YfuBxxTuHwJuO2II3co4RgJcMicI&dib_tag=se&keywords=Tops&pd_rd_r=a46c308c-6546-46ae-a3be-63a2f564fd4b&pd_rd_w=k1ivq&pd_rd_wg=aeZo9&qid=1757308222&refinements=p_36%3A-2500&rnid=2661611011&sprefix=tops%2Caps%2C250&sr=8-10'
];

async function testNewSystem() {
  console.log('🆕 Testing NEW Simplified Product Extraction System...\n');
  console.log('📝 Focus: Title, Price, Image, Colors/Sizes only\n');
  
  let successCount = 0;
  let manualInputCount = 0;
  let failureCount = 0;
  
  const results = [];
  
  for (let i = 0; i < realUrls.length; i++) {
    const url = realUrls[i];
    const storeName = getStoreName(url);
    
    console.log(`\n🔍 Test ${i + 1}/5: ${storeName}`);
    console.log(`URL: ${url.substring(0, 80)}...`);
    console.log('⏱️  Extracting...');
    
    const startTime = Date.now();
    
    try {
      // Mock request/response
      const mockReq = { body: { url } };
      let responseData = null;
      let statusCode = 200;
      
      const mockRes = {
        json: (data) => { responseData = data; },
        status: (code) => { statusCode = code; return mockRes; }
      };
      
      // Run extraction
      await newProductExtractorController.extractProduct(mockReq, mockRes);
      
      const extractionTime = Date.now() - startTime;
      
      if (responseData?.success) {
        console.log('✅ SUCCESS!');
        console.log(`   ⏱️  Time: ${extractionTime}ms`);
        console.log(`   📝 Title: ${responseData.data.title}`);
        console.log(`   💰 Price: ${responseData.data.price || '❌ Not found'}`);
        console.log(`   🖼️  Image: ${responseData.data.image ? '✅ Found' : '❌ Not found'}`);
        console.log(`   🎨 Colors: ${responseData.data.colors ? `✅ ${responseData.data.colors.length} options` : '❌ Not found'}`);
        console.log(`   📏 Sizes: ${responseData.data.sizes ? `✅ ${responseData.data.sizes.length} options` : '❌ Not found'}`);
        console.log(`   🔧 Method: ${responseData.data.extractionMethod}`);
        
        results.push({
          store: storeName,
          success: true,
          title: !!responseData.data.title,
          price: !!responseData.data.price,
          image: !!responseData.data.image,
          colors: !!responseData.data.colors,
          sizes: !!responseData.data.sizes,
          time: extractionTime
        });
        
        successCount++;
        
      } else if (responseData?.requiresManualInput) {
        console.log('⚠️  MANUAL INPUT REQUIRED');
        console.log(`   ⏱️  Time: ${extractionTime}ms`);
        console.log(`   ❌ Reason: ${responseData.error}`);
        
        results.push({
          store: storeName,
          success: false,
          manual: true,
          reason: responseData.error,
          time: extractionTime
        });
        
        manualInputCount++;
        
      } else {
        console.log('❌ COMPLETE FAILURE');
        console.log(`   ⏱️  Time: ${extractionTime}ms`);
        console.log(`   ❌ Error: ${responseData?.error || 'Unknown error'}`);
        
        results.push({
          store: storeName,
          success: false,
          manual: false,
          error: responseData?.error,
          time: extractionTime
        });
        
        failureCount++;
      }
      
    } catch (error) {
      const extractionTime = Date.now() - startTime;
      console.log('💥 EXCEPTION!');
      console.log(`   ⏱️  Time: ${extractionTime}ms`);
      console.log(`   💥 Error: ${error.message}`);
      
      results.push({
        store: storeName,
        success: false,
        exception: true,
        error: error.message,
        time: extractionTime
      });
      
      failureCount++;
    }
    
    console.log('─'.repeat(60));
  }
  
  // Final Results Summary
  console.log('\n📊 FINAL RESULTS SUMMARY:');
  console.log('═'.repeat(60));
  console.log(`✅ Successful extractions: ${successCount}/${realUrls.length} (${((successCount/realUrls.length)*100).toFixed(1)}%)`);
  console.log(`⚠️  Manual input required: ${manualInputCount}/${realUrls.length} (${((manualInputCount/realUrls.length)*100).toFixed(1)}%)`);
  console.log(`❌ Complete failures: ${failureCount}/${realUrls.length} (${((failureCount/realUrls.length)*100).toFixed(1)}%)`);
  console.log(`📈 Usable results: ${successCount + manualInputCount}/${realUrls.length} (${(((successCount + manualInputCount)/realUrls.length)*100).toFixed(1)}%)`);
  
  // Detailed breakdown
  console.log('\n📋 DETAILED BREAKDOWN:');
  console.log('═'.repeat(60));
  
  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    console.log('\n✅ SUCCESSFUL EXTRACTIONS:');
    successful.forEach(r => {
      const dataPoints = [];
      if (r.title) dataPoints.push('Title');
      if (r.price) dataPoints.push('Price');  
      if (r.image) dataPoints.push('Image');
      if (r.colors) dataPoints.push('Colors');
      if (r.sizes) dataPoints.push('Sizes');
      
      console.log(`   • ${r.store}: ${dataPoints.join(', ')} (${r.time}ms)`);
    });
    
    const avgTime = Math.round(successful.reduce((sum, r) => sum + r.time, 0) / successful.length);
    console.log(`   📊 Average extraction time: ${avgTime}ms`);
  }
  
  const manual = results.filter(r => r.manual);
  if (manual.length > 0) {
    console.log('\n⚠️  MANUAL INPUT REQUIRED:');
    manual.forEach(r => {
      console.log(`   • ${r.store}: ${r.reason} (${r.time}ms)`);
    });
  }
  
  const failed = results.filter(r => !r.success && !r.manual);
  if (failed.length > 0) {
    console.log('\n❌ FAILED EXTRACTIONS:');
    failed.forEach(r => {
      console.log(`   • ${r.store}: ${r.error} (${r.time}ms)`);
    });
  }
  
  // Performance Analysis
  const totalTime = results.reduce((sum, r) => sum + r.time, 0);
  const avgTime = Math.round(totalTime / results.length);
  console.log(`\n⏱️  PERFORMANCE:`);
  console.log(`   • Total time: ${totalTime}ms`);
  console.log(`   • Average time: ${avgTime}ms`);
  console.log(`   • Fastest: ${Math.min(...results.map(r => r.time))}ms`);
  console.log(`   • Slowest: ${Math.max(...results.map(r => r.time))}ms`);
  
  // System Assessment
  console.log('\n🎯 SYSTEM ASSESSMENT:');
  if (successCount >= realUrls.length * 0.8) {
    console.log('🎉 EXCELLENT: System is working very well!');
  } else if (successCount >= realUrls.length * 0.6) {
    console.log('👍 GOOD: System is working well but could be improved');
  } else if (successCount + manualInputCount >= realUrls.length * 0.8) {
    console.log('⚠️  ACCEPTABLE: Low auto-extraction but good manual fallback');
  } else {
    console.log('🚨 NEEDS WORK: System requires significant improvement');
  }
  
  console.log('\n🏁 Test completed!');
}

function getStoreName(url) {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    if (domain.includes('zara')) return 'Zara';
    if (domain.includes('target')) return 'Target';
    if (domain.includes('walmart')) return 'Walmart';
    if (domain.includes('ebay')) return 'eBay';
    if (domain.includes('amazon')) return 'Amazon';
    return domain.replace('www.', '').split('.')[0];
  } catch {
    return 'Unknown';
  }
}

// Run the test
testNewSystem().catch(console.error);
