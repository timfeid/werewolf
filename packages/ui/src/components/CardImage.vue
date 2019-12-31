<template>
  <div class="card-container">
    <div class="card-holder">
      <div :class="`card card-${card.id}`" />
    </div>
    <div class="card-name">
      {{ card.name }}
    </div>
  </div>
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
    // DrunkCard: require('@/assets/cards/DrunkCard.png'),
    // InsomniacCard: require('@/assets/cards/InsomniacCard.png'),
    // MasonCard: require('@/assets/cards/MasonCard.png'),
    // MinionCard: require('@/assets/cards/MinionCard.png'),
    // RobberCard: require('@/assets/cards/RobberCard.png'),
    // SeerCard: require('@/assets/cards/SeerCard.png'),
    // TroublemakerCard: require('@/assets/cards/TroublemakerCard.png'),
    // VillagerCard: require('@/assets/cards/VillagerCard.png'),
    // WerewolfCard: require('@/assets/cards/WerewolfCard.png'),
  }
}

export default CardImage
</script>

<style lang="scss">
  .card {
    &-container {
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 127px;
      padding: 1rem;
      background: #181f25;
    }
    &-holder {
      width: 100%;
    }
    &-name {
      text-align: center;
      white-space: nowrap;
      font-size: 12px;
    }
    background: asset('cards.png');
    margin: auto;
    background-repeat: no-repeat;
    zoom: .15;

    &-CopycatCard {
    background: asset('cards2.png');
      background-position: -55px -1px;
      width: 290px;
      height: 407px;
    }

    &-DoppelgangerCard {
      background-position: -430px -17px;
      width: 354px;
      height: 407px;
    }

    &-MysticWolfCard {
      background-position: -1265px -2px;
      width: 319px;
      height: 407px;
    }

    &-WerewolfCard {
      background-position: -839px -1px;
      width: 321px;
      height: 407px;
    }

    &-SeerCard {
      background-position: -838px -426px;
      width: 327px;
      height: 407px;
    }

    &-MasonCard {
      background-position: -502px -419px;
      width: 195px;
      height: 407px;
    }

    &-DrunkCard {
      background-position: -1695px -824px;
      width: 284px;
      height: 407px;
    }

    &-InsomniacCard {
      background-position: -69px -1228px;
      width: 269px;
      height: 407px;
    }

    &-MinionCard {
      background-position: -66px -417px;
      width: 268px;
      height: 407px;
    }

    &-RobberCard {
      background-position: -65px -822px;
      width: 267px;
      height: 407px;
    }

    &-TroublemakerCard {
      background-position: -909px -836px;
      width: 216px;
      height: 407px;
    }

    &-VillagerCard {
      background-position: -1266px -1236px;
      width: 316px;
      height: 407px;
    }
  }
</style>
