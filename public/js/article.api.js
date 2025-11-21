import articleData from "./article-data.js";

export const loadArticles = () => articleData

/**
 * Fetch article detail by ID
 * @param id {string} Article ID
 */
export const fetchArticleDetail = (id) => {
    new Promise((resolve, reject) => {
        const article = articleData.find(a => a.slug === id);
        if (article) {
            resolve(article);
        } else {
            reject(new Error('Article not found'));
        }
    }).then(article => fetch(`/articles/${article.filePath}`)).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    }).then(markdownContent => {
        return {...article, content: markdownContent};
    });
}