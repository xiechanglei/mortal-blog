import {fetchArticleDetail} from "./api/article.api.js"
import {renderMarkdown} from "./lib/markdown-renderer.js";
// Article detail JavaScript file
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load the specific article detail
async function loadArticleDetail() {
    const slug = getUrlParameter('slug');
    try {
        const markdownResponse = await fetchArticleDetail(slug);

        document.getElementById('article-title').textContent = markdownResponse.title;
        document.getElementById('page-title').textContent = `${markdownResponse.title} - Mortal's Blog`;
        document.getElementById('article-date').textContent = markdownResponse.date;
        document.getElementById('article-word-count').textContent = `${markdownResponse.wordCount} 字`;
        const markdownContent = markdownResponse.content

        // Convert markdown to HTML using a client-side converter
        // First, let's implement a simple markdown converter
        document.getElementById('article-content').innerHTML = renderMarkdown(markdownContent);
    } catch (error) {
        console.error('Error loading article detail:', error);
        document.getElementById('article-content').innerHTML = '<p>加载文章时出错，请稍后重试。</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadArticleDetail);