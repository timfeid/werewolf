<template>
  <div class="text-center mt-4">
    <div v-if="werewolfCount === 0">
      <h3>All the werewolves are in the middle.</h3>
    </div>
    <div v-else>
      <h3>These are the original Werewolves new cards:</h3>
      <div v-for="player in data.werewolves" class="d-flex align-items-center justify-content-center mb-2" style="flex-grow: 1;background: #32383e;">
        <player :player="player" />
        <div class="mx-auto">is now a</div>
        <card-image style="transform: scale(.75);margin-top: -1rem;margin-bottom: -1rem;margin-right: -.95rem" :card="player.card" />
      </div>
    </div>

    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/SquireCard.mp3`)" type="audio/ogg">
    </audio>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import TurnMixin from './Mixin.vue'
import { Card } from '../../../store/cards/types'
import Middle from '@/components/Middle.vue'
import Player from '@/components/Player.vue'
import axios from '../../../axios'
import CardImage from '@/components/CardImage.vue'

@Component({
  components: {
    Middle,
    Player,
    CardImage,
  }
})
class SquireTurn extends TurnMixin {
  mounted () {
    this.watchData()
  }
  @Watch('data', {deep: true})
  watchData () {
    if (!this.data.werewolves) {
      return
    }
    if (this.data.werewolves.length === 0) {
      return this.$emit('keeper-text', 'You did not see anyone. All the Werewolves are in the middle')
    }

    this.$emit('keeper-text', 'You saw ' + this.data.werewolves.map((p: any) => p.name).join(', ') + ' as Werewolves')
  }

  get werewolfCount () {
    if (!this.data.werewolves) {
      return 0
    }
    return this.data.werewolves.length
  }
}

export default SquireTurn
</script>
