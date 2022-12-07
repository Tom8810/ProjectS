<template>
  <div class="app-bar">
    <h1>アップバー</h1>
    <button @click="goDev">dev</button>
  </div>
</template>

<script>
export default {
  name: "appBar",
  methods: {
    goDev() {
      this.$router.push("/database");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-bar {
  height: 15vh;
  background-color: #aeaeae;
}
</style>
