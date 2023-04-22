<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1340px;
  max-width: 1920px;
}
.side {
  margin-top: 3rem;
  height: 100%;
  position: sticky;
}
.nav {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
.material-icons.md-18 {
  font-size: 18px;
}
.material-icons.md-24 {
  font-size: 24px;
}
.material-icons.md-36 {
  font-size: 36px;
}
.material-icons.md-48 {
  font-size: 48px;
}
</style>
<script>
export default {
  data: () => ({
    active: "guide",
  }),
};
</script>
<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://cdn.jsdelivr.net/npm/vuesax/dist/vuesax.css");
</style>
