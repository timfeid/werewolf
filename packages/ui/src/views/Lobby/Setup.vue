<template>
  <div>

    <cards :owner="owner" :lobby="lobby" />
    <div class="d-flex flex-row flex-wrap" style="margin-left: -.5rem;">
      <player v-for="user in lobby.users" :key="user.id" :player="user" />
    </div>
    <div class="mt-3" v-if="owner">
      <ul v-if="errors.length > 0">

        <li class="text-danger" v-for="error in errors">
          {{ error }}
        </li>
      </ul>
      <button @click="deal" class="w-100 btn btn-primary text-lowercase alt-font">
        Deal
      </button>
    </div>
    <div class="mt-3" v-if="!joined">
      <join-form :join-code="lobby.id" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import axios from '../../axios'
import Tab from '@/components/Tabs/Tab.vue'
import Tabs from '@/components/Tabs/Tabs.vue'
import Player from '@/components/Player.vue'
import JoinForm from './JoinForm.vue'
import events from '../../events'
import Cards from './Cards.vue'
import { Card } from '../../store/cards/types'
import { Lobby } from '../Lobby.vue'

@Component({
  components: {
    JoinForm,
    Cards,
    Tab,
    Tabs,
    Player,
  }
})
class Setup extends Vue {
  @Prop({required: true, type: Object})
  lobby!: Lobby

  @Prop({required: true, type: Boolean})
  owner!: boolean

  errors: string[] = []

  get joined () {
    if (!this.lobby) {
      return false
    }
    return this.lobby.users.find(u => u.id === this.$store.getters['user/id'])
  }

  get isOwner () {
    return this.joined && this.joined.owner
  }

  async deal () {
    try {

      await axios.post(`/lobbies/${this.lobby.id}/deal`)
    } catch (e) {
      this.errors = e.response.data.data.errors
    }
  }

}
export default Setup

</script>
