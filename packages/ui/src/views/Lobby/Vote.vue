<template>
  <div>
    <h3 class="timer text-center mt-3">
      {{ fmtMSS(juryTimer) }} remaining
    </h3>
    <div class="claim my-3">
      <div class="text-center">
        <span class="d-none d-md-inline">click</span>
        <span class="d-md-none">tap</span>
        one to claim
      </div>
      <div class="d-flex flex-wrap justify-content-center">
        <div class="claim-card" v-for="card in lobby.cards" @click="claim(card)">
          <card-image style="width: 100%" :card="card" />
        </div>
      </div>
    </div>

    <div class="votes">
      <ul class="list-group">
        <li class="list-group-item d-flex" v-for="user in lobby.users">
          <div class="d-flex align-items-center" style="flex-grow: 1;">

            <player :player="user" />

            <span class="mx-auto">&quot;{{ user.claim ? user.claim.name : 'Villager' }}&quot;</span>

            <div class="player mr-3">
              <card-image style="transform: scale(.75);margin-top: -1rem;margin-bottom: -1rem;margin-left: -1.8rem;" :card="user.claim ? {id: user.claim.id} : {id: 'VillagerCard'}" />
            </div>
          </div>
          <div class="ml-auto my-auto">

            <div class="badge badge-primary mr-1">
              {{ votesFor(user.id) }} votes
            </div>
            <button @click="voteFor(user)" class="btn btn-sm btn-info ml-auto text-lowercase">Vote</button>
          </div>
        </li>

        <li class="list-group-item d-flex">
          <div style="line-height: 26px">
            <player :player="{color: '#ffffff', name: 'Middle'}" />
          </div>
          <div class="ml-auto my-auto">
            <div class="badge badge-primary mr-1">
              {{ votesFor('middle') }} votes
            </div>
            <button @click="voteFor({id: 'middle'})" class="btn btn-sm btn-info ml-auto text-lowercase">Vote</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="owner" class="mt-3">
      <button @click="end" class="btn w-100 text-lowercase btn-outline-secondary">
        Complete game
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
import Player from '../../components/Player.vue'

@Component({
  components: {
    CardImage,
    Player,
  }
})
class Vote extends Vue {
  @Prop({required: true, type: Object})
  lobby!: Lobby

  @Prop({required: true, type: Boolean})
  owner!: boolean

  @Prop({required: false, type: Object})
  card!: Card

  @Prop({required: true, type: Number})
  juryTimer!: number

  voteFor (user: any) {
    axios.post(`/lobbies/${this.lobby.id}/vote`, {
      id: user.id,
    })
  }

  claim (card: any) {
    axios.post(`/lobbies/${this.lobby.id}/claim`, {
      id: card.id,
    })
  }

  end (card: any) {
    axios.post(`/lobbies/${this.lobby.id}/end`)
  }

  votesFor (userId: string) {
    return this.lobby.users.filter(u => u.vote && u.vote.id === userId).length
  }

  fmtMSS(s:number){return(s-(s%=60))/60+(9<s?':':':0')+s}
}
export default Vote

</script>

<style lang="scss">
.claim-card {
  width: 24%;
  cursor: pointer;
  margin-left: 3px;
  margin-top: 3px;
}
</style>
