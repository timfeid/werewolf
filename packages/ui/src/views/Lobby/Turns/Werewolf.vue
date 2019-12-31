<template>
  <div class="text-center mt-4">
    <div v-if="werewolfCount === 1">
      <h3>Since you are alone, please select one card</h3>
      <middle
        v-if="selecting"
        :allowed-selections="1"
        @selected="selected"
      />
      <div v-if="middleCard">
        The card you selected was
        {{ middleCard.name }}
      </div>
    </div>
    <div v-else>
      <h3>You are not alone. Werewolves:</h3>
      <div class="d-flex flex-row flex-wrap justify-content-center" style="margin-left: -.5rem">
        <player v-for="player of data.werewolves" :key="player.id" :player="player" />
      </div>
    </div>

    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/WerewolfCard.mp3`)" type="audio/ogg">
    </audio>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import TurnMixin from './Mixin.vue'
import { Card } from '../../../store/cards/types'
import Middle from '@/components/Middle.vue'
import Player from '@/components/Player.vue'
import axios from '../../../axios'

@Component({
  components: {
    Middle,
    Player,
  }
})
class WerewolfTurn extends TurnMixin {
  selecting = true
  middleCard: Card | null = null

  mounted () {
    this.$emit('keeper-text', `wolves: ${this.data.werewolves.map((w: any) => w.name).join(', ')}`)
  }

  async selected (card: string[]) {
    this.selecting = false
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      view: card[0],
    })
    this.middleCard = response.data.data
    this.$emit('keeper-text', `wolves: ${this.data.werewolves.map((w: any) => w.name).join(', ')} middle card: ${response.data.data.name}`)
  }

  get werewolfCount () {
    if (!this.data.werewolves) {
      return 0
    }
    return this.data.werewolves.length
  }
}

export default WerewolfTurn
</script>
