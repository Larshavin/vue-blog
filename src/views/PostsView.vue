<!-- <script setup>
import { ref } from 'vue';
import Posts from '@/components/PostsComponent.vue';
import { useRoute } from 'vue-router'

import { storeToRefs } from 'pinia'
import { usePostStore } from '@/stores/post'
const postStore = usePostStore()
const { category } = storeToRefs(postStore)
const route = useRoute()
</script>

<template>
    <div class="flex flex-col " style="height: 100%;">
        <div class="mt-8">
            <RouterLink to="/" style="text-decoration: none; color: inherit;">
                Home
            </RouterLink>
        </div>
        <h1>
            {{ categoryFromQuery }} 게시글
        </h1>
        <div class="overflow-y-auto no-scroll mt-3">
            <Posts :number="Number(route.params.number)" :category="categoryFromQuery" />
        </div>
    </div>
</template> -->


<script setup>
import Posts from '@/components/PostsComponent.vue';
import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/post';
const postStore = usePostStore();
const { category } = storeToRefs(postStore);
const route = useRoute();

</script>

<template>
    <div class="flex flex-col" style="height: 100%;">
        <div class="mt-8">
            <RouterLink to="/" style="text-decoration: none; color: inherit;">
                Home
            </RouterLink>
        </div>
        <h1>
            {{ category }} 게시글
        </h1>
        <div class="overflow-y-auto no-scroll mt-3">
            <Posts :key="category" :number="Number(route.params.number)" :category="category" />
        </div>
    </div>
</template>