<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToggleStore } from '@/stores/toggle'
const toggleStore = useToggleStore()
const { toggleDarKMode } = storeToRefs(toggleStore)

const router = useRouter()

const darkMode = computed(() => {
    return toggleDarKMode.value ? 'surface-800 text-0' : 'surface-card text-900'
})

const posts = ref()
onMounted(async () => {
    await getPosts();
});

const timeFormatChange = (time) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);

    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
}

const id = ref(1)
const getPosts = async () => {
    try {
        const response = await axios.get('http://192.168.15.246:8080/posts/' + id.value);
        posts.value = response.data;
    } catch (error) {
        console.error(error);
    }
}

const seePostDetail = (path) => {
    router.push({ name: 'postDetail', params: { id: path } })
}

</script>

<template>
    <div v-for="post in posts" :key="post.content" class="border-round-lg mx-5 my-5 p-4 shadow-2 flex flex-column gap-2"
        :class="darkMode" style="height: 120px;" @click="seePostDetail(post.path)">
        <div class="font-bold text-3xl" style="height: 30%;">
            {{ post.matter.Title }}
        </div>
        <div class="text-500 line-height-3 line w-full" style="height: 50%;">
            <div v-if="post.matter.Content == ''">
                {{ post.matter.Title }}
            </div>
            <div v-else>
                {{ post.matter.Content }}
            </div>
        </div>
        <div class=" text-500 text-xs flex align-items-center" style="height: 20%;">
            {{ timeFormatChange(post.matter.Date) }}
        </div>
    </div>
</template>

<style scoped>
.line {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
</style>