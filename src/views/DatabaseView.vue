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
  data() {
    return {
      data: [],
    };
  },

  methods: {
    test() {
      console.log(this.data);
    },
  },
  created() {
    this.data = this.$route.params.data;
  },
  components: { appBarVue, sideBarVue },
};
</script>
