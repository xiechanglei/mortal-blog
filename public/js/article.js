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
        console.log(markdownResponse)

        document.getElementById('article-title').textContent = markdownResponse.title;
        document.getElementById('page-title').textContent = `${markdownResponse.title} - Mortal's Blog`;
        document.getElementById('article-date').textContent = markdownResponse.date;
        document.getElementById('article-word-count').textContent = `${markdownResponse.wordCount} 字`;
        document.getElementById('article-content').innerHTML = "";
        document.getElementById('article-content').append(renderMarkdown(markdownResponse.content))
    } catch (error) {
        console.error('Error loading article detail:', error);
        document.getElementById('article-content').innerHTML = '<p>加载文章时出错，请稍后重试。</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadArticleDetail);