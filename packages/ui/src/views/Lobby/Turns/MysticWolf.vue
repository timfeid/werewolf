<template>
  <div class="text-center mt-4">
    <div v-if="selecting">
      <div class="d-flex flex-row justify-content-center">
        <player v-for="player of playersBesideMe" :key="player.id" @click.native="selectedPlayer(player)" :player="player" style="cursor: pointer;" />
      </div>
    </div>
    <div v-if="viewedCard">
      The card you viewed was
        {{ viewedCard.name }}
    </div>


    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/MysticWolfCard.mp3`)" type="audio/ogg">
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

@Component({
  components: {
    Middle,
    Player,
  }
})
class MysticWolfTurn extends TurnMixin {
  selecting = true
  viewedCard: Card | null = null

  selectedPlayer (player: PlayerType) {
    const index = this.playerIndex(player)
    this.selected(['P'+(index+1)])
  }

  async selected (cards: string[]) {
    this.selecting = false

    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      view: cards[0],
    })

    this.viewedCard = response.data.data
    const player = this.lobby.users[parseInt(cards[0][1], 10)-1]
    this.$emit('keeper-text', `wolves: ${this.data.werewolves.map((w: any) => w.name).join(', ')}; ${player.name}: ` + response.data.data.name)
  }
}

export default MysticWolfTurn
</script>
