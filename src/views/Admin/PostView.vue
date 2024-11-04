<script setup>

//  https://yy-z-a.tistory.com/14
import { onMounted, ref, onUnmounted, onBeforeUnmount, inject } from 'vue';

import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const $axios = inject('$axios');

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);
const editor = ref();
const editorValid = ref();
const html = ref();

const markdownToHtml = ((markdown) => {
    marked.use({ renderer });
    const output = marked(markdown, {
        async: true,
        pedantic: false,
        headerIds: false,
        gfm: true,
        mangle: false,
    });
    return output
});


const tocItems = ref([]);
const renderer = (() => {
    const renderer = new marked.Renderer();
    renderer.code = function (code, language) {

        const codeContent = language ? hljs.highlight(code, { language }).value : hljs.highlightAuto(code).value;
        const langClass = 'language-' + language;

        const template = `
        <pre class="flex flex-col">
            <div class="bg-slate-700 text-white px-2 py-2 rounded">${language}</div>
            <code class="hljs ${langClass} rounded text-base mb-3 inline-block">${codeContent}</code></pre>`;
        return template;
    };
    renderer.image = function (href, title, text) {
        const path = import.meta.env.VITE_ENDPOINT + 'syyang/image/' + href
        return `<div class="flex justify-center"><img src="${path}" alt="${text}" title="${title}" class="img border-1 rounded z-2 border-300" /></div>`; // for local references
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

const uploadedImage = ref([]);
const tmpID = ref();

//마운트될때 Editor 생성
onMounted(async () => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    tmpID.value = Math.random().toString(36).substr(2, 11);
    // console.log(tmpID.value);

    await tmpCreate();

    editorValid.value = new Editor({
        el: editor.value,
        toolbarItems: [
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task', 'indent', 'outdent'],
            ['table', 'image', 'link'],
            ['code', 'codeblock'],
        ],
        height: '800px',
        initialEditType: 'markdown',
        hooks: {
            addImageBlobHook: async (blob, callback) => {
                const formData = new FormData();
                formData.append('image', blob);
                console.log(blob);

                var url = import.meta.env.VITE_ENDPOINT + "syyang/tmp/image/"
                const response = await fetch(url + tmpID.value, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                // console.log(data.path);
                uploadedImage.value.push(data.name);
                callback(data.path, 'image');
            },
        },
        events: {
            change: async () => {
                emit('update:modelValue', editorValid.value.getMarkdown()),
                    html.value = await markdownToHtml(editorValid.value.getMarkdown());
            }
        },
    });
});

// 페이지 떠날 때 처리
onUnmounted(async () => {
    await tmpImageDelete();
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
});

const tmpCreate = async () => {
    const response = await fetch(import.meta.env.VITE_ENDPOINT + "syyang/tmp/image/" + tmpID.value, {
        method: 'GET',
    });
    // const data = await response.json();
    // console.log(data);
};

const tmpImageDelete = async () => {
    const response = await fetch(import.meta.env.VITE_ENDPOINT + "syyang/tmp/image/" + tmpID.value, {
        method: 'DELETE',
    });
    const data = await response.json();
    console.log(data);
};

const tags = ref([])
const tag = ref('')
const category = ref('')
const title = ref(null)

const savePost = async () => {
    const data = {
        title: title.value,
        content: editorValid.value.getMarkdown(),
        images: uploadedImage.value,
        tag: tags.value,
        category: category.value,
        tempPath: tmpID.value,
    };

    try {
        const response = await $axios.post('/syyang/post', data);
        console.log(response);
        router.push({ name: 'admin' });

    } catch (error) {
        console.log(error);
    }
};

const handleBeforeUnload = async (event) => {

    event.preventDefault(); event.returnValue = '';
    event.returnValue = '';

    // alert("변경사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?");

    await tmpImageDelete();
}

const addtag = () => {

    if (tag.value === '') {
        return;
    }

    if (tags.value.includes(tag.value)) {
        return;
    }

    tags.value.push(tag.value);
    tag.value = '';
}

const visible = ref(false);
const showContent = () => {
    visible.value = !visible.value;
}

</script>


<template>
    <div>
        <div class="flex flex-row gap-2 items-center">
            <div class="basis-20">
                Title
            </div>
            <InputText class="grow" type="text" v-model="title" />
        </div>
        <div class="flex flex-row gap-2 items-center mt-4">
            <div class="basis-20">
                Category
            </div>
            <InputText class="grow" type="text" v-model="category" />
        </div>
        <div class="mt-4">
            <div class="flex flex-row gap-2 mb-3">
                <div class="basis-20">
                    Tags
                </div>
                <div>
                    <InputText class="mr-4" type="text" v-model="tag" @keyup.enter="addtag()" />
                    <Button @click="addtag()" class="hover:bg-red-100">Add</Button>
                </div>
                <div>
                    <Button @click="savePost()" class="hover:bg-blue-100">게시글 등록</Button>
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <div v-for="tag in tags" :key="tag">
                    <div
                        class="rounded-lg bg-white w-full flex items-center justify-center text-center border-slate-300 border-2 mx-1 pl-2 gap-1">
                        <span> {{ tag }} </span>
                        <!-- <Button class="text-rose-600 size-0.5 border-none p-0">X</Button> -->
                        <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"
                            @click="tags.splice(tags.indexOf(tag), 1)" class="text-[10px] m-0 p-0 w-0.5" />
                    </div>
                </div>
            </div>
        </div>

        <div ref="editor" class="my-4" />

        <div class="border-2 rounded min-h-[50px] bg-white mb-4">
            <div class="font-bold px-2">
                첨부한 사진 : {{ uploadedImage.length }} 개
            </div>
            <!-- 구분선 -->
            <div class="w-full h-0.5 bg-slate-200 "></div>
            <div v-if="uploadedImage.length == 0">
                <div class="text-slate-500 px-4"> 저장 된 사진이 없습니다. </div>
            </div>
            <div>
                <div v-for="image in uploadedImage" :key="image">
                    <div> {{ image }} </div>
                </div>
            </div>
        </div>


        <!-- <div v-html="testValid"></div> -->
        <div @click="showContent()">
            미리보기
            <span v-if="!visible" class="hover:text-red-400">
                <i class="pi pi-angle-right"></i>
            </span>
            <span v-else class="text-red-400 font-bold">
                <i class="pi pi-angle-down"></i>
            </span>
        </div>
        <div v-if="visible">
            <div class="w-full h-1 bg-slate-200 mt-4 mb-7"></div>
            <div id="markdown" class="line-height-4 text-xl custom" v-html="html"></div>
            <div class="w-full h-1 bg-slate-200 mt-7 mb-4"></div>
        </div>

    </div>
</template>
