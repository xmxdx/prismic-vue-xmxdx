<template>
  <div class="skills-field">
    <div class="side-border square-end">
      <div class="section-subtitle">
          <prismic-rich-text :field="slice.primary.list_title" />
      </div>
      <dl class="software">
        <template v-for="(pair, idx) in slice.items">
          <dt :key="idx">{{ pair.term }}:</dt>
          <dd :key="idx+'-value'">{{ pair.description }}</dd>
        </template>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: "TermDescription",
  props: {
    slice: Object,
  },
};
</script>