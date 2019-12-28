<template>
  <div>
    <div v-if="card" class="your-card">
      <card-image width="100%" :card="card" />
      <div>{{ card.name }}</div>
    </div>

    <h4 class="text-center" v-if="currentTurn">
      {{ currentTurn.name }} {{ turnTimer }} seconds
    </h4>

    <component v-if="currentTurn && myTurn" :is="currentTurn.name || 'Werewolf'" :data="data" :lobby="lobby" :card="currentTurn" @keeper-text="setKeeperText"  />

    <div v-if="juryTimer">Vote countdown {{ juryTimer }}</div>
    <div class="mt-4" v-if="finished">
      <ul class="list-group">
        <li class="list-group-item" v-for="obj in finalUserCards">
          {{ obj.name }} was a {{ obj.card.name }}
        </li>
        <li class="list-group-item" v-for="(obj, index) in finalMiddleCards">
          Middle {{index+1}} was a {{ obj.name }}
        </li>
      </ul>
    </div>

    <div class="keeper-text" :class="{ 'keeper-text--show': showKeeperText }" v-html="keeperText" @click="showKeeperText = !showKeeperText" />

    <div class="mt-3" v-if="owner">
      <button v-if="!lobby.started" @click="start" class="btn w-100 text-lowercase btn-outline-secondary">
        Start
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import axios from '../../axios'
import Tab from '@/components/Tabs/Tab.vue'
import Tabs from '@/components/Tabs/Tabs.vue'
import JoinForm from './JoinForm.vue'
import events from '../../events'
import Cards from './Cards.vue'
import { Card } from '../../store/cards/types'
import { Lobby } from '../Lobby.vue'
import CardImage from '@/components/CardImage.vue'
import Werewolf from './Turns/Werewolf.vue'
import Minion from './Turns/Minion.vue'
import Mason from './Turns/Mason.vue'
import Seer from './Turns/Seer.vue'
import Robber from './Turns/Robber.vue'
import Troublemaker from './Turns/Troublemaker.vue'
import Drunk from './Turns/Drunk.vue'
import Insomniac from './Turns/Insomniac.vue'
import { Player } from '../../components/Player.vue'

@Component({
  components: {
    CardImage,
    Werewolf,
    Minion,
    Mason,
    Seer,
    Robber,
    Troublemaker,
    Drunk,
    Insomniac,
  }
})
class Game extends Vue {
  @Prop({required: true, type: Object})
  lobby!: Lobby

  @Prop({required: true, type: Boolean})
  owner!: boolean

  @Prop({required: false, type: Object})
  card!: Card

  data: Record<string, any> = {}

  keeperText = 'No information yet'

  currentTurn: null | Card = null

  turnTimer = 0

  juryTimer = 0

  myTurn = false

  showKeeperText = false

  finished = false

  finalUserCards: any[] = []
  finalMiddleCards: Card[] = []

  created () {
    events.$on('lobby.turn.start', ({card, lobby}: any) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.currentTurn = card
      }
    })


    events.$on('lobby.turn.timer', ({timeLeft, lobby}: {timeLeft: number; lobby: Lobby}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.turnTimer = timeLeft
      }
    })


    events.$on('lobby.turn.start', ({lobby, card}: {lobby: Lobby; card: Card}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.currentTurn = card
      }
    })

    events.$on('lobby.turn.mine.start', ({lobby, card, data}: {lobby: Lobby; card: Card; data: Record<string, any>}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.myTurn = true
        this.data = data
      }
    })

    events.$on('lobby.turn.end', ({lobby, card}: {lobby: Lobby; card: Card}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        // console.log('end', lobby, card)
      }
    })

    events.$on('lobby.turn.mine.end', ({lobby, card}: {lobby: Lobby; card: Card}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.myTurn = false
      }
    })

    events.$on('lobby.jury', ({timeLeft, lobby}: {timeLeft: number; lobby: Lobby}) => {
      console.log('hello?')
      if (this.lobby && lobby.id === this.lobby.id) {
        this.myTurn = false
        this.currentTurn = null
        this.juryTimer = timeLeft
      }
    })

    events.$on('lobby.end', ({lobby, users, middle}: {lobby: any;users: any;middle: any}) => {
      this.finished = true
      this.finalMiddleCards = middle
      this.finalUserCards = users
    })
  }

  async start () {
    await axios.post(`/lobbies/${this.lobby.id}/start`)
  }

  setKeeperText (text: string) {
    this.keeperText = text
    this.showKeeperText = true
    setTimeout(() => this.showKeeperText = false, 5000)
  }
}
export default Game

</script>

<style lang="scss">
  .your-card {
    margin: 0 auto;
    text-align: center;
    img {
      width: 60px;
    }
  }
  .keeper-text {
    user-select: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 30px;
    text-align: center;
    padding: 1rem;
    background: black;
    color: black;
    &--show {
      color: #eaeaea;
    }
  }
</style>
