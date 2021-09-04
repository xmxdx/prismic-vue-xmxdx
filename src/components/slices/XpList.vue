<template>
  <div class="xp-list">
    <div class="section-title">
      <prismic-rich-text :field="slice.primary.title" />
    </div>
    <ul class="side-border-children triangle-end">
      <li v-for="(item, idx) in orderedSlices" :key="idx">
        <div class="period">
          <h4 v-html="item.time_span" style="text-transform: capitalize;" />
        </div>
        <div class="xp">
          <div class="heading">
            <prismic-rich-text :field="item.title" />
            <prismic-rich-text :field="item.subtitle" />
          </div>
          <ul class="side-border vert-line">
            <prismic-rich-text :field="item.description" />
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "XpList",
  props: {
    slice: Object,
  },
  computed: {
    orderedSlices() {
      const reversedItems = this.slice.items.slice(0).reverse();
      reversedItems.forEach(item => {
        item.time_span = this.formatDate(item.start_date, item.year_only) + ' - ' + this.formatDate(item.end_date, item.year_only);
      });
      return reversedItems;
    }
  },
  methods: {
    formatDate(date, yearOnly) {
      if (!date) {
        return "Presente";
      }
      let formattedDate = this.$prismic.asDate(date);
      if (!formattedDate) {
        return null;
      }
      if (yearOnly === true) {
        formattedDate = formattedDate.toLocaleDateString("it-IT", { year: "numeric" });
      } else {
        formattedDate = formattedDate.toLocaleDateString("it-IT", { month: "short", year: "numeric" }).split(" ").join("&nbsp;");
      }
      return formattedDate;
    },
  },
};
</script>