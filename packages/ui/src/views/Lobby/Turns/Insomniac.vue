<template>
  <div />
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
class InsomniacTurn extends TurnMixin {
  async mounted () {
    const response = await axios.post(`/lobbies/${this.lobby.id}/turn`)
    this.$emit('keeper-text', `Your card is: ${response.data.data.card.name}`)
  }
}

export default InsomniacTurn
</script>
