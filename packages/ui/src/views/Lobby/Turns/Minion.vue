<template>
  <div />
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import TurnMixin from './Mixin.vue'
import { Card } from '../../../store/cards/types'
import Middle from '@/components/Middle.vue'
import Player from '@/components/Player.vue'
import axios from '../../../axios'

@Component({
  components: {
    Middle,
    Player,
  }
})
class MinionTurn extends TurnMixin {
  mounted () {
    this.watchData()
  }
  @Watch('data', {deep: true})
  watchData () {
    if (!this.data.werewolves) {
      return
    }
    if (this.data.werewolves.length === 0) {
      return this.$emit('keeper-text', 'You did not see anyone. All the Werewolves are in the middle')
    }

    this.$emit('keeper-text', 'You saw ' + this.data.werewolves.map((p: any) => p.name).join(', ') + ' as Werewolves')
  }
}

export default MinionTurn
</script>
