import {marked} from "./marked.esm.js";
import "./prism/prism-core.min.js";
import "./prism/prism-autoloader.min.js"

Prism.manual = true;
Prism.plugins.autoloader.languages_path = "/public/js/lib/prism/components/";


/**
 * Decode HTML entities in the content
 * @param markdownText {string} Encoded markdown content
 * @return element {HTMLElement}
 */
export const renderMarkdown = (markdownText) => {
    const html = marked.parse(markdownText);
    const root = document.createElement('div')
    root.classList.add("markdown-body")
    root.innerHTML = html
    Prism.highlightAllUnder(root, true);
    return root
}