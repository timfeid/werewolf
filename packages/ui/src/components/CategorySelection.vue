<template>
  <div class="category-selection">
    <div class="category-header">
      Categories
    </div>
    <CategoryContainer
      v-for="category in categories"
      :key="category.id"
      :category="category"
      :selected="value"
      @click="toggle"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import CategoryContainer from "./CategorySelection/CategoryContainer.vue"

const categories = [
  {
    id: 1,
    name: "Most popular"
  },
  {
    id: 2,
    name: "Holidays",
    subCategories: [
      {
        id: 3,
        name: "Christmas"
      },
      {
        id: 4,
        name: "Thanksgiving"
      },
      {
        id: 5,
        name: "Halloween"
      }
    ]
  }
]

@Component({
  data () {
    return {
      categories
    }
  },

  components: {
    CategoryContainer
  }
})
class CategorySelection extends Vue {
  @Prop(Array) value!: any[];

  toggle (cat: any) {
    const values = this.value.slice(0)
    const index = this.value.findIndex(c => c.id === cat.id)

    if (index === -1) {
      values.push(cat)
    } else {
      values.splice(index, 1)
    }

    this.$emit("input", values)
  }
}

export default CategorySelection
</script>

<style lang="scss">
.category {
  &-header {
    background: #eaeaea;
    padding: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
  &-selection {
    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid #eaeaea;
    border-bottom: 0;
  }
}
</style>
