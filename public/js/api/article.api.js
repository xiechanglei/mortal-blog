import articleData from "./article-data.js";

/**
 * {import('../types/def').Article} Article
 */

/**
 *  所有的文章数据
 *  @type {Array<Article>}
 */
export const allArticles = articleData

/**
 * Fetch article detail by ID
 * @param id {string} Article ID
 * @returns {Promise<Article & {content:string}>} Promise resolving to the article detail
 */
export const fetchArticleDetail = (id) => {
    const article = articleData.find(a => a.filePath === id);
    if (!article) {
        return Promise.reject(new Error('Article not found'));
    } else {
        return fetch(`/articles/${article.filePath}`).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        }).then(markdownContent => {
            return {...article, content: markdownContent};
        });
    }
}