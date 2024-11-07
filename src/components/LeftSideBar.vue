<template>
    <!-- this components has category list -->
    <div class="flex flex-column items-center justify-left h-full">
        <div class="my-8 flex flex-col h-full w-[90%] bg-white shadow-l border-r-2 p-8">
            <div class="flex flex-col items-left justify-center mb-4">
                <div class="text-xl ">카테고리</div>
            </div>
            <div v-for="val, _ in categoryList" class="flex flex-col items-left justify-center my-3 pl-4">
                <div class="text-l hover:text-blue-700" @click="selectCategory(val)">
                    <div v-if="val.id == selectedCategory" class="font-black">
                        {{ val.name }}
                    </div>
                    <div v-else>
                        {{ val.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { storeToRefs } from 'pinia'
import { usePostStore } from '@/stores/post'
const postStore = usePostStore()
const { category } = storeToRefs(postStore)

const router = useRouter();

const categoryList = ref([
    { id: 0, name: '전체' },
    { id: 1, name: '공지사항' },
    { id: 2, name: '개발' },
    { id: 3, name: '소설 / 시' },
    { id: 5, name: '일상' },
    { id: 4, name: '나의 생각' },
]);

const selectedCategory = ref(0);

const selectCategory = (val) => {
    selectedCategory.value = val.id;
    category.value = val.name;

    if (val.id === 0) {
        router.push({ name: 'home' });
        return;
    } else {
        router.push({ name: 'posts', params: { number: 1 } });
        return;
    }
};

</script>