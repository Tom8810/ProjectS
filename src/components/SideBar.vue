<template>
  <div>
    <aside class="side-bar">
      <div class="favorite">
        <h4>評価の高い推測</h4>
      </div>
      <div class="new">
        <h4>新着の推測</h4>
      </div>
      <div class="ad">
        <h4>その他</h4>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  name: "sideBar",
};
</script>

<style scoped>
.side-bar {
  background-color: #bebebe;
  height: 85vh;
  width: 20vw;
}
.favorite {
  background-color: #bebeff;
  height: 40vh;
}
.ad {
  background-color: #beffbe;
  height: 15vh;
}
.new {
  background-color: #ffbebe;
  height: 30vh;
}
</style>
