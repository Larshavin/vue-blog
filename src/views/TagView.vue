<script setup>

import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const $axios = inject('$axios');
const tags = ref([]);
const posts = ref([]);

onMounted(() => {
    getTags();
})


const getTags = async () => {
    try {
        const response = await $axios.get(import.meta.env.VITE_ENDPOINT + 'syyang/tag');
        tags.value = response.data.tags;
    } catch (error) {
        console.error(error);
    }
}

const getPostsByTag = async (tag) => {
    try {
        const response = await $axios.get(import.meta.env.VITE_ENDPOINT + 'syyang/tag/' + tag);
        posts.value = response.data.postList;
        console.log(response.data.postList);
    } catch (error) {
        console.error(error);
    }
}

const changeRouteToPost = (post) => {
    router.push({ name: 'postDetail', params: { id: post.title } });
}

</script>

<template>
    <div class="border-2">
        <div class="flex justify-between items-center">
            <div class="flex items center">
                <div class="text-2xl font-bold">Tags</div>
                <div class="text-slate-500 font-xs ml-2">({{ tags.length }})</div>
            </div>
        </div>

        <!-- 태그 카드 나열 -->
        <div class="flex flex-wrap gap-2">
            <div v-for="tag in tags" :key="tag.id" class="rounded-lg p-2 shadow-xl flex items-center cursor-pointer">
                <div class="text-slate-500 font-xs" @click="getPostsByTag(tag.name)">{{ tag.name }}</div>
            </div>
        </div>

        <div>구분선</div>

        <!-- 태그 카드 선택시 관련 게시글 불러오기 -->
        <div class="flex flex-wrap gap-2">
            <div v-if="posts.length == 0" class="text-slate font-xs">게시글이 없습니다.</div>
            <div v-for="post in posts" :key="post.id" class="rounded-lg p-2 shadow-xl flex items-center cursor-pointer">
                <div class="text-slate font-xs" @click="changeRouteToPost(post)">{{ post.title }}</div>
            </div>
        </div>
    </div>
</template>
