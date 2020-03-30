<template>
  <div id="app">
    <header>
      <div class="header-container">
        <div class="container">
          <h1 class="text-center text-lowercase w-100 alt-font">
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

    <settings class="ml-auto" style="position: fixed; top: .5rem;right: 1rem;" />

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

$header-height: 3rem;
$timer-height: 2rem;
$total-off: $header-height + $timer-height;


.timer {
  position: fixed;
  top: $header-height;
  width: 100%;
  left: 0;
  text-align: center;
  height: $timer-height;
  background: #1e2227;
}

body,html {
  margin-top: 3rem;
  margin-bottom: 2rem;
}
#app {
  font-family: "Neucha", "Avenir", Helvetica, Arial, sans-serif;
  height: calc(100vh - 10rem);
  display: flex;
  flex-direction: column;
  overflow: auto;
}


.header-container {
  background: #1e2227;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
  margin-bottom: 1rem;
  height: 3rem;
  position: fixed;
  width: 100%;
  top: 0;
}

.btn {
  font-size: 1rem;
}

.alt-font {
  font-family: "Shadows Into Light", "Avenir", Helvetica, Arial, sans-serif;
}

.main-content {
  flex-grow: 1;
}

.footer-container {
  margin-top: 1rem;
  background: #e5f8fc;
  padding: 5rem 0;
}

.tooltip {
  font-family: "Neucha", "Avenir", Helvetica, Arial, sans-serif;
  font-size: 16px;
  display: block !important;
  z-index: 10000;

  .tooltip-info {
    max-width: 520px;
  }

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}


.tutorial {
  max-width: 300px;
  text-align: center;
  padding: 1rem 3rem;
  position: relative;
  .close-tutorial {
    top: 1rem;
    right: 0;
    position: absolute;
    cursor: pointer;
  }
}
</style>
