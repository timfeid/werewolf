<template>
  <div class="text-center mt-4">
    <div v-if="selecting" class="d-flex flex-row justify-content-center">
      <player v-for="player of playersBesideMe" :key="player.id" @click.native="selected(player)" :player="player" />
    </div>
    <div v-if="newCard">
      Your new card is

      {{ newCard.name }}
    </div>
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
class RobberTurn extends TurnMixin {
  selecting = true
  newCard: Card[] | null = null
  async selected (player: PlayerType) {
    const card = 'P'+(this.playerIndex(player)+1)
    this.selecting = false
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      swap: card,
    })
    this.newCard = response.data.data
    // const player = this.lobby.users[parseInt(card[1], 10)-1]
    this.$emit('keeper-text', `${player.name}'s card was ${response.data.data.name}. This is now your card!`)
  }
}

export default RobberTurn
</script>
