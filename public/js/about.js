import {getMarkdownContent} from "./api/article.api.js"
import {renderMarkdown} from "/lib/markdown-renderer.js";

// Function to load the specific article detail
async function loadAboutDetail() {
    try {
        const content = await getMarkdownContent("/README.MD");
        document.getElementById('article-content').append(renderMarkdown(content))
    } catch (error) {
        console.error('Error loading article detail:', error);
        document.getElementById('article-content').innerHTML = '<p>加载文章时出错，请稍后重试。</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadAboutDetail);