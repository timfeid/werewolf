<template>
  <div class="tabs">
    <ul class="tabs-list" role="tablist">
      <li
        class="tabs-list-option"
        :class="{ 'tabs-list-option--active': tab.isActive }"
        v-for="tab in tabs"
      >
        <a
          class="tabs-list-option-link"
          @click="makeActive(tab.id)"
          v-html="tab.header"
        />
      </li>
    </ul>
    <div class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import Tab from "./Tab.vue"

@Component
class Tabs extends Vue {
  tabs: Tab[] = [];

  created () {
    this.tabs = this.$children as Tab[]
  }

  mounted () {
    this.makeActive(this.tabs[0].id)
  }

  makeActive (id: string) {
    this.tabs.forEach(t => (t.isActive = t.id === id))
  }
}
export default Tabs
</script>

<style lang="scss">
.tabs {
  &-list {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;

    &-option {
      display: block;
      &-link {
        cursor: pointer;
        display: block;
        padding: 0.5rem 1rem;
        color: theme-color(gray-300) !important;
      }
      &--active {
        .tabs-list-option-link {
          border-bottom: 2px solid theme-color(gray-300);
          color: white !important;
        }
      }
    }
  }

  &-content {
    border-top: 1px solid gray("400");
    padding: 1rem 0;
  }
}
</style>
