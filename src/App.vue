<script setup>
import { ref, onMounted } from 'vue';
import NavBar from './components/NavBar.vue';

const navbarRef = ref(null);
const contentHeight = ref(null);
// const navbarHeight = reactive({ value: 0 });

onMounted(() => {
  // Get the height of the navbar_div element
  if (navbarRef.value) {
    contentHeight.value = `calc(100vh - ${navbarRef.value.offsetHeight}px)`
  }
});

const toggleDarKMode = ref(true);
</script>

<template>
  <div id="main" :class="[toggleDarKMode ? 'surface-900 text-300' : 'bg-blue-50']"
    style="width: 100%; height: 100vh; min-width: 360px;">
    <div id="navbar_div" class="flex flex-column align-items-center" ref="navbarRef">
      <NavBar class="navbar my-3" title="Geronimo! ~" :toggle="toggleDarKMode"
        @toggle-change="toggleDarKMode = !toggleDarKMode" />
    </div>
    <div id="content_div" class="flex flex-column align-items-center">
      <div class="border-1 content" :style="{ height: contentHeight }">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width:360px) and (max-width:800px) {
  .content {
    width: 100%;
  }

  .navbar {
    width: 100%;
  }
}

@media (min-width:800px) and (max-width:1072px) {
  .content {
    width: 800px;
  }

  .navbar {
    width: 800px;
  }
}

@media (min-width:1072px) {
  .content {
    width: 800px;
  }

  .navbar {
    width: 1072px;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400&display=swap');

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-Light.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: normal;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-Medium.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: medium;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-SemiBold.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: bold;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Poppins/Poppins-Italic.ttf') format('truetype');
  unicode-range: U+0041-005A, U+0061-007A;
  font-weight: italic;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Pretendard-1.3.6/public/static/Pretendard-Light.otf') format('opentype');
  font-weight: normal;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Pretendard-1.3.6/public/static/Pretendard-Medium.otf') format('opentype');
  font-weight: medium;
}

@font-face {
  font-family: 'blog';
  src:
    url('@/assets/font/Pretendard-1.3.6/public/static/Pretendard-Bold.otf') format('opentype');
  font-weight: bold;
}

body {
  font-family: 'blog';
}
</style>
