// scripts/testRouteLoading.js - Test Route Loading
import app from '../App.js';

console.log('🧪 Testing Route Loading...\n');

// Get all registered routes
const routes = [];
if (app._router && app._router.stack) {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      if (middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push({
              path: middleware.regexp.source + handler.route.path,
              methods: Object.keys(handler.route.methods)
            });
          }
        });
      }
    }
  });
}

console.log('✅ All registered routes:');
routes.forEach(route => {
  console.log(`   ${route.methods.join(', ').toUpperCase()} ${route.path}`);
});

// Check for BuyForMe routes specifically
const buyForMeRoutes = routes.filter(route => 
  route.path.includes('buyforme') || route.path.includes('buyme')
);

console.log('\n📦 BuyForMe Routes:');
if (buyForMeRoutes.length > 0) {
  buyForMeRoutes.forEach(route => {
    console.log(`   ✅ ${route.methods.join(', ').toUpperCase()} ${route.path}`);
  });
} else {
  console.log('   ❌ No BuyForMe routes found');
}

// Test specific routes
console.log('\n🔍 Testing Specific Routes');
const testRoutes = [
  '/api/admin/buyforme-requests',
  '/api/user/buyforme-requests',
  '/api/buyme',
  '/api/admin/buyme'
];

testRoutes.forEach(route => {
  const found = routes.some(r => r.path.includes(route.replace('/api/', '')));
  console.log(`   ${found ? '✅' : '❌'} ${route}`);
});

console.log('\n🎉 Route loading test completed!');
