<template>
  <div class="text-center mt-4">
    <middle
      v-if="selecting"
      :allowed-selections="1"
      @selected="selected"
    />
    <div v-else>
      You swapped your card!
    </div>



    <audio autoplay="true">
      <source :src="require(`@/assets/sound/wake/CopycatCard.mp3`)" type="audio/ogg">
    </audio>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import TurnMixin from './Mixin.vue'
import { Card } from '../../../store/cards/types'
import Middle from '@/components/Middle.vue'
import axios from '../../../axios'

@Component({
  components: {
    Middle,
  }
})
class CopycatTurn extends TurnMixin {
  selecting = true
  newCard: Card[] | null = null
  async selected (card: string[]) {
    this.selecting = false
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`, {
      view: card[0],
    })
    // const player = this.lobby.users[parseInt(card[1], 10)-1]
    this.$emit('keeper-text', `You swapped with ${card[0]}. you are a now a ${response.data.data.name}`)
  }
}

export default CopycatTurn
</script>
