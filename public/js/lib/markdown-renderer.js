import {marked} from "./marked.esm.js";
import  "./prism/prism-core.min.js";
import "./prism/prism-autoloader.min.js"

Prism.plugins.autoloader.languages_path = "/public/js/lib/prism/";
console.log(Prism.plugins.autoloader);
// init marked
marked.setOptions({
    highlight: function (code, lang) {
        if (Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        } else {
            return code;
        }
    }
});



/**
 * Decode HTML entities in the content
 * @param markdownText {string} Encoded markdown content
 * @return string
 */
export const renderMarkdown = (markdownText) => {
    return marked.parse(markdownText)
}