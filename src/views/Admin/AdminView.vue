<template>
    <div class="flex-col">
        <div class="mb-4">
            Admin Menu
        </div>
        <div class="flex gap-2">
            <Button @click="gotoNewEdit()" class="hover:bg-blue-100"> Write a Post </Button>
            <Button @click="logout()" class="hover:bg-blue-100"> Logout</Button>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { storeToRefs } from 'pinia';

const $axios = inject('$axios');

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const userStore = useUserStore();
const { info, auth } = storeToRefs(userStore);

const router = useRouter()

const gotoNewEdit = () => {
    router.push({ name: 'adminPost' })
}

const logout = async () => {
    try {
        info.value.checkLogin = 'logout'
        await $axios.post('/syyang/logout', {
            accessToken: auth.value.accessToken
        })
        auth.value.accessToken = ''
        router.push({ name: 'home' })
    } catch (error) {
        console.log(error)
    }

}
</script>