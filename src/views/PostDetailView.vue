<template>
    <div>
        {{ options }}
    </div>
    <div>
        {{ tocItems }}
    </div>
    <div class="line-height-4 text-xl custom" v-html="markdownHtml"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import { marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import fm from 'front-matter';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const markdown = ref('');
const markdownHtml = ref('');
const markdownToHtml = (() => {
    marked.use({ hooks });
    marked.use({ renderer });
    marked.use(markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    }));
    const output = marked(markdown.value, {
        async: true,
        pedantic: false,
        headerIds: false,
        gfm: true,
        mangle: false,
    });
    return output
});

onMounted(async () => {
    const path = '../src/assets/posts/vue.js/vue1.md'
    await getMarkdownFile(path);
    markdownHtml.value = await markdownToHtml();
});

const getMarkdownFile = async (path) => {
    try {
        const response = await axios.get(path);
        markdown.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

const tocItems = ref([]);
const renderer = (() => {
    var renderer = new marked.Renderer();
    renderer.heading = function (text, level, raw) {
        var anchor = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
        tocItems.value.push({
            anchor: anchor,
            level: level,
            text: text
        });
        return '<h'
            + level
            + ' id="'
            + anchor
            + '">'
            + text
            + '</h'
            + level
            + '>'
    };
    return renderer;
})();
const options = ref()
const hooks = {
    preprocess(markdown) {
        const data = fm(markdown);
        options.value = data.attributes;
        return data.body;
    }
};
</script>



<style scoped>
.custom ::v-deep a {
    color: #42b983;
    text-decoration: none;
    border-bottom: 1px solid #42b983;
    transition: all 0.3s ease-in-out;
}

.custom ::v-deep code:not([class]) {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
}
</style >
