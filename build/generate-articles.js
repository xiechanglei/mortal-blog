const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
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
    const {data, content} = matter(fileContent);

    // Extract the relative path for the article
    const relativePath = path.relative('./articles', filePath);
    const fileName = path.basename(filePath);
    const slug = fileName.replace('.md', '');

    // Calculate word count
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    // Get file modification time
    const stats = fs.statSync(filePath);
    const modTime = stats.mtime.toISOString();

    // Extract the first few lines as preview (without markdown syntax)
    const previewLines = content.split('\n').filter(line => line.trim() !== '').slice(0, 5);
    const preview = previewLines.join(' ').substring(0, maxWord) + '...';

    return {
        title: data.title,
        filePath: relativePath,
        cover: data.cover || data.image || '',
        date: data.date,
        wordCount: wordCount,
        preview: preview,
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
    });

    // Sort articles by modification date (newest first)
    articles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    // Create the data directory if it doesn't exist
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data', {recursive: true});
    }

    // Write the index.json file with all article information
    fs.writeFileSync('./public/js/api/article-data.js', `const allArticles = ${JSON.stringify(articles, null, 4)};

export default allArticles;`);

    console.log(`Processed ${markdownFiles.length} articles.`);
    console.log('Article information saved to public/js/api/article-data.js');

    return articles;
}

// Run the processing function
processArticles();

module.exports = {processArticles, extractArticleInfo};