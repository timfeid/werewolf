<template>
  <div v-if="lobby">
    <setup :owner="(joined && joined.owner) || false" :lobby="lobby" v-if="!lobby.dealt" />
    <game :owner="(joined && joined.owner) || false" :lobby="lobby" :card="card" v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Setup from './Lobby/Setup.vue'
import Game from './Lobby/Game.vue'
import axios from '../axios'
import events from '../events'
import { Card } from '../store/cards/types'

export interface Lobby {
  id: string;
  users: {name: string; id: string | number; owner: boolean; color: string, vote: {id: string}, claim: {id: string}}[];
  cards: Card[];
  started: boolean;
  dealt: boolean;
}

@Component({
  components: {
    Setup,
    Game,
  }
})
class LobbyVue extends Vue {
  lobby: Lobby | null = null
  card: Card | null = null


  created () {
    this.setup()

    events.$on('lobby.refresh', (lobby: Lobby) => {
      if (this.lobby && this.lobby.id === lobby.id) {
        this.lobby = lobby
      }
    })

    events.$on('lobby.card', (lobby: Lobby, card: Card) => {
      if (this.lobby && this.lobby.id === lobby.id) {
        this.setCard(card)
      }
    })

    events.$on('lobby.disconnect', ({lobby, user}: {lobby: any; user: any}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.$toasted.show(`${user.name} has disconnected`, {
          icon: 'transfer_within_a_station',
          position: 'top-left',
          duration: 5000,
        })
      }
    })

    events.$on('lobby.join', ({lobby, user}: {lobby: any; user: any}) => {
      if (this.lobby && lobby.id === this.lobby.id) {
        this.$toasted.show(`${user.name} has connected`, {
          icon: 'transfer_within_a_station',
          position: 'top-left',
          duration: 5000,
        })
      }
    })
  }

  @Watch('$route.params.id')
  async setup () {
    const response = await axios.get(`/lobbies/${this.$route.params.id}`)
    this.lobby = response.data.data

    if (this.lobby && this.lobby.dealt && this.joined) {
      this.getCard()
    }
  }

  get joined () {
    if (!this.lobby) {
      return false
    }
    return this.lobby.users.find(u => u.id === this.$store.getters['user/id'])
  }

  async getCard () {
    if (this.lobby) {

      const response = await axios.get(`/lobbies/${this.lobby.id}/card`)
      if (response.status === 200) {
        this.setCard(response.data.data)
      }
    }
  }

  setCard (card: Card) {
    this.card = card
  }

}
export default LobbyVue

</script>
