<template>
  <section v-show="isActive" :id="id" :aria-hidden="!isActive" role="tabpanel">
    <slot />
    <div v-show="false" class="prefix">
      <vnodes :vnodes="this.$slots.prefix" />
    </div>
    <div v-show="false" class="suffix">
      <vnodes :vnodes="this.$slots.suffix" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component({
  components: {
    Vnodes: {
      functional: true,
      render: (h: any, ctx: any) => ctx.props.vnodes
    }
  }
})
class Tab extends Vue {
  isActive = false;

  get id () {
    return this.name.toLowerCase().replace(/[^\w]+/g, "-")
  }

  get header () {
    return (
      this.$el.getElementsByClassName("prefix")[0].innerHTML +
      this.name +
      this.$el.getElementsByClassName("suffix")[0].innerHTML
    )
  }

  @Prop({ type: String, required: true })
  name!: string;

  // @Prop({type: String, default: ''})
  // public readonly prefix!: string

  // @Prop({type: String, default: ''})
  // public readonly suffix!: string
}

export default Tab
</script>
