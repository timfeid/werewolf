<template>
  <div class="text-center mt-4">
    <div v-if="selecting" class="d-flex flex-row justify-content-center">
      <player v-for="player of playersBesideMe" :key="player.id" @click.native="selected(player)" :player="player" />
    </div>
    <div v-if="newCard">
      Your new card is

      {{ newCard.name }}
    </div>


    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/DoppelgangerCard.mp3`)" type="audio/ogg">
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
class DoppelgangerTurn extends TurnMixin {
  selecting = true
  newCard: Card[] | null = null
  async selected (player: PlayerType) {
    const card = 'P'+(this.playerIndex(player)+1)
    this.selecting = false
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      view: card,
    })
    this.newCard = response.data.data
    this.$emit('keeper-text', `${player.name}'s card was ${response.data.data.name}. You are a now a ${response.data.data.name}`)
  }
}

export default DoppelgangerTurn
</script>
