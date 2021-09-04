<template>
  <div class="projects">
    <div class="section-title">
      <prismic-rich-text :field="slice.primary.title" />
    </div>
    <ul class="side-border square-end">
      <li v-for="(item, idx) in slice.items.slice(0).reverse()" :key="idx">
        <div class="title">
          <h3 v-if="item.year">{{ $prismic.asDate(item.year).getFullYear() }}</h3>
          <prismic-rich-text :field="item.title" />
        </div>
        <div class="description">
          <div class="about">
            <h6 v-if="item.description_header">{{ item.description_header.toUpperCase() }}</h6>
            <prismic-rich-text :field="item.description" />
          </div>
          <div class="role">
            <h6 v-if="item.role_header">{{ item.role_header.toUpperCase() }}</h6>
            <prismic-rich-text :field="item.role" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ProjectList",
  props: {
    slice: Object,
  },
};
</script>