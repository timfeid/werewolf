<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Lobby } from '../../Lobby.vue'
import { Card } from '../../../store/cards/types'
import { Player } from '../../../components/Player.vue'

@Component
export default class TurnMixin extends Vue {
  @Prop({required: true, type: Object})
  lobby!: Lobby

  @Prop({required: true, type: Object})
  card!: Card

  @Prop({required: true, type: Object})
  data!: Record<string, any>

  get playersBesideMe () {
    return this.lobby.users.filter(u => u.id !== this.$store.getters['user/id'])
  }

  playerIndex (player: Player) {
    return this.lobby.users.findIndex(u => u.id === player.id)
  }
}
</script>
