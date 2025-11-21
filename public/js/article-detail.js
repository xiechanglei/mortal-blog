import {fetchArticleDetail} from "./article.api.js"

// Article detail JavaScript file
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load the specific article detail
async function loadArticleDetail() {
    const slug = getUrlParameter('slug');


    try {
        // // First, get the article information from the index
        // const response = await fetch('../data/index.json');
        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const articles = await response.json();
        //
        // // Find the specific article
        // const article = articles.find(a => a.slug === slug);
        //
        // if (!article) {
        //     document.getElementById('article-content').innerHTML = '<p>未找到文章</p>';
        //     return;
        // }
        //
        // // Update the page with article info
        // document.getElementById('article-title').textContent = article.title;
        // document.getElementById('page-title').textContent = `${article.title} - Mortal's Blog`;
        // document.getElementById('article-date').textContent = formatDate(article.modified);
        // document.getElementById('article-word-count').textContent = `${article.wordCount} 字`;
        //
        // if (article.cover) {
        //     document.getElementById('article-cover').src = article.cover;
        // } else {
        //     document.getElementById('article-cover').style.display = 'none';
        // }

        // Load the actual markdown content
        const markdownResponse = await fetchArticleDetail(slug);
        console.log(markdownResponse)
        if (!markdownResponse.ok) {
            throw new Error(`HTTP error! status: ${markdownResponse.status}`);
        }
        const markdownContent = await markdownResponse.text();

        // Convert markdown to HTML using a client-side converter
        // First, let's implement a simple markdown converter
        const htmlContent = convertMarkdownToHtml(markdownContent);
        document.getElementById('article-content').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading article detail:', error);
        document.getElementById('article-content').innerHTML = '<p>加载文章时出错，请稍后重试。</p>';
    }
}

// Proper markdown to HTML conversion using showdown library
function convertMarkdownToHtml(md) {
    const converter = new showdown.Converter();
    converter.setOption('tables', true);
    converter.setOption('tasklists', true);
    converter.setOption('ghCodeBlocks', true);
    converter.setOption('smoothLivePreview', true);
    converter.setOption('smartIndentationFix', true);

    return converter.makeHtml(md);
}

// Helper function to format dates
function formatDate(dateString) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}

document.addEventListener('DOMContentLoaded', loadArticleDetail);