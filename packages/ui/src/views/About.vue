<template>
  <div class="row">
    <div class="col-6">
      <img
        src="https://divvyup.imgix.net/2019/08/blue800.png?auto=compress%2Cformat&crop=faces&fit=scale&h=600&ixlib=php-1.2.1&w=600&wpsize=woocommerce_single&s=3b10163ae029d885cdb42dd6892b1d7d"
        alt="puppy socks"
      />
    </div>
    <div class="col-6">
      <h3>Custom Dog Socks</h3>
      <div class="text-muted">
        $29.99
      </div>
      <div class="mt-2">
        1. How many different faces?
        {{ test }}
      </div>
      <div>
        <RadioSelection v-model="test">
          <RadioOption :value="1">
            <div>
              1 face
            </div>
            <div>
              <div class="text-muted">
                $29.99
              </div>
            </div>
          </RadioOption>
          <RadioOption :value="2">
            <div>
              2 faces
            </div>
            <div>
              <div class="text-muted">
                $35.99
              </div>
            </div>
          </RadioOption>
        </RadioSelection>
      </div>
      {{ test2 }}
      <Dropdown v-model="test2" alignment="right" position="top">
        <DropdownOption value="this is a test">
          HEGLLooOo
        </DropdownOption>
        <DropdownOption value="woOoo">
          WOOOOOOOOOOOOOO
        </DropdownOption>
      </Dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import RadioOption from "@/components/RadioSelection/RadioOption.vue"
import Dropdown from "@/components/Dropdown/Dropdown.vue"
import DropdownOption from "@/components/Dropdown/DropdownOption.vue"
import RadioSelection from "@/components/RadioSelection/RadioSelection.vue"

@Component({
  components: {
    RadioOption,
    Dropdown,
    DropdownOption,
    RadioSelection
  }
})
class About extends Vue {
  test = 1;
  test2 = "testarino2";
}

export default About
</script>
