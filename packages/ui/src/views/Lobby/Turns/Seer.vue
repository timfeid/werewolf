<template>
  <div class="text-center mt-4">
    <div v-if="selecting">

      <div>
        Select two of these
      </div>
      <middle
        :allowed-selections="2"
        @selected="selected"
      />
      <div>or one of</div>
      <div class="d-flex flex-row justify-content-center justify-content-center">
        <player v-for="player of playersBesideMe" :key="player.id" @click.native="selectedPlayer(player)" :player="player" style="cursor: pointer;" />
      </div>
    </div>
    <div v-if="cards">
      The cards you viewed were
      <div class="d-flex align-items-center">
        <card-image v-for="card in cards" :card="card" />
      </div>
    </div>


    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/SeerCard.mp3`)" type="audio/ogg">
    </audio>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import TurnMixin from './Mixin.vue'
import { Card } from '../../../store/cards/types'
import Middle from '@/components/Middle.vue'
import Player, {Player as PlayerType} from '../../../components/Player.vue'
import axios from '../../../axios'
import CardImage from '@/components/CardImage.vue'

@Component({
  components: {
    Middle,
    Player,
    CardImage,
  }
})
class SeerTurn extends TurnMixin {
  selecting = true
  cards: Card[] | null = null

  selectedPlayer (player: PlayerType) {
    const index = this.playerIndex(player)
    this.selected(['P'+(index+1)])
  }

  async selected (cards: string[]) {
    this.selecting = false
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      view: cards,
    })
    this.cards = response.data.data
    if (cards.length === 1) {
      const player = this.lobby.users[parseInt(cards[0][1], 10)-1]
      this.$emit('keeper-text', `${player.name}'s card was ` + response.data.data.map((card: Card) => card.name).join(', '))
    } else {
      this.$emit('keeper-text', 'The cards you saw were ' + response.data.data.map((card: any) => `${card.position}: ${card.name}`).join(', '))
    }
  }
}

export default SeerTurn
</script>
