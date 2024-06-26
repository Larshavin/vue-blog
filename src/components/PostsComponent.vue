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
    return toggleDarKMode.value ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
})

const darkModeButton = computed(() => {
    return toggleDarKMode.value ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'
})

const props = defineProps({
    number: {
        type: Number,
        required: true
    }
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

const id = ref(props.number)
const rows = ref(5)
const first = ref((id.value - 1) * rows.value)
const postLength = ref(0)
const getPosts = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_ENDPOINT + 'syyang/posts/' + id.value + '/' + rows.value);
        posts.value = response.data.posts;
        postLength.value = response.data.length;

        console.log(posts.value);
    } catch (error) {
        console.error(error);
    }
}

const seePostDetail = (path) => {
    router.push({ name: 'postDetail', params: { id: path } })
}

const PaginatorDisable = (() => {
    // var color = toggleDarKMode.value ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
    return 'text-xl border-circle border-none w-2rem h-2rem hover:surface-ground m-1 hover:text-color'
})()

const PaginatorActive = (() => {
    // var color = toggleDarKMode.value ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'
    return ' text-xl border-circle border-none m-1 w-2rem h-2rem'
})()

const PaginatorHidden = ((context) => {
    if (context.disabled) {
        return 'text-xl border-circle border-none w-2rem h-2rem m-1'
    } else {
        return 'text-xl border-circle border-none w-2rem h-2rem hover:surface-ground m-1 hover:text-color cursor-pointer'
    }
})

const changePage = (event) => {
    id.value = event.page + 1;
    getPosts();
}

</script>

<template>
    <div v-for="post in posts" :key="post.content"
        class="rounded-lg mx-5 my-8 p-5 shadow-xl flex flex-col gap-2 cursor-pointer" :class="darkMode"
        style="height: 168px;" @click="seePostDetail(post.path)">
        <div class="font-bold text-title overflow-hidden white-space-nowrap text-overflow-ellipsis"
            style="height: 30%;">
            {{ post.matter.Title }}
        </div>
        <div class="text-slate-500 line-height-3 line w-full" style="height: 50%;">
            <div v-if="post.matter.Content == ''">
                {{ post.matter.Title }}
            </div>
            <div v-else>
                {{ post.matter.Content }}
            </div>
        </div>
        <div class=" text-slate-500 font-xs flex items-center" style="height: 20%;">
            {{ timeFormatChange(post.matter.Date) }}
        </div>
    </div>
    <div class="flex justify-center my-3">
        <Paginator :class="darkMode" v-model:first="first" :rows="rows" :totalRecords="postLength" :pt="{
            root: () => ({
                class: 'flex justify-center items-center rounded-lg border-none h-3rem',
            }),
            pageButton: ({ context }) => ({
                // class: (context.active ? PaginatorActive : )
                class: (context.active ? darkModeButton + PaginatorActive : PaginatorDisable)
            }),
            firstPageButton: ({ context }) => ({
                class: PaginatorHidden(context)
            }),
            previousPageButton: ({ context }) => ({
                class: PaginatorHidden(context)
            }),
            nextPageButton: ({ context }) => ({
                class: PaginatorHidden(context)
            }),
            lastPageButton: ({ context }) => ({
                class: PaginatorHidden(context)
            }),

        }" @page="changePage($event)"></Paginator>
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