<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useToggleStore } from '@/stores/toggle'
const toggleStore = useToggleStore()
const { toggleDarKMode } = storeToRefs(toggleStore)

const darkMode = computed(() => {
    return toggleDarKMode.value ? 'surface-800 text-0' : 'surface-card text-900'
})

const posts = ref([
    {
        "title": 'Test1',
        "content": 'Responsive alternatives are available for customizations based on screen size. Add the responsive breakpoint keyword followed by a semi-colon as a prefix such as md:text-overflow-clip to use a responsive class.',
        "date": 'July 17, 2023 · 12 min',
    },
    {
        "title": 'Test2',
        "content": 'Responsive alternatives are available for customizations based on screen size. Add the responsive breakpoint keyword followed by a semi-colon as a prefix such as md:text-overflow-clip to use a responsive class.',
        "date": 'July 17, 2023 · 12 min',
    },
    {
        "title": 'Test3',
        "content": 'Responsive alternatives are available for customizations based on screen size. Add the responsive breakpoint keyword followed by a semi-colon as a prefix such as md:text-overflow-clip to use a responsive class.',
        "date": 'July 17, 2023 · 12 min',
    },
    {
        "title": 'Test4',
        "content": 'Responsive alternatives are available for customizations based on screen size. Add the responsive breakpoint keyword followed by a semi-colon as a prefix such as md:text-overflow-clip to use a responsive class.',
        "date": 'July 17, 2023 · 12 min',
    }, {
        "title": 'Test5',
        "content": 'Responsive alternatives are available for customizations based on screen size. Add the responsive breakpoint keyword followed by a semi-colon as a prefix such as md:text-overflow-clip to use a responsive class.',
        "date": 'July 17, 2023 · 12 min',
    }
])

</script>

<template>
    <div v-for="post in posts" :key="post.content" class="border-round-lg mx-5 my-5 p-4 shadow-2 flex flex-column gap-2"
        :class="darkMode" style="height: 120px;">
        <div class="font-bold text-3xl" style="height: 30%;">
            {{ post.title }}
        </div>
        <div class="text-500 line-height-3 line w-full" style="height: 50%;">
            {{ post.content }}
        </div>
        <div class=" text-500 text-xs flex align-items-center" style="height: 20%;">
            {{ post.date }}
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