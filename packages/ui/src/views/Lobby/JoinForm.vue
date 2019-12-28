<template>
  <form @submit.stop.prevent="joinLobby">
    <div class="form-group">
      <label for="name">
        Join code
      </label>
      <input required autocomplete="off" id="code" class="form-control" v-model="code" />
    </div>
    <div class="form-group">
      <label for="name">
        Your name
      </label>
      <input required autocomplete="off" id="name" class="form-control" v-model="name" />
    </div>
    <button type="submit" class="btn btn-outline-success w-100 d-block text-lowercase">
      Join game
    </button>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import axios from '../../axios'

@Component({
  components: {
  }
})
class JoinForm extends Vue {
  @Prop({required: false, type: String, default: ''})
  joinCode!: string

  code = ''

  created () {
    this.code = this.joinCode
  }

  get name () {
    return this.$store.getters['user/name']
  }
  set name (name: string) {
    this.$store.dispatch('user/updateName', name)
  }

  async joinLobby () {
    const code = this.code.toUpperCase()
    const response = await axios.post(`/lobbies/${code}/join`)
    if (response.status === 200) {
      this.$emit('joined', response.data.data)
    }
  }
}

export default JoinForm
</script>
