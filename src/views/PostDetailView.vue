<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import { marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const markdown = ref('');
const markdownHtml = ref('');
const markdownToHtml = (() => {

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
        gfm: true,
        mangle: false,
        headerIds: false,
    });
    return output
});

onMounted(async () => {
    const path = '../src/assets/posts/vue.js/vue1.md'
    await getMarkdown(path);
    markdownHtml.value = await markdownToHtml();
    console.log(markdownHtml.value)
});

const getMarkdown = async (path) => {
    try {
        const response = await axios.get(path);
        markdown.value = response.data;
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <div>
        page detail
    </div>
    <div class="line-height-4 text-xl custom" v-html="markdownHtml"></div>
</template>

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
