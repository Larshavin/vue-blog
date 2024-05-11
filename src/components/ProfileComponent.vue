<template>
    <div class="profile">
        <div class="flex">
            <div class="w-[150px] h-[150px] rounded-full bg-blue-50 mr-8">
                <img src="https://avatars.githubusercontent.com/u/89558536?v=4" alt="profile"
                    class="w-full h-full rounded-full">
            </div>
            <div>
                <div class="mb-3 font-bold text-3xl">
                    {{ props.title }}
                </div>
                <div v-html="introduce" class="font-medium" style="line-height:170%;"></div>
                <div class=" flex mt-4 gap-3">
                    <a href="https://github.com/Larshavin" target="_blank" style="color: inherit; ">
                        <i class="pi pi-github" style="font-size: 1.6rem"></i>
                    </a>
                    <a href="https://www.instagram.com/larshavin/" target="_blank" style="color: inherit; ">
                        <i class="pi pi-instagram" style="font-size: 1.6rem"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    introduce: {
        type: String,
        required: true,
    },
})

const introduce = computed(() => {
    return props.introduce.replace(/\n/g, '<br />')
})
</script>

<style scoped>
.profile {
    /* width: 100%;
    height: 100%; */
    margin: 8rem 2rem 1rem 2rem;
}
</style>