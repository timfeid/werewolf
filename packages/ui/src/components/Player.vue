<template>
  <div class="player" :style="`background-color: ${player.color};color: ${invertColor(player.color)};`">
    {{ player.name }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

export interface Player {name: string; id: number | string; color: string}

@Component
class PlayerVue extends Vue {
  @Prop({required: true, type: Object})
  player!: Player

  invertColor (color: string) {
    const r = parseInt(color.substr(1, 2), 16)
    const g = parseInt(color.substr(3, 2), 16)
    const b = parseInt(color.substr(5, 2), 16)

    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return (yiq >= 128) ? 'black' : 'white'
  }
}

export default PlayerVue
</script>

<style lang="scss">
  $box-size: 69px;
  .player {
    border-radius: $box-size / 2;
    height: $box-size;
    text-align: center;
    overflow: hidden;
    width: $box-size;
    line-height: $box-size;
    margin-left: .5rem;
  }
</style>
