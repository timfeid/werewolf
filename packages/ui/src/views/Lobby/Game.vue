<template>
  <div>
    <div v-if="card" class="your-card">
      <card-image style="width: 100%" :card="card" />
      <audio ref="voiceaudio" autoplay="true">
        <source :src="require(`@/assets/sound/rules/${card.id}.mp3`)" type="audio/ogg">
      </audio>
    </div>
    <audio ref="notification">
      <source :src="require(`@/assets/sound/accomplished.mp3`)" type="audio/ogg">
    </audio>
    <audio ref="audio" autoplay="true" loop>
      <source :src="require(`@/assets/sound/background_tense.mp3`)" type="audio/ogg">
    </audio>
    <audio ref="winner">
      <source :src="require(`@/assets/sound/yay.mp3`)" type="audio/ogg">
    </audio>
    <audio ref="loser">
      <source :src="require(`@/assets/sound/aw.mp3`)" type="audio/ogg">
    </audio>

    <h4 class="text-center timer" v-if="currentTurn">
      {{ currentTurn.name }} {{ turnTimer }} seconds
    </h4>

    <component v-if="currentTurn && myTurn" :is="currentTurn.name.replace(/\s+/g, '') || 'Werewolf'" :data="data" :lobby="lobby" :card="currentTurn" @keeper-text="setKeeperText"  />

    <vote v-if="juryTimer > 0" :jury-timer="juryTimer" :lobby="lobby" :owner="owner" />

    <div class="mt-4" v-if="finished">
      <h4 class="text-center mb-0">The town voted to lynch {{ highestVotedPlayer.name }}</h4>
      <h1 class="text-center">{{ winner }} win!</h1>
      <ul class="list-group">
        <li class="list-group-item d-flex" v-for="obj in finalUserCards" :class="{lynched: highestVotedPlayer.id === obj.id}">
          <div class="d-flex align-items-center mr-3" style="flex-grow: 1;">
            <player :player="obj" />
            <div class="ml-auto">
             {{ obj.card.name }} <span class="badge badge-danger d-block" v-if="obj.card.isWerewolf">Werewolf</span>
            </div>
            <div class="player ml-auto">
              <card-image style="transform: scale(.75);margin-top: -1rem;margin-bottom: -1rem;margin-left: -1.8rem;" :card="{id: obj.card.id}" />
            </div>
          </div>
          <div class="ml-auto my-auto">
            <span class="badge badge-info">{{ votesFor(obj.id) }} votes</span>
          </div>
        </li>
        <li class="list-group-item d-flex align-items-center" v-for="(obj, index) in finalMiddleCards" :class="{lynched: highestVotedPlayer.id === 'middle'}">
          <player :player="{name: 'Middle '+(index+1), color: '#ffffff'}" />
          <div class="ml-auto">
            {{ obj.name }} <span class="badge badge-danger d-block" v-if="obj.isWerewolf">Werewolf</span>
          </div>
          <div class="player ml-auto mr-3">
            <card-image style="transform: scale(.75);margin-top: -1rem;margin-bottom: -1rem;margin-left: -1.8rem;" :card="{id: obj.id}" />
          </div>
          <div>
            <span class="badge badge-info">{{ votesFor('middle') }} votes</span>
          </div>
        </li>
      </ul>

      <button @click="playAgain">
        Play Again
      </button>
    </div>


      <div class="keeper-text" @click="showKeeperText = !showKeeperText">
        <v-popover
          trigger="manual"
          :open="showKeeperTutorial"
          offset="16"
          placement="top"
          :auto-hide="false"
        >
          <template v-slot:popover>
            <div @click="shownKeeperTutorial" class="tutorial">
              <div class="close-tutorial">
                <span class="material-icons">close</span>

              </div>
              click the black bar below to hide or show information!
              <div class="text-center">

                <span class="material-icons">arrow_downward</span>
              </div>
            </div>
          </template>
          <div v-if="!showKeeperText">
            <span class="d-inline d-md-none">tap</span> <span class="d-none d-md-inline">click</span> to show info
          </div>
          <div v-else>
            {{ keeperText }}
          </div>
        </v-popover>
      </div>


    <div class="mt-3" v-if="owner">
      <button v-if="!lobby.started" @click="start" class="btn w-100 text-lowercase btn-outline-secondary">
        Start
      </button>
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
import MysticWolf from './Turns/MysticWolf.vue'
import Drunk from './Turns/Drunk.vue'
import Copycat from './Turns/Copycat.vue'
import Insomniac from './Turns/Insomniac.vue'
import Doppelganger from './Turns/Doppelganger.vue'
import Player from '../../components/Player.vue'
import Vote from './Vote.vue'
import {namespace} from 'vuex-class'

const SettingsStore = namespace('settings')
const UserStore = namespace('user')

@Component({
  components: {
    CardImage,
    Copycat,
    Werewolf,
    Minion,
    Mason,
    Seer,
    Vote,
    Player,
    Robber,
    Troublemaker,
    Drunk,
    Doppelganger,
    Insomniac,
    MysticWolf,
  }
})
class Game extends Vue {
  @Prop({required: true, type: Object})
  lobby!: Lobby

  @Prop({required: true, type: Boolean})
  owner!: boolean

  @Prop({required: false, type: Object})
  card!: Card

  @SettingsStore.State musicVolume!: number
  @SettingsStore.State voiceVolume!: number
  @SettingsStore.State notificationVolume!: number
  @SettingsStore.State showKeeperTutorial!: boolean
  @SettingsStore.Mutation shownKeeperTutorial!: () => void
  @UserStore.Getter id!: string

  data: Record<string, any> = {}

  keeperText = 'No information yet'

  currentTurn: null | Card = null

  turnTimer = 0

  juryTimer = 0

  myTurn = false

  showKeeperText = true

  finished = false

  finalUserCards: any[] = []
  finalMiddleCards: Card[] = []

  mounted () {
    this.setMusicVolume()
  }

  showConfetti () {
    // @ts-ignore
    this.$confetti.start()
    setTimeout(() => {
      // @ts-ignore
      this.$confetti.stop()
    }, 3000);
  }

  @Watch('card')
  @Watch('musicVolume')
  @Watch('voiceVolume')
  setMusicVolume () {
    (this.$refs['audio'] as HTMLAudioElement).volume = this.musicVolume / 100;
    (this.$refs['notification'] as HTMLAudioElement).volume = this.notificationVolume / 100;
    (this.$refs['winner'] as HTMLAudioElement).volume = this.musicVolume / 100;
    (this.$refs['loser'] as HTMLAudioElement).volume = this.musicVolume / 100;

    this.$nextTick (() => {
      if (this.$refs['voiceaudio']) {
        (this.$refs['voiceaudio'] as HTMLAudioElement).volume = this.voiceVolume / 100
      }
    })
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

  playNotification () {
    (this.$refs['notification'] as HTMLAudioElement).play()

  }

  playAgain () {

  }

  playFinalSound () {
    let finalSound = 'loser'
    const myFinal = this.finalUserCards.find(u => u.id === this.id)
    console.log(myFinal.card, myFinal.card.isWerewolf, this.winner)
    if ((myFinal.card.isWerewolf || myFinal.card.id === 'MinionCard') && this.winner === 'Werewolves') {
      finalSound = 'winner'
    } else if (!myFinal.card.isWerewolf && myFinal.card.id !== 'MinionCard' && this.winner === 'Villagers') {
      finalSound = 'winner'
    }

    (this.$refs[finalSound] as HTMLAudioElement).play()

    if (finalSound === 'winner') {
      this.showConfetti()
    }
  }

  created () {
    events.$on('lobby.turn.timer', ({timeLeft, lobby}: {timeLeft: number; lobby: Lobby}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.turnTimer = timeLeft
      }
    })


    events.$on('lobby.turn.start', ({lobby, card}: {lobby: Lobby; card: Card}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.currentTurn = card
        this.playNotification()
      }
    })

    events.$on('lobby.turn.mine.start', ({lobby, card, data}: {lobby: Lobby; card: Card; data: Record<string, any>}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.currentTurn = card
        this.myTurn = true
        this.data = data
      }
    })

    events.$on('lobby.turn.end', ({lobby, card}: {lobby: Lobby; card: Card}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.myTurn = false
      }
    })

    events.$on('lobby.jury', ({timeLeft, lobby}: {timeLeft: number; lobby: Lobby}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.myTurn = false
        this.currentTurn = null
        this.juryTimer = timeLeft
      }
    })

    events.$on('lobby.end', ({lobby, users, middle}: {lobby: any;users: any;middle: any}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.finished = true
        this.finalMiddleCards = middle
        this.finalUserCards = users
        this.playFinalSound()
      }
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
  }
}
export default Game

</script>

<style lang="scss">
  .your-card {
    margin: 0 auto 1rem;
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
    color: #eaeaea;
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
