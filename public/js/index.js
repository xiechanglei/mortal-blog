import {allArticles} from "./api/article.api.js"

/**
 * {import('../types/def').Article} Article
 */

/**
 * 定义如何渲染每篇文章的卡片的html内容
 * todo  后期如果数据量大，可以做成异步分段渲染
 * @param article {Article} 文章对象
 * @returns {string}
 */
const renderArticle = (article) => {
    return `<div class="article-card">
        <img src="${article.cover}" alt="${article.title}" class="article-cover">
        <div class="article-info">
            <h3 class="article-title">
                <a href="pages/article.html?slug=${article.filePath}">${article.title}</a>
            </h3>
            <div class="article-meta">
                <span class="article-date">${article.date}</span>
                <span class="article-word-count">${article.wordCount} 字</span>
            </div>
            <p class="article-preview">${article.preview}</p>
        </div>
    </div>`
}

/**
 * 显示文章列表
 * @param articles {Array<Article>} 文章数组
 */
const renderArticles = (articles) => {
    const articlesGrid = document.getElementById('articles-grid');

    if (articles.length === 0) {
        articlesGrid.innerHTML = '<p>暂无文章</p>';
        return;
    }
    articlesGrid.innerHTML = articles.map(renderArticle).join('');
}

/**
 * 执行搜索并更新文章列表
 */
const performSearch = (searchTerm) => {
    searchTerm = searchTerm.toLowerCase().trim();

    if (!searchTerm) {
        renderArticles(allArticles); // 显示所有文章
        return;
    }

    const filteredArticles = allArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.preview.toLowerCase().includes(searchTerm) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    renderArticles(filteredArticles);
};

// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch(e.currentTarget.value));

    performSearch("")

    // 代理绑定grid下的点击事件，跳转到card对应的文章页面
    document.getElementById('articles-grid').addEventListener('click', function (e) {
        const card = e.target.closest('.article-card');
        if (card) {
            const link = card.querySelector('.article-title a');
            if (link) {
                window.location.href = link.href;
            }
        }
    });
});

