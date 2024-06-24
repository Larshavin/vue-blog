import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router';
const { cookies } = useCookies();

export const useUserStore = defineStore('user', () => {

    const $axios = inject('$axios');
    const router = useRouter();

    const info = ref({
        checkLogin: 'logout',
    })

    const auth = ref({ accessToken: '', id: '' })

    function axiosAuthInterceptors() {
        const api = $axios.create();

        api.interceptors.request.use(
            config => {
                // config.headers.Authorization = `Bearer ${auth.value.accessToken}`
                config.headers.Authorization = `${auth.value.accessToken}`
                return config
            },
            error => {
                return Promise.reject(error)
            }
        )

        api.interceptors.response.use(
            response => {
                return response
            },
            error => {
                if (error.response.status === 401) {
                    api.post('/api/user/refresh_token', {
                        "accessToken": auth.value.accessToken,
                        "refreshToken": cookies.get('refreshToken'),
                    })
                        .then((response) => {
                            // save accessToken to pinia store
                            auth.value.accessToken = response.data.accessToken
                            // save userInfo to cookie
                            cookies.set('refreshToken', response.data.refreshToken, "1d")

                            // retry the request
                            return api.request(error.config)
                        })
                        .catch(() => {
                            router.push({ name: 'Login' });
                        });
                }
                return Promise.reject(error)
            }
        )

        return api
    }
    function setUserInfo() {
        info.value.checkLogin = 'login'
    }
    function returnRole(accessToken) {
        const [header, payload, signature] = accessToken.split('.');
        const decodedPayload = JSON.parse(atob(payload)); // Base64 디코딩
        console.log(decodedPayload.role)
        return decodedPayload.role
    }
    return { info, auth, axiosAuthInterceptors, setUserInfo, returnRole }
}, {
    persist: {
        key: 'auth',
        storage: sessionStorage, //  탭이 닫힐 때 사라짐, 로그아웃시 스토리지에서 삭제해줘야 함
    },
},)