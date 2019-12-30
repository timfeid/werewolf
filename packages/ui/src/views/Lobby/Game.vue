<template>
  <div>
    <div v-if="card" class="your-card">
      <card-image width="100%" :card="card" />
      <div>{{ card.name }}</div>
      <audio autoplay="true">
        <source :src="require(`@/assets/sound/rules/${card.id}.mp3`)" type="audio/ogg">
      </audio>
    </div>

    <h4 class="text-center" v-if="currentTurn">
      {{ currentTurn.name }} {{ turnTimer }} seconds
    </h4>

    <component v-if="currentTurn && myTurn" :is="currentTurn.name || 'Werewolf'" :data="data" :lobby="lobby" :card="currentTurn" @keeper-text="setKeeperText"  />

    <vote v-if="juryTimer > 0" :jury-timer="juryTimer" :lobby="lobby" :owner="owner" />

    <div class="mt-4" v-if="finished">
      <h4 class="text-center mb-0">The town voted to lynch {{ highestVotedPlayer.name }}!</h4>
      <h1 class="text-center">{{ winner }} win!</h1>
      <ul class="list-group">
        <li class="list-group-item d-flex" v-for="obj in finalUserCards" :class="{lynched: highestVotedPlayer.id === obj.id}">
          <div>
            {{ obj.name }} was a <span class="badge badge-secondary">{{ obj.card.name }}</span>
          </div>
          <div class="ml-auto">
            <span class="badge badge-info">{{ votesFor(obj.id) }} votes</span>
          </div>
        </li>
        <li class="list-group-item d-flex" v-for="(obj, index) in finalMiddleCards" :class="{lynched: highestVotedPlayer.id === 'middle'}">
          <div>

            Middle {{index+1}} was a <span class="badge badge-secondary">{{ obj.name }}</span>
          </div>
          <div class="ml-auto">
            <span class="badge badge-info">{{ votesFor('middle') }} votes</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="keeper-text" :class="{ 'keeper-text--show': showKeeperText }" v-html="keeperText" @click="showKeeperText = !showKeeperText" />
    <div class="keeper-text-helper" @click="showKeeperText = !showKeeperText" v-if="!showKeeperText">tap to show info</div>

    <div class="mt-3" v-if="owner">
      <button v-if="!lobby.started" @click="start" class="btn w-100 text-lowercase btn-outline-secondary">
        Start
      </button>
    </div>

    <div class="audio-controls">
      <audio ref="audio" :autoplay="audio ? true : false" loop>
        <source :src="require(`@/assets/sound/background_tense.mp3`)" type="audio/ogg">
      </audio>
      <div @click="audio = !audio">
        <ion-icon :name="audio ? 'volume-off' : 'volume-high'"></ion-icon>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
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
import Vote from './Vote.vue'

@Component({
  components: {
    CardImage,
    Werewolf,
    Minion,
    Mason,
    Seer,
    Vote,
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

  audio = (localStorage.getItem('bg_audio') || 'true') === 'true'

  mounted () {
    (this.$refs['audio'] as HTMLAudioElement).volume = .5
  }

  @Watch('audio')
  setAudio () {
    this.fixAudio()
    localStorage.setItem('bg_audio', this.audio ? 'true' : 'false')
  }

  fixAudio () {
    if (this.audio) {
      (this.$refs['audio'] as HTMLAudioElement).play()
    } else {
      (this.$refs['audio'] as HTMLAudioElement).pause()
    }
  }

  get winner () {
    if (this.highestVoted.id === 'middle') {
      return this.finalMiddleCards.find(c => c.isWerewolf) ? 'Villagers' : 'Werewolves'
    }
    return (this.highestVotedPlayer.card.id === 'MinionCard' || !this.highestVotedPlayer.card.isWerewolf) ? 'Werewolves' : 'Villagers'
  }

  get highestVotedPlayer () {
    return this.finalUserCards.find(u => u.id === this.highestVoted.id) || {id: 'middle', name: 'middle'}
  }

  get highestVoted () {
    const votes = new Map()
    this.lobby.users.forEach(u => {
      if (u.vote && u.vote.id) {
        const voteId = u.vote.id
        votes.set(voteId, votes.has(voteId) ? votes.get(voteId) + 1 : 1)
      }
    })

    const b = [...votes.entries()].sort((a,b) => a[1] > b[1] ? -1 : 1)

    if (b.length > 0) {
      return this.lobby.users.find(u => u.id === b[0][0]) || {id:'middle'}
    }

    return {id: 'middle'}
    // return v.shift()
  }

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

  votesFor (userId: string) {
    return this.lobby.users.filter(u => u.vote && u.vote.id === userId).length
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
    &-helper {
      bottom: 0;
      user-select: none;
      position: fixed;
      color: white;
      z-index: 1;
      left: 0;
      right: 0;
      min-height: 30px;
      text-align: center;
      padding: 1rem;
    }
  }
  .lynched {
    background: darken(theme-color('danger'), 55%);
    color: theme-color('danger');
  }
  .audio-controls {
    position: fixed;
    top: 4rem;
    right: 1rem;
    font-size: 32px;
    background: theme-color('success');
    color: black;
    line-height: 20px;
    padding: 1rem;
    border-radius: 10px;
  }
</style>
