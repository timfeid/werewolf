<template>
  <img
    :src="images[card.id]"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface Card {
  id: string;
}

@Component
class CardImage extends Vue {
  @Prop({type: Object, required: true})
  card!: Card

  images = {
    DrunkCard: require('@/assets/cards/DrunkCard.png'),
    InsomniacCard: require('@/assets/cards/InsomniacCard.png'),
    MasonCard: require('@/assets/cards/MasonCard.png'),
    MinionCard: require('@/assets/cards/MinionCard.png'),
    RobberCard: require('@/assets/cards/RobberCard.png'),
    SeerCard: require('@/assets/cards/SeerCard.png'),
    TroublemakerCard: require('@/assets/cards/TroublemakerCard.png'),
    VillagerCard: require('@/assets/cards/VillagerCard.png'),
    WerewolfCard: require('@/assets/cards/WerewolfCard.png'),
  }
}

export default CardImage
</script>
