<template>
    <div>
        <div class="google-ads">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9194352950006985"
                data-ad-slot="1234567890" data-ad-format="auto"></ins>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
});

</script>

<style scoped>
.google-ads {
    text-align: center;
    /* 광고를 중앙에 위치시키기 위한 옵션 */
}
</style>