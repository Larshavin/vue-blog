<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import { marked } from 'marked';

const markdown = ref('');
const markdownHtml = ref('');
const markdownToHtml = (() => {
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
    const path = 'src/assets/posts/vue.js/vue1.md'
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
    <div v-html="markdownHtml"></div>
</template>
