document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.endpoint-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Tab switching
    document.querySelectorAll('.example-tab').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.tab-btn');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const example = tab.closest('.example');
                example.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                example.querySelector('#' + tabId).classList.add('active');
            });
        });
    });

    // Test endpoints
    document.querySelectorAll('.test-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const endpoint = this.dataset.endpoint;
            const method = this.dataset.method;
            
            // Get parent example container
            const example = this.closest('.example');
            const resultDiv = example.querySelector('.test-result') || 
                             document.getElementById('result-' + endpoint.replace(/\//g, '-'));
            
            if (!resultDiv) return;
            
            resultDiv.innerHTML = '<div class="spinner"></div>';
            
            try {
                let url = `http://localhost:4000/api${endpoint}`;
                
                // Handle dynamic endpoints
                if (endpoint.includes(':storeId') || endpoint === '/reels/limit/') {
                    const storeInput = example.querySelector('.store-id-input');
                    if (storeInput) {
                        url = `http://localhost:4000/api${endpoint}${storeInput.value}`;
                    }
                } else if (endpoint === '/products/search') {
                    const query = example.querySelector('.search-query')?.value || '';
                    const category = example.querySelector('.search-category')?.value || '';
                    url = `http://localhost:4000/api/products/search?q=${query}&category=${category}`;
                }
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                
            } catch (error) {
                resultDiv.innerHTML = `<span style="color: #ef4444">❌ Error: ${error.message}</span>`;
            }
        });
    });

    // Reel upload form
    const uploadForm = document.getElementById('reel-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const progressDiv = document.getElementById('upload-progress');
            const resultDiv = document.getElementById('upload-result');
            
            progressDiv.innerHTML = '<div class="spinner"></div><p>Uploading video...</p>';
            resultDiv.innerHTML = '';
            
            try {
                const response = await fetch('http://localhost:4000/api/reels/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                progressDiv.innerHTML = '';
                resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                
            } catch (error) {
                progressDiv.innerHTML = '';
                resultDiv.innerHTML = `<span style="color: #ef4444">❌ Upload failed: ${error.message}</span>`;
            }
        });
    }
});