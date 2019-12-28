<template>
  <form @submit.stop.prevent="joinLobby">
    <div class="form-group">
      <label for="name">
        Join Code
      </label>
      <input required autocomplete="off" id="code" class="form-control" v-model="code" />
    </div>
    <div class="form-group">
      <label for="name">
        Name
      </label>
      <input required autocomplete="off" id="name" class="form-control" v-model="name" />
    </div>
    <button type="submit" class="btn btn-outline-success w-100 d-block">
      Play!
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
  @Prop({required: false, type: String, default: false})
  joinCode!: string

  code!: string

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
    const response = await axios.post(`/lobbies/${this.code}/join`)
    if (response.status === 200) {
      this.$emit('joined', response.data.data)
    }
  }
}

export default JoinForm
</script>
