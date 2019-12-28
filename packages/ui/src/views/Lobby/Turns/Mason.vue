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
class MasonTurn extends TurnMixin {
  @Watch('data', {deep: true})
  watchData () {
    if (!this.data.masons) {
      return
    }
    if (this.data.masons.length === 1) {
      return this.$emit('keeper-text', 'You did not see anyone. The other Mason is in the middle')
    }

    this.$emit('keeper-text', 'You saw ' + this.data.masons.map((p: any) => p.name).join(', ') + ' as Masons')
  }
}

export default MasonTurn
</script>
