<template>
  <a @click="clicked" class="dropdown-item">
    <slot />
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import Dropdown from "./Dropdown.vue"

@Component
class DropdownOption extends Vue {
  isSelected = false;

  clicked () {
    const parent = this.$parent as Dropdown
    parent.select(this.value)
  }

  @Prop({ required: false, default: null })
  value: any;
}

export default DropdownOption
</script>

<style lang="scss"></style>
