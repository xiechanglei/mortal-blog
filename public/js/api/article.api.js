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
export const fetchArticleDetail = async (id) => {
    const article = articleData.find(a => a.filePath === id);
    if (!article) {
        return Promise.reject(new Error('Article not found'));
    } else {
        const content = await getMarkdownContent(`/articles/${article.filePath}`);
        return {...article, content};
    }
}


/**
 * Fetch markdown content from a file path
 * @param filePath {string} Path to the markdown file
 * @return {Promise<string>} Promise resolving to the markdown content
 */
export const getMarkdownContent = async (filePath) => {
    return fetch(filePath).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    });
}