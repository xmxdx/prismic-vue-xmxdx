<template>
  <div>
    <canvas id="bkgr"></canvas>
    <!-- <router-link to="/">
      <ul id="select-lang">
        <li>EN</li>
        <li current>IT</li>
      </ul>
    </router-link> -->
    <div id="select-lang" style="border: none !important"></div>
    <div id="content">
      <div id="header">
        <div class="name">
          <prismic-rich-text v-if="doc" :field="doc.data.name" />
          <prismic-rich-text v-if="doc" :field="doc.data.job" />
        </div>
        <div class="info">
          <dl>
            <dt></dt>
            <dd>{{ doc && doc.data.phone }}</dd>
            <dt></dt>
            <dd>{{ doc && doc.data.email }}</dd>
          </dl>
        </div>
      </div>
      <div id="ps" class="side-border square-end">
        <div id="my-pic">
          <div>
            <prismic-image v-if="doc" :field="doc.data.image" />
          </div>
        </div>
        <prismic-rich-text v-if="doc" :field="doc.data.statement" />
      </div>
      <SliceZone
        v-if="doc"
        :slices="doc.data.body"
        :resolver="({ sliceName }) => slices[sliceName]"
      />
      <SliceZone
        v-if="doc"
        :slices="doc.data.body1"
        :resolver="({ sliceName }) => slices[sliceName]"
      />
      <SliceZone
        v-if="doc"
        :slices="doc.data.body2"
        :resolver="({ sliceName }) => slices[sliceName]"
      />
      <div id="skills">
        <div class="section-title">
          <prismic-rich-text
            v-if="doc"
            :field="doc.data.skills_section_title"
          />
        </div>
        <div class="skills-wrapper">
          <div class="skills-field">
            <div class="side-border square-end">
              <div class="section-subtitle">
                <prismic-rich-text
                  v-if="doc"
                  :field="doc.data.xp_use_list_title"
                />
              </div>
              <dl class="prog-lang idle">
                  <template v-for="(item, idx) in progLang">
                    <dt :key="idx">
                      <h5>{{ item.language }}</h5>
                    </dt>
                    <dd :style="'--item: ' + idx" :key="idx + '-val'">
                      <div class="timeline"></div>
                      <div
                        class="event"
                        :style="'width: '+item.xp+'%; --start: '+item.start+'%; --span: '+item.span+'%'"
                      ></div>
                    </dd>
                  </template>
                <dt class="caption">
                  <div class="shift graph-name">
                    <h5>ESPERIENZA</h5>
                    <h5>UTILIZZO</h5>
                  </div>
                </dt>
                <dd class="caption" style="align-self: center">
                  <div class="shift">
                    <div class="values" style="justify-content: space-around">
                      <h5>bassa</h5>
                      <h5>media</h5>
                      <h5>alta</h5>
                    </div>
                    <div class="values" style="justify-content: space-between">
                      <h5>← passato</h5>
                      <h5>2015</h5>
                      <h5>2017</h5>
                      <h5>2019</h5>
                      <h5>presente •</h5>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <SliceZone
            v-if="doc"
            :slices="doc.data.body3"
            :resolver="({ sliceName }) => slices[sliceName]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { animation, releaseResources } from '@/assets/resume';
import SliceZone from "vue-slicezone";
import XpList from "@/components/slices/XpList";
import ProjectList from "@/components/slices/ProjectList";
import PlainText from "@/components/slices/PlainText";
import TermDescription from "@/components/slices/TermDescription";

export default {
  name: "Resume",
  components: {
    SliceZone,
  },
  data() {
    return {
      doc: null,
      slices: {
        XpList,
        ProjectList,
        PlainText,
        TermDescription,
      },
    };
  },
  watch: {
    doc(val) {
      if(val) {
        setTimeout(animation, 100);
      }
    },
  },
  computed: {
    progLang() {
      const items = this.doc?.data.xp_use_list;
      if (!items) {
        return null;
      }
      const gStart = new Date('2013');
      const gEnd = new Date('2022');
      const timeSpan = gEnd - gStart;
      items.forEach(item => {
        let start = new Date(this.$prismic.asDate(item.start_date));
        let end = new Date(this.$prismic.asDate(item.end_date));
        start = isNaN(start.valueOf()) ? new Date(gStart) : start;
        end = isNaN(end.valueOf()) ? new Date(gEnd) : end;
        start = Math.max(gStart, Math.min(gEnd, start));
        end = Math.max(gStart, Math.min(gEnd, end));
        item.start = 100 * (start - gStart) / timeSpan;
        item.start = Math.max(0, Math.min(90, item.start));
        item.span = 100 * (end - start) / timeSpan;
        item.span = Math.max(10, Math.min(100, item.span));
      });
      return items;
    }
  },
  methods: {
    async getContent() {
      this.doc = await this.$prismic.client.getSingle("cv");
    },
  },
  created() {
    this.getContent();
  },
  beforeMount() {
    document.body.classList.add("resume");
  },
  beforeDestroy() {
    document.body.classList.remove("resume");
    releaseResources();
  },
}
</script>

<style>
:root {
  --hue: transparent;
}

body.resume {
  margin: 0;
  font-family: "helvetica neue", helvetica, arial, sans-serif;
  font-weight: 300;
  letter-spacing: 0.05em;
  background: #f5f5f5;
  color: var(--hue);
}

::selection {
  background-color: black;
  color: white;
}

canvas#bkgr {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
}

#select-lang {
  position: fixed;
  z-index: 10;
  display: flex;
  list-style: none;
  top: 1.3em;
  right: 1.3em;
  border: 1px solid var(--hue);
  margin: 0;
  padding: 0;
  opacity: 1;
  visibility: visible;
  transition: opacity 500ms, visibility 500ms;
}

#select-lang a {
  text-decoration: none;
}

#select-lang li {
  padding: 0 0.3em;
  text-decoration: none;
  font-weight: 400;
  color: var(--hue);
}

#select-lang li[current] {
  background: var(--hue);
  color: white;
}

#content {
  width: 75%;
  margin: auto;
  padding: 20px 10px;
  background: #f5f5f5cc;
  background: linear-gradient(
    90deg,
    #f5f5f500 0%,
    #f5f5f5cc 10%,
    #f5f5f5cc 90%,
    #f5f5f500 100%
  );
}

#content h3,
b {
  font-weight: 400;
}

.section-title,
#header .name h1 {
  margin: 2px 0;
  padding: 5px 10px;
  border-bottom: 1px solid #dadada;
  /*border-style: solid;
                border-width: 0 0 2px 0;
                border-image-source: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20100%22%3E%3Cpath%20d%3D%22M0%2050L200%2055L200%2045L0%2050Z%22%2F%3E%3C%2Fsvg%3E');
                border-image-slice: 0% 1% 100% 15%;*/
}

.section-title {
  margin-left: -6.18%;
}

.section-title h4 {
  font-weight: 500;
}

#content > div {
  margin-top: 50px;
  margin-bottom: 20px;
}

#content #header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  margin: 50px 0;
}

#header {
  font-weight: 400;
}

#header .name *,
.section-title h4 {
  text-transform: uppercase;
  margin: 2px 0;
}

#header .name h1 {
  font-weight: 500;
  width: 106.18%;
}

#header .name h3 {
  margin-left: 10px;
}

.name {
  min-width: max-content;
  margin-right: 50px;
}

.info {
  margin-top: 30px;
}

.info dl {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 5px 10px;
  margin: 4px 0;
  padding-right: 20px;
}

.info dt {
  font-variant-caps: all-small-caps;
  text-align: right;
  /*width: 1.3em;
                height: 1.3em;*/
}

.info dd {
  margin: auto 0;
}

#content ul {
  list-style-type: none;
  padding-left: 0;
}

#content ul > li {
  margin-bottom: 50px;
}

#ps {
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
}

#ps p {
  margin-right: 20px;
}

#my-pic {
  width: 150px;
  height: 150px;
  padding: 0 1em;
  margin: 0 -1em;
  overflow: hidden;
}

#my-pic img {
  width: 100%;
  height: auto;
  transform-origin: bottom;
}

p.side-border {
  text-indent: 0.5em;
}

.xp-list > ul > li {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.xp ul li {
  display: list-item !important;
  list-style-type: disc;
  list-style-position: inside;
  text-indent: -0.5em;
  margin-bottom: 5px !important;
}

.xp h4 {
  font-weight: 300;
  margin-left: 0.3em !important;
}

.period {
  padding-right: 1em;
}

.period h4 {
  font-weight: 400;
  line-height: 1.3em;
}

.heading > *,
.projects li .title h3 {
  margin: 0;
}

.projects li .title > h3:first-child {
  font-size: 1em;
  line-height: 1.4em;
}

.projects li .title {
  display: grid;
  grid-template-columns: min-content auto;
  grid-column-gap: 15px;
}

.projects .description {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-left: 3em;
}

.projects .description p {
  margin: 5px 0 10px;
  padding: 0 5px;
}

.projects .description h6 {
  margin: 0;
  padding: 5px 10px;
  border-bottom: 1px solid #dadada;
  font-weight: 400;
}

.projects .description .about,
.projects .description .role {
  margin-left: 2%;
  flex: 1 1 290px;
}

#skills .prog-lang {
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 0.5em;
  align-items: baseline;
  margin: 10px 0;
}

#skills .prog-lang h5 {
  margin: 0;
  text-align: right;
  font-weight: 400;
}

#skills .prog-lang dd {
  position: relative;
  overflow: hidden;
  margin: 0;
  height: 7px;
}

#skills .prog-lang .timeline {
  height: 1px;
  margin-top: 3px;
  background: #bababa;
}

#skills .prog-lang .event {
  position: absolute;
  top: 0;
  height: 100%;
  background: #555;
  border-radius: 7px;
  transition: 500ms cubic-bezier(0.47, 0, 0.75, 0.72);
  transition-property: margin-left, width;
  transition-delay: calc(var(--item) * 30ms);
}

#skills .prog-lang.hover .event {
  margin-left: var(--start) !important;
  width: var(--span) !important;
  transition: 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
  transition-delay: 0ms;
}

#skills .prog-lang .shift {
  width: 100%;
  transition: transform 300ms;
}

#skills .prog-lang.hover .shift {
  transform: translateY(-1em);
}

#skills .prog-lang .graph-name h5 {
  font-weight: 500;
  text-align: center;
}

#skills .prog-lang .values {
  display: flex;
}

#skills .prog-lang .values h5 {
  font-weight: 300;
  font-size: 0.6em;
  line-height: 1.7em;
}

#skills .prog-lang .caption {
  height: 1em;
  margin-top: 0.5em;
  overflow: hidden;
}

#skills .prog-lang.idle .event {
  margin-left: 0 !important;
  width: 0 !important;
}

#skills .section-subtitle > h5 {
  margin: 0 0 0.8em;
}

#skills .side-border {
  margin-top: 1em;
}

#skills .software dt {
  font-weight: 400;
  margin-top: 0.3em;
}

#skills .software dd {
  margin-left: 1em;
}

.skills-wrapper {
  columns: 2 350px;
}

.skills-field {
  padding: 1px;
  break-inside: avoid;
}

.side-border,
.side-border-children {
  margin-left: 1em;
}

ul .side-border {
  margin-left: 5px !important;
}

.side-border-children {
  padding-left: 0;
}

.side-border-children .heading h4 {
  margin-top: 0;
}

.side-border-children div > *,
.title ~ *,
.section-subtitle ~ * {
  margin: 0.5em 0 0;
}

.side-border-children div > :first-child,
.side-border > :first-child {
  margin-top: 0 !important;
}

.side-border-children div > :last-child,
.side-border > :last-child {
  margin-bottom: 0 !important;
}

.side-border,
.side-border-children > * {
  padding-left: 15px !important;
  border-style: solid;
  border-width: 0 0 0 1px;
  border-image-source: inherit;
  border-image-slice: inherit;
  border-image-width: 7px;
  border-image-outset: 0 0 0 3px;
  border-image-repeat: stretch;
}

.side-border-children > * {
  padding-bottom: 10px;
}

.triangle-end {
  border-image-source: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20200%22%3E%3Cpath%20d%3D%22M50%200L55%20122.06L100%20200L0%20200L45%20122.06L50%200Z%22%2F%3E%3C%2Fsvg%3E");
  border-image-slice: 15% 0% 50% 100%;
  border-image-width: 0;
}

.square-end {
  border-image-source: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20200%22%3E%3Cpath%20d%3D%22M50%200L55%20105L100%20150L50%20200L50%20200L0%20150L45%20105L50%200Z%22%2F%3E%3C%2Fsvg%3E");
  border-image-slice: 15% 0% 50% 100%;
  padding-bottom: 15px;
}

.vert-line {
  border-image-source: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20200%22%3E%3Cpath%20d%3D%22M50%200L55%20200L45%20200L50%200Z%22%2F%3E%3C%2Fsvg%3E");
  border-image-slice: 15% 0% 1% 100%;
}

@media (hover: hover) and (pointer: fine) {
  #skills .prog-lang:hover .event {
    margin-left: var(--start) !important;
    width: var(--span) !important;
    transition: 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
    transition-delay: 0ms;
  }

  #skills .prog-lang:hover .shift {
    transform: translateY(-1em);
  }
}

@media (max-width: 960px) {
  #content {
    width: 90%;
  }

  .section-title {
    margin-left: inherit;
  }

  .xp-list ul > li {
    grid-template-columns: 1fr;
  }

  .period h4 {
    margin-left: 0.7em;
  }

  .projects li .title {
    grid-template-columns: auto;
  }

  .projects li .title > h3:first-child {
    margin-left: 0.3em;
  }

  .projects .description {
    margin-left: 0.5em;
  }

  .projects li p {
    margin-left: 1.3em;
  }
}

@media (min-width: 1280px) {
  #content {
    width: 60%;
  }
}

@media (min-width: 1920px) {
  #content {
    width: 40%;
  }
}

@media print {
  canvas,
  #select-lang {
    display: none;
  }

  body.resume {
    color: black !important;
    background: white;
  }

  #content {
    background: white;
  }

  #my-pic img {
    opacity: 0.8;
    transform: none !important;
  }

  .section-title {
    break-after: avoid-page;
  }

  ul.side-border,
  ul.side-border-children {
    break-before: avoid-page;
  }

  p,
  .side-border > li,
  .side-border-children > li {
    break-inside: avoid-page;
  }
}
</style>
