<template>
  <div
    @click="clicked"
    class="radio-selection-option"
    :class="{
      'radio-selection-option--active': isSelected
    }"
    role="radio"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import RadioSelection from "./RadioSelection.vue"

@Component
class RadioOption extends Vue {
  public isSelected = false;

  clicked () {
    const parent = this.$parent as RadioSelection
    parent.select(this.value)
  }

  @Prop({ required: true })
  public readonly value!: any;
}

export default RadioOption
</script>

<style lang="scss">
$radio-active-circle-size: 1.5rem;
.radio-selection {
  &-option {
    border: 2px solid gray("200");
    border-radius: 0.5rem;
    flex-grow: 1;
    text-align: center;
    padding: 1rem;
    margin-left: 1rem;
    position: relative;
    transition: border 0.2s ease-out;
    &:first-child {
      margin-left: 0;
    }
    &--active {
      border-color: theme-color(primary);
      &::after {
        content: "✓";
        position: absolute;
        left: 50%;
        top: 100%;
        margin-top: -1 * $radio-active-circle-size / 2;
        color: white;
        margin-left: -1 * $radio-active-circle-size / 2;
        height: $radio-active-circle-size;
        background-color: theme-color(primary);
        border-radius: $radio-active-circle-size / 2;
        width: $radio-active-circle-size;
      }
    }
  }
}
</style>
