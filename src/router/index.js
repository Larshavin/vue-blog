import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SearchView from '@/views/SearchView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import TagView from '@/views/TagView.vue'
import PostsView from '@/views/PostsView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import TestView from '@/views/TestView.vue'
import AdminView from '@/views/Admin/AdminView.vue'
import AdminPostsView from '@/views/Admin/PostView.vue'
import LoginView from '../views/Admin/LoginView.vue'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView
    },
    {
      path: '/tag',
      name: 'tag',
      component: TagView
    },
    {
      path: '/posts/:number',
      name: 'posts',
      component: PostsView,
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: PostDetailView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin/post',
      name: 'adminPost',
      component: AdminPostsView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    }
  ]
})

const adminPages = ['admin', 'adminPost',]

router.beforeEach(async (to, from, next) => {
  const user = useUserStore();
  const { info, auth } = storeToRefs(user);

  for (const page in adminPages) {
    const name = adminPages[page]
    if (to.name == name) {

      if (info.value.checkLogin == 'logout') {
        console.log('login check failed. redirect to login page.')
        next({ name: 'login' })
        return
      }

      const access = await canAdminAccess(user, auth)
      console.log('access:', access)
      if (!access) {
        next({ name: 'login' })
        return
      }
    }
  }
  next()
}
)

const canAdminAccess = (async (user, auth) => {
  if (user.returnRole(auth.value.accessToken) == 'admin') {
    return true
  } else {
    return false
  }
})

export default router
