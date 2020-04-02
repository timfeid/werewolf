<template>
  <div class="text-center mt-4">
    <h1>Please select a player you plan to assassinate</h1>
    <div v-if="selecting" class="d-flex flex-row justify-content-center">
      <player v-for="player of playersBesideMe" :key="player.id" @click.native="selected(player)" :player="player" />
    </div>
    <div v-else>
      Done!
    </div>


    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/RobberCard.mp3`)" type="audio/ogg">
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
class RobberTurn extends TurnMixin {
  selecting = true
  async selected (player: PlayerType) {
    const card = 'P'+(this.playerIndex(player)+1)
    this.selecting = false
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      mark: card,
    })
    this.$emit('keeper-text', `you are trying to assassinate ${player.name}`)
  }
}

export default RobberTurn
</script>
