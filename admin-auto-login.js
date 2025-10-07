// Admin Login Helper Script
// Run this in your browser console to automatically log in as admin

async function autoLoginAdmin() {
    try {
        console.log('🔐 Attempting admin login...');
        
        const response = await fetch('http://localhost:5000/api/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: 'test@test.com', 
                password: 'test123' 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        
        console.log('✅ Admin login successful!');
        console.log('👤 Admin:', data.admin.name);
        console.log('🔑 Token stored in localStorage');
        console.log('🔄 Please refresh the page to use the new token');
        
        return data;
        
    } catch (error) {
        console.error('❌ Admin login failed:', error.message);
        throw error;
    }
}

// Auto-run the login
autoLoginAdmin().then(() => {
    console.log('🎉 Ready! You can now access admin features.');
}).catch((error) => {
    console.error('💥 Failed to auto-login:', error);
});
