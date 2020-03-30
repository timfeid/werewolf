<template>
  <div>
    <h3 class="alt-font">Selected cards</h3>
    <div class="d-flex flex-row card-list flex-wrap">
      <template v-for="card of $store.state.cards.cards">
        <div @click="isSelected(card.card, i) ? removeCard(card.card) : addCard(card.card)" v-for="i in card.max">
          <card-image
            :class="{ 'card--selected': isSelected(card.card, i) }"
            :card="card.card"
            width="100%"
          />
        </div>
      </template>
    </div>
    <div class="my-3">
      <div class="row">
        <div class="col-6 font-weight-bold">

          Required: <span class="font-weight-normal">{{ lobby.cards.length - 3 }}</span>
        </div>
        <div class="col-6 font-weight-bold text-right">
          Here:  <span class="font-weight-normal">{{ lobby.users.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import {Lobby} from '../Lobby.vue'
import axios from '../../axios'
import CardImage from '@/components/CardImage.vue'

interface Card {
  id: string;
  isWerewolf: boolean;
}

@Component({
  components: {
    CardImage,
  }
})
class Cards extends Vue {
  @Prop({required: true, type: Boolean})
  owner!: boolean

  @Prop({required: true, type: Object})
  lobby!: Lobby

  isSelected (card: Card, i: number) {
    const total = this.lobby.cards.filter(c => c.id === card.id)

    return total.length >= i
  }

  async removeCard (card: Card) {
    if (this.owner) {
      const updatedCards = [...this.lobby.cards]
      const cardIndex = updatedCards.findIndex(c => c.id === card.id)
      if (cardIndex !== -1) {
        updatedCards.splice(cardIndex, 1)
      }

      await axios.put(`/lobbies/${this.lobby.id}/cards`, {
        cards: updatedCards.map(c => c.id),
      })
    }
  }

  async addCard (card: Card) {
    if (this.owner) {

      const updatedCards = [...this.lobby.cards]
      const alreadyAddedCards = updatedCards.filter(c => c.id === card.id)
      const cardConfiguration = this.$store.state.cards.cards.find((c: any) => c.card.id === card.id)
      const goodStuff = updatedCards.map(c => c.id)

      if (alreadyAddedCards.length === 0 || cardConfiguration.max !== alreadyAddedCards.length) {
        goodStuff.push(cardConfiguration.card.id)
      }

      await axios.put(`/lobbies/${this.lobby.id}/cards`, {
        cards: goodStuff
      })
    }
  }
}
export default Cards
</script>

<style lang="scss">
  .card-list {
    .card-container {
      opacity: .25;
    }
  }

  .card--selected {
    .card-container {

      opacity: 1;
    }
  }
</style>
