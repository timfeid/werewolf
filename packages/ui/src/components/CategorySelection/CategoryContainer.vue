<template>
  <div class="category-container">
    <a
      v-if="category.subCategories"
      href="javascript:;"
      class="category-name category-name--with-children"
      :class="{
        'category-name--open': open
      }"
      @click="open = !open"
    >
      {{ category.name }}
    </a>
    <div
      v-else
      class="category-name"
      :class="{
        'category-name--selected': selected.find(c => c.id === category.id)
      }"
      @click="$emit('click', category)"
    >
      {{ category.name }}s
    </div>
    <div v-if="category.subCategories && open" class="category-subcategories">
      <div
        v-for="subCategory in category.subCategories"
        :key="subCategory.id"
        class="category-container"
      >
        <div
          :class="{
            'category-name--selected': selected.find(
              c => c.id === subCategory.id
            )
          }"
          class="category-name"
          @click="$emit('click', subCategory)"
        >
          {{ subCategory.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component({
  data () {
    return {
      open: false
    }
  }
})
class CategoryContainer extends Vue {
  @Prop()
  category!: object;

  @Prop(Array) selected!: any[];
}

export default CategoryContainer
</script>

<style lang="scss">
.category {
  &-name {
    padding: 1rem;
    position: relative;
    width: 100%;
    display: block;
    border-bottom: 1px solid #eaeaea;
    border-left: 2px solid #fff;

    &--selected {
      border-left-color: red;
    }

    &--with-children {
      color: black;
      text-decoration: none;
      background: #fafafa;
      border-left: #fafafa;
      &::after {
        content: "▲";
        position: absolute;
        right: 3rem;
        width: 1rem;
        height: 1rem;
      }

      &.category-name--open {
        &::after {
          content: "▼";
        }
      }
    }
  }
  &-subcategories {
    .category {
      &-name {
        padding-left: 2rem;
      }
    }
  }
}
</style>
