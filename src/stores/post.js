import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', () => {
    const category = ref("전체")
    const categoryMap = {}
    return { category, categoryMap }
})