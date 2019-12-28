<template>
  <main>
    <router-link :to="{ name: 'create' }">
      Create game
    </router-link>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator"
import Tabs from "../components/Tabs/Tabs.vue"
import Tab from "../components/Tabs/Tab.vue"
import CategorySelection from "../components/CategorySelection.vue"

// @ is an alias to /src
@Component({
  components: {
    CategorySelection,
    Tabs,
    Tab
  }
})
class Home extends Vue {
  categories: any[] = [];
  @Watch("categories")
  wcategories () {
    console.log(this.categories)
  }
}
export default Home
</script>
