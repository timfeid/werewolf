<template>
  <div id="app">
    <header>
      <div class="header-container">
        <div class="container">
          <h1 class="text-center text-lowercase w-100">
            Werewolf
          </h1>


        </div>
        <settings class="ml-auto" style="position: relative; top: -2.8rem;right: 1rem;" />

      </div>


    </header>

    <div class="container main-content">
      <router-view />
    </div>


    <footer v-if="false">
      <div class="footer-container">
        <div class="container">
          footer
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Settings from './components/Settings.vue'

@Component({
  components: {
    Settings,
  }
})
class App extends Vue {}

export default App
</script>

<style lang="scss">
$material-icons-font-path: '~material-icons/iconfont/';
@import "scss/main";
@import "~material-icons/iconfont/material-icons.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  overflow: auto;
}

$header-height: 75px;

.header-container {
  background: #1e2227;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
  margin-bottom: 1rem;
  height: 3rem;
}

.main-content {
  flex-grow: 1;
}

.footer-container {
  margin-top: 1rem;
  background: #e5f8fc;
  padding: 5rem 0;
}
</style>
