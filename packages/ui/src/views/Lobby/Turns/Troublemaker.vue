<template>
  <div class="text-center mt-4">
    <div v-if="selecting" class="d-flex flex-row justify-content-center">
      <player v-for="player of playersBesideMe" :key="player.id" @click.native="toggle(player)" :player="player" class="player-selection" :class="{'player-selection--selected': indexOf(playerIndex(player)) !== -1}" />
    </div>
    <div v-if="swaper && swapee">
      You swapped {{ swaper.name }}'s card with {{ swapee.name }}'
    </div>

    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/TroublemakerCard.mp3`)" type="audio/ogg">
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
class TroublemakerTurn extends TurnMixin {
  selecting = true
  selection: string[] = []
  swapee: PlayerType | null = null
  swaper: PlayerType | null = null

  indexOf (i: number) {
    return this.selection.indexOf(`P${i+1}`)
  }

  toggle (player: PlayerType) {
    const i = this.playerIndex(player)
    const index = this.indexOf(i)
    if (index === -1) {
      this.selection.push(`P${i+1}`)
    } else {
      this.selection.splice(index, 1)
    }

    if (this.selection.length === 2) {
      this.selected()
    }
  }

  async selected () {
    this.selecting = false
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      swap: this.selection,
    })
    const player: PlayerType = this.lobby.users[parseInt(this.selection[0][1], 10)-1]
    const player2: PlayerType = this.lobby.users[parseInt(this.selection[1][1], 10)-1]
    this.swapee = player
    this.swaper = player2
    this.$emit('keeper-text', `${player.name}'s card was swapped with ${player2.name}'s card!`)
  }
}

export default TroublemakerTurn
</script>
