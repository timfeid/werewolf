<template>
  <component :is="card.description ? 'v-popover' : 'div'" trigger="hover" placement="bottom">
    <template v-slot:popover>
      <h1>{{ card.name }}</h1>
      <div class="tooltip-info" v-html="card.description" />
    </template>
    <div class="card-container">
      <div class="card-holder mx-auto">
        <div :class="`card card-${card.id}`" />
      </div>
      <div class="card-name">
        {{ card.name }}
      </div>
    </div>
  </component>
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
      height: 70px;
      width: 100px;
      position: relative;
    }
    &-name {
      text-align: center;
      white-space: nowrap;
      font-size: 12px;
    }
    background: asset('cards.png');
    margin: auto;
    background-repeat: no-repeat;
    transform:  scale(.15,.15);
    transform-origin: left top;
    position: absolute;

    &-CopycatCard {
      background: asset('cards2.png');
      background-position: -55px -1px;
      width: 290px;
      height: 407px;
      left: 27px;
    }

    &-AssassinCard {
      background: asset('cards2.png');
      background-position: -1695px -419px;
      width: 290px;
      height: 407px;
      left: 27px;
    }

    &-SquireCard {
      background: asset('cards2.png');
      background-position: -860px -1228px;
      width: 290px;
      height: 407px;
      left: 27px;
    }

    &-DoppelgangerCard {
      background-position: -430px -17px;
      width: 354px;
      height: 407px;
      left: 15px;
    }

    &-MysticWolfCard {
      background-position: -1255px -2px;
      width: 319px;
      height: 407px;
      left: 23px;
    }

    &-WerewolfCard {
      background-position: -839px -1px;
      width: 321px;
      height: 407px;
      left: 25px;
    }

    &-SeerCard {
      background-position: -838px -426px;
      width: 327px;
      height: 407px;
      left: 22px;
    }

    &-MasonCard {
      background-position: -502px -419px;
      width: 195px;
      height: 407px;
      left: 35px;
    }

    &-DrunkCard {
      background-position: -1695px -824px;
      width: 284px;
      height: 407px;
      left: 23px;
    }

    &-InsomniacCard {
      background-position: -69px -1228px;
      width: 269px;
      height: 407px;
      left: 28px;
    }

    &-MinionCard {
      background-position: -66px -417px;
      width: 268px;
      height: 407px;
      left: 28px;
    }

    &-RobberCard {
      background-position: -65px -822px;
      width: 267px;
      height: 407px;
      left: 23px;
    }

    &-TroublemakerCard {
      background-position: -909px -836px;
      width: 216px;
      height: 407px;
      left: 30px;
    }

    &-VillagerCard {
      background-position: -1266px -1236px;
      width: 316px;
      height: 407px;
      left: 22px;
    }
  }
</style>
