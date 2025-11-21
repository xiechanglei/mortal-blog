// Main JavaScript file for Mortal's Blog
let allArticles = []; // Store all articles for search functionality

document.addEventListener('DOMContentLoaded', function() {
    // Load articles when page loads
    loadArticles();

    // Add event listener for search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Function to load articles from the data/index.json file
async function loadArticles() {
    try {
        const response = await fetch('data/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allArticles = await response.json();
        displayArticles(allArticles);
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articles-grid').innerHTML = '<p>加载文章时出错，请稍后重试。</p>';
    }
}

// Function to display articles in the grid
function displayArticles(articles) {
    const articlesGrid = document.getElementById('articles-grid');
    
    if (articles.length === 0) {
        articlesGrid.innerHTML = '<p>暂无文章</p>';
        return;
    }
    
    articlesGrid.innerHTML = articles.map(article => `
        <div class="article-card">
            ${article.cover ? `<img src="${article.cover}" alt="${article.title}" class="article-cover" onerror="this.onerror=null; this.src='public/images/default-cover.jpg';">` : 
            `<div class="article-cover" style="background-color: #ddd; height: 160px; display: flex; align-items: center; justify-content: center;">无封面图</div>`}
            <div class="article-info">
                <h3 class="article-title">
                    <a href="pages/article.html?slug=${article.slug}" title="${article.title}">${article.title}</a>
                </h3>
                <div class="article-meta">
                    <span class="article-date">${formatDate(article.modified)}</span>
                    <span class="article-word-count">${article.wordCount} 字</span>
                </div>
                <p class="article-preview">${article.preview}</p>
            </div>
        </div>
    `).join('');
}

// Function to perform search
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    if (!searchTerm) {
        displayArticles(allArticles); // Show all articles if search term is empty
        return;
    }

    const filteredArticles = allArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.preview.toLowerCase().includes(searchTerm) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    displayArticles(filteredArticles);
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}

// Add default cover image if needed
function addDefaultCover() {
    // This function would be called for images that fail to load
    // It's referenced in the HTML template
}