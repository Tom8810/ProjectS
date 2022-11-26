<template>
  <appBarVue />
  <div class="body">
    <button @click="test">テスト</button>
  </div>
</template>

<script>
import appBarVue from "@/components/AppBar.vue";
export default {
  components: { appBarVue },
};
</script>
