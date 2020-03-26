<template>
  <div class="d-flex">
    <div v-if="!open" class="ml-auto d-flex">
      <div @click="open = true" class="align-self-center" style="cursor: pointer;">
        <span class="material-icons" style="font-size: 2rem;">tune</span>
      </div>
    </div>
    <div v-else class="settings">
      <div @click="open = false" class="close">
        <span class="material-icons">close</span>
      </div>

      <div class="content container">
        <div class="form-group">

          <label>
            Music volume
          </label>
          <vue-slider
            :value="musicVolume"
            @change="setMusicVolume"
            dot-size="20"
            height="10px"
            drag-on-click
          />
        </div>
        <div class="form-group">

          <label>
            Voice volume
          </label>
          <vue-slider
            :value="voiceVolume"
            @change="setVoiceVolume"
            dot-size="20"
            height="10px"
            drag-on-click
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { namespace } from 'vuex-class'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

const SettingsStore = namespace('settings')

@Component({
  components: {
    VueSlider,
  }
})
class Settings extends Vue {
  open = true
  testies = 0

  @SettingsStore.State musicVolume!: number
  @SettingsStore.Mutation setMusicVolume!: (v: number) => void

  @SettingsStore.State voiceVolume!: number
  @SettingsStore.Mutation setVoiceVolume!: (v: number) => void

}

export default Settings
</script>

<style lang="scss">
  .settings {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,.95);
    .content {
      margin-top: 10vh;
    }
  }
  .vue-slider-dot {
    &-handle {
      border: 0;
    }

  }
  .vue-slider:hover {
    .vue-slider-process {
        background-color: darken(#7A8288, 5%);
    }
  }

  .vue-slider-process {
    background-color: #7A8288;
  }

  .close {
    position: fixed;
    top: 1rem;
    right: 1rem;
    cursor: pointer;

    span {
      font-size: 3rem;
    }
  }

</style>