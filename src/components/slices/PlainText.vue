<template>
  <div class="skills-field">
    <div class="side-border square-end">
      <div class="section-subtitle">
        <prismic-rich-text :field="slice.primary.title" />
      </div>
      <prismic-rich-text :field="slice.primary.text_field" />
    </div>
  </div>
</template>

<script>
export default {
  name: "PlainText",
  props: {
    slice: Object,
  },
};
</script>