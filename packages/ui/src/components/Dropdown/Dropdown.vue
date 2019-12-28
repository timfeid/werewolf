<template>
  <div
    class="dropdown show"
    @click.stop="clicked"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <a
      class="dropdown-toggle"
      href="javascript:;"
      role="button"
      id="dropdownMenuLink"
      data-toggle="dropdown"
      aria-haspopup="true"
      :aria-expanded="dropdownOpen"
    >
      <slot name="trigger">
        {{ display }}
      </slot>
    </a>

    <div
      v-if="dropdownOpen"
      class="dropdown-menu show"
      ref="dropdownMenu"
      :class="{
        'dropdown-menu-right': alignment === 'right'
      }"
      aria-labelledby="dropdownMenuLink"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator"
import DropdownOption from "./DropdownOption.vue"

@Component
class Dropdown extends Vue {
  options: DropdownOption[] = [];
  dropdownOpen = false;

  @Prop({ required: false, default: null })
  value!: any;

  @Prop({ required: false, default: "click", type: String })
  trigger!: "click" | "hover";

  @Prop({ required: false, default: "left", type: String })
  alignment!: "left" | "right";

  @Prop({ required: false, default: "bottom", type: String })
  position!: "left" | "right" | "bottom" | "top";

  @Prop({ type: String, default: "Please select" })
  placeholder!: any;

  @Prop({ required: false, type: Boolean, default: false })
  multiselect!: boolean;

  timeout: NodeJS.Timeout | null = null
  dropdownOffset: ClientRect | DOMRect | null = null;

  get display () {
    for (const option of this.options) {
      if (option.isSelected) {
        return option.$el.textContent
      }
    }

    return this.placeholder
  }

  created () {
    this.options = this.$children as DropdownOption[]
  }

  mounted () {
    this.$on("select", this.select)
    this.markSelected()
    document.body.addEventListener("click", e => {
      if (e.target !== this.$el && !this.$el.contains(e.target as Node)) {
        this.$nextTick(() => {
          this.close()
        })
      }
    })
  }

  moveToBody () {
    const stuff = (this.$refs.dropdownMenu as HTMLElement).offsetTop
    document.body.append(this.$refs.dropdownMenu as Node)
  }

  @Watch("value")
  watchValue () {
    this.markSelected()
  }

  markSelected () {
    this.options.forEach(option => {
      option.isSelected = this.value === option.value
    })
  }

  select (val: any) {
    this.$emit("input", val)
    this.close()
  }

  clicked () {
    if (this.trigger === "click") {
      this.toggle()
    }
  }

  mouseenter () {
    if (this.trigger === "hover") {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.open()
    }
  }

  mouseleave () {
    if (this.trigger === "hover") {
      this.timeout = setTimeout(this.close, 100)
    }
  }

  open () {
    if (!this.dropdownOpen) {
      this.dropdownOpen = true
      this.$nextTick(() => {
        this.putInPosition()
      })
    }
  }

  putInPosition () {
    const offset = (this.$el as HTMLElement).getBoundingClientRect()
    const el = this.$refs.dropdownMenu as HTMLElement
    if (!this.dropdownOffset) {
      this.dropdownOffset = el.getBoundingClientRect()
    }
    let top = offset.top + offset.height
    if (this.position === "top") {
      top -= this.dropdownOffset.height
      top -= offset.height
    }
    el.style.top = `${top}px`

    let left = offset.left
    if (this.alignment === "right") {
      left -= this.dropdownOffset.width
      left += offset.width
    }

    el.style.left = `${left}px`
    el.style.width = `${this.dropdownOffset.width}px`

    document.body.appendChild(el)
  }

  close () {
    if (this.dropdownOpen) {
      this.dropdownOpen = false
    }
  }

  toggle () {
    if (!this.dropdownOpen) {
      this.open()
    } else {
      this.close()
    }
  }
}

export default Dropdown
</script>

<style lang="scss">
.dropdown {
  display: inline-block;
  &-menu {
    position: absolute;
    background: $white;
    border: 1px solid #e7e7e7;
    padding: $spacer;
  }
  &-toggle {
    color: #606266;
    display: inline-block;
  }
  &.select {
    &:hover {
      border-color: darken(#e7e7e7, 5%);
      color: darken(#606266, 3%);
      text-decoration: none;
    }
    border-radius: 5px;
    border: 1px solid #e7e7e7;
    padding: 0.2rem 1rem;
  }
  &.no-chev {
    .dropdown-toggle {
      &::after {
        display: none !important;
      }
    }
  }
}
</style>
