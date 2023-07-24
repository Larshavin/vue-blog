<template>
    <div class="mx-3">
        <div>
            <div class="mt-8">
                <RouterLink to="/" style="text-decoration: none; color: inherit;">
                    Home
                </RouterLink> »
                <RouterLink to="/posts" style="text-decoration: none; color: inherit;">
                    Posts
                </RouterLink>
            </div>
            <h1 v-if="options.title">
                {{ options.title }}
            </h1>
            <div v-if="options.date" class="text-600">
                {{ timeFormatChange(options.date) }} · {{ timeToRead }} min read
            </div>
        </div>

        <div
            class="surface-600 text-300 text-lg p-3 mt-3 font-bold border-round flex flex-column align-items-start justify-content-center">
            <div class="">
                <i v-if="!tocOpen" class="pi pi-caret-right" @click="tocClick()"></i>
                <i v-else class="pi pi-caret-down" @click="tocClick()"></i>
                &nbsp; Table of Contents
            </div>
            <div v-if="tocOpen" class="mt-2">
                <div v-for="item in tocItems" :key="item.text" class="m-2 px-3">
                    <div v-html="linkForTitle(item)" class="toc"></div>
                </div>
            </div>

        </div>

        <div id="markdown" class="line-height-4 text-xl custom" v-html="markdownHtml"></div>

        <div v-if="options.Tags" class="flex gap-3">
            <div v-for="tag in options.Tags" :key="tag"
                class="flex align-items-center border-round justify-content-center surface-600 text-300 align-items-center"
                style="height: 40px; width: 60px;">
                {{ tag }}
            </div>
        </div>
        <div class=" flex w-full justify-content-between border-round surface-600 text-300 align-items-center mt-3"
            style="height: 50px;">
            <div class="p-4">
                이전 글
            </div>
            <div class="p-4">
                다음 글
            </div>
        </div>
        <Comment />
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios';
import { RouterLink } from 'vue-router'
import { marked } from 'marked';
// import { markedHighlight } from "marked-highlight";
import fm from 'front-matter';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import Comment from '@/components/Comment.vue';

const markdown = ref('');
const markdownHtml = ref('');
const markdownToHtml = (() => {
    marked.use({ hooks });
    marked.use({ renderer });
    // marked.use(markedHighlight({
    //     langPrefix: 'hljs language-',
    //     highlight(code, lang) {
    //         const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    //         return hljs.highlight(code, { language }).value;
    //     }
    // }));
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
    readingTime(markdown.value);
    nextTick(() => {
        const preElements = document.querySelectorAll('#markdown pre');
        preElements.forEach((preElement) => {
            const button = document.createElement('Button');
            button.classList.add('button', 'absolute', 'text-white', 'p-1', 'border-round');
            button.style.right = '0.25rem';
            button.style.top = '0.4rem';
            button.textContent = 'Copy';
            button.addEventListener('click', () => {
                const lines = preElement.textContent.trim();
                const code = lines.split('\n')
                code.shift()
                const clipboard = code.join('\n').trim();
                window.navigator.clipboard.writeText(clipboard).then(() => {
                    button.textContent = "Copied !"
                    setTimeout(() => {
                        button.textContent = "Copy"
                    }, 5000);
                });
            });
            preElement.appendChild(button);
            preElement.classList.add('relative');
        })
    });
});

const timeToRead = ref(0);
const readingTime = (text) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    timeToRead.value = Math.ceil(minutes);
};

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
    const renderer = new marked.Renderer();
    renderer.code = function (code, language) {
        const codeContent = hljs.highlight(code, { language }).value;
        const langClass = 'language-' + language;

        const template = `
        <pre class="flex flex-column">
            <div class="surface-700 text-white px-2 border-round">${language}</div>
            <code class="hljs ${langClass} border-round">${codeContent}</code></pre>`;
        return template;
    };
    renderer.heading = function (text, level, raw) {
        // console.log(text, level, raw)
        const anchor = raw.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-');
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
            + '<a hidden class="anchor" aria-hidden="true" href="#' + anchor + '">#</a>'
            + '</h'
            + level
            + '>'
    };
    return renderer;
})();
const options = ref({
    title: '',
    date: '',
    Tags: [],
})
const hooks = {
    preprocess(markdown) {
        const data = fm(markdown);
        options.value = data.attributes;
        return data.body;
    }
};

const linkForTitle = (item) => {
    // console.log(item)
    if (item.level == 1) {
        return `<li class="list-none"><a href="#${item.anchor}" class="toc">${item.text}</a></li>`
    }
    else if (item.level == 2) {
        return `<li style="margin-left: 1rem;" class="list-none"><a href="#${item.anchor}" class="toc">${item.text}</a></li>`
    }

}

const timeFormatChange = (time) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
}


const tocOpen = ref(false);
const tocClick = () => {
    tocOpen.value = !tocOpen.value;
}

</script>



<style scoped>
.custom {
    /* Other styles */
    word-wrap: break-word;
    max-width: 100%;
    /* Set the desired maximum width for the content */
}

.custom :deep(a:not(.anchor)) {
    color: #42b983;
    text-decoration: none;
    border-bottom: 1px solid #42b983;
    transition: all 0.3s ease-in-out;
}

.custom :deep(p, h1, h2, h3, h4, h5, h6) {
    user-select: none;
}

.custom :deep(code:not([class])) {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
}

.toc :deep(a) {
    color: inherit;
    text-decoration: none;
}

.toc:hover :deep(a) {
    color: #42b983;
    text-decoration: underline;
}

:deep(h1:hover .anchor) {
    display: inline-flex;
    color: var(--surface-700);
    margin-inline-start: 8px;
    font-weight: 100;
    user-select: none;
    text-decoration: underline;
    text-decoration-thickness: 1px;
}

:deep(.codeTop) {
    margin: 0;
    background-color: #2c1f23;
}

:deep(.circle) {
    div {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin: 0px 5px;
    }
}

:deep(.button) {
    color: #adb5bd;
    box-sizing: border-box;
    transition: 0.2s ease-out;
    cursor: pointer;
    user-select: none;
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0);
    padding: 5px 10px;
    font-size: 0.8em;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0 0.15rem;
}
</style >
