<template>
  <div id="app">
    <header>
      <div class="header-container">
        <div class="container">
          <h1 class="text-center text-lowercase">
            Werewolf
          </h1>
        </div>
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

@Component
class App extends Vue {}

export default App
</script>

<style lang="scss">
@import "scss/main";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

$header-height: 75px;

.header-container {
  background: #1e2227;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
  margin-bottom: 1rem;
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
