<template>
  <div class="d-flex flex-row flex-wrap justify-content-center">
    <player v-for="i in 3" :key="i" :player="{name: `Middle ${i}`, color: '#ddd'}" @click.native="toggle(i)" class="middle" :class="{'middle--selected': indexOf(i) !== -1}" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Player from '@/components/Player.vue'

@Component({
  components: {
    Player,
  }
})
class Middle extends Vue {
  @Prop({required: false, type: Number, default: 0})
  allowedSelections!: number

  selection: string[] = []

  indexOf (i: number) {
    return this.selection.indexOf(`M${i}`)
  }

  toggle (i: number) {
    const index = this.indexOf(i)
    if (index === -1) {
      this.selection.push(`M${i}`)
    } else {
      this.selection.splice(index, 1)
    }

    if (this.selection.length === this.allowedSelections) {
      this.$emit('selected', this.selection)
    }
  }
}

export default Middle
</script>

<style lang="scss">
  .middle {
    color: black !important;
    cursor: pointer;
    &--selected {
      background-color: aqua !important;
    }
  }
</style>
