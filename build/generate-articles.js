const fs = require('fs');
const path = require('path');
const showdown = require('showdown');

const maxWord = 50;

// Create a showdown converter for markdown parsing
const converter = new showdown.Converter();

// Function to get all markdown files in a directory
function getMarkdownFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            getMarkdownFiles(fullPath, files);
        } else if (path.extname(item) === '.md') {
            files.push(fullPath);
        }
    }

    return files;
}

// Function to extract frontmatter and content from markdown file
function extractArticleInfo(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    //  文件头部有个  <meta title="我的第一篇文章" date="2025-01-01" tags="生活，随笔" />， 从里面获取文件的描述性信息
    const metaMatch = fileContent.match(/^<meta\s+([^>]+)\/?>/);
    let data = {};
    if (metaMatch) {
        const metaString = metaMatch[1];
        const attrRegex = /(\w+)=["']([^"']+)["']/g;
        let match;
        while ((match = attrRegex.exec(metaString)) !== null) {
            const key = match[1];
            let value = match[2];
            // 如果是tags，转换成数组
            if (key === 'tags') {
                value = value.split('，').map(tag => tag.trim());
            }
            data[key] = value;
        }
    }

    const html = converter.makeHtml(fileContent);
    // 获取html中的文本内容
    const content = html.replace(/<[^>]+>/g, '');
    // 获取<meta ... />标签中的属性


    // Extract the relative path for the article
    const relativePath = path.relative('./articles', filePath);
    const fileName = path.basename(filePath);
    const slug = fileName.replace('.md', '');

    // Calculate word count
    const wordCount = content.replace(/\s+/g, ' ').trim().length;

    return {
        title: data.title,
        filePath: relativePath,
        cover: data.cover,
        date: data.date,
        wordCount: wordCount,
        preview: data.desc,
        tags: data.tags || []
    };
}

// Main function to process all articles
function processArticles() {
    console.log('Processing articles...');

    // Get all markdown files in the articles directory
    const markdownFiles = getMarkdownFiles('./articles');

    // Process each markdown file
    const articles = markdownFiles.map(filePath => {
        console.log(`Processing: ${filePath}`);
        return extractArticleInfo(filePath);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Sort articles by modification date (newest first)
    articles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    // Create the data directory if it doesn't exist
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data', {recursive: true});
    }

    // Write the index.json file with all article information
    fs.writeFileSync('./data/article-data.js', `const allArticles = ${JSON.stringify(articles, null, 4)};

export default allArticles;`);

    console.log(`Processed ${markdownFiles.length} articles.`);
    console.log('Article information saved to public/js/api/article-data.js');

    return articles;
}

// Run the processing function
processArticles();

module.exports = {processArticles, extractArticleInfo};