<template>
  <main>
    <router-link class="btn text-lowercase btn-success w-100 mb-3" :to="{ name: 'create' }">
      Create game
    </router-link>
    <div class="separator">
      <span>or</span>
    </div>
    <join-form />
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator"
import Tabs from "../components/Tabs/Tabs.vue"
import Tab from "../components/Tabs/Tab.vue"
import JoinForm from "./Lobby/JoinForm.vue"
import CategorySelection from "../components/CategorySelection.vue"

// @ is an alias to /src
@Component({
  components: {
    CategorySelection,
    Tabs,
    Tab,
    JoinForm,
  }
})
class Home extends Vue {
  categories: any[] = [];
}
export default Home
</script>

<style lang="scss">
  .separator {
    opacity: .5;
    background: $body-color;
    height: 1px;
    margin: 1rem 0;
    span {
      position: relative;
      top: -10px;
      padding: 0 1rem;
      display: inline-block;
      background: $body-bg;
      margin: 0 auto;
      left: calc(50% - 20px);
    }
  }
</style>
