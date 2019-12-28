<template>
  <div>
    <tabs>
      <tab name="Setup">
        <form @submit.stop.prevent="createLobby">
          <div class="form-group">
            <label for="name">
              Your name
            </label>
            <input required autocomplete="off" id="name" class="form-control" v-model="name" />
          </div>
          <button type="submit" class="btn text-lowercase btn-outline-success w-100 d-block">Start a lobby</button>
        </form>
      </tab>
    </tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Tabs from '../components/Tabs/Tabs.vue'
import Tab from '../components/Tabs/Tab.vue'
import { getModule } from 'vuex-module-decorators'
import axios from '../axios'

@Component({
  components: {
    Tabs,
    Tab
  }
})
class Create extends Vue {
  get name () {
    return this.$store.getters['user/name']
  }
  set name (name: string) {
    this.$store.dispatch('user/updateName', name)
  }

  async createLobby () {
    const response = await axios.post('/lobbies')
    if (response.status === 200) {
      this.$router.replace({name: 'lobby', params:{id: response.data.data.id}})
    }
  }
}
export default Create
</script>
