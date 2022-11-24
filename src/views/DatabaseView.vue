<template>
  <appBarVue />
  <div class="body">
    <sideBarVue />
    <button @click="test">テスト</button>
  </div>
</template>

<script>
import appBarVue from "@/components/AppBar.vue";
import sideBarVue from "@/components/SideBar.vue";
export default {
  components: { appBarVue, sideBarVue },
};
</script>
