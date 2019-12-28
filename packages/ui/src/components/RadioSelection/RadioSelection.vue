<template>
  <div class="radio" role="radiogroup">
    <slot @select="select" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator"
import RadioOption from "./RadioOption.vue"

@Component
class Radios extends Vue {
  options: RadioOption[] = [];

  @Prop({ required: true })
  value: any;

  @Prop({ required: false, type: Boolean, default: false })
  multiselect!: boolean;

  created () {
    this.options = this.$children as RadioOption[]
  }

  mounted () {
    this.$on("select", this.select)
    this.markSelected()
  }

  @Watch("value")
  watchValue () {
    this.markSelected()
  }

  markSelected () {
    if (this.multiselect) {
      this.options.forEach(option => {
        option.isSelected = this.value.findIndex(
          (v: any) => v === option.value
        )
      })
    } else {
      this.options.forEach(option => {
        option.isSelected = this.value === option.value
      })
    }
  }

  select (val: any) {
    if (this.multiselect) {
      const values = this.value.slice(0)
      const index = this.value.findIndex((v: any) => v === val)

      if (index === -1) {
        values.push(val)
      } else {
        values.splice(index, 1)
      }

      this.$emit("input", values)
    } else {
      this.$emit("input", val)
    }
  }
}
export default Radios
</script>

<style lang="scss">
.radio {
  display: flex;
  flex-direction: row;
}
</style>
