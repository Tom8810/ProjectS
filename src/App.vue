<template>
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap");

*,
::after,
::before {
  margin: 0;
  padding: 0;
  line-height: 1;
  letter-spacing: 0.1em;
}

#app {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
}
.button:hover {
  transform: scale(1.1);
  transition-duration: 0.5s;
  cursor: pointer;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
