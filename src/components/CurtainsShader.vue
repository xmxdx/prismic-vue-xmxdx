<template>
  <router-link to="resume">
    <div class="wrapper">
      <div id="canvas"></div>
      <div class="plane">
        <prismic-image
          v-if="doc"
          :field="doc.data.image"
          crossorigin
          data-sampler="uImage"
        />
      </div>
    </div>
    <div v-if="msg404" id="msg-404">
      <h1 style="width: 100%; margin: 0; font-size: 5em; text-align: center">404</h1>
      <h1>{{ msg404 }}</h1>
    </div>
  </router-link>
</template>

<script>
import { curtains, installShader } from "@/assets/landing";

export default {
  name: "CurtainsShader",
  props: {
    msg404: String,
  },
  data() {
    return {
      doc: null,
    };
  },
  watch: {
    doc(val) {
      if (val) {
        setTimeout(installShader, 100);
      }
    },
  },
  methods: {
    async getContent() {
      this.doc = await this.$prismic.client.getSingle("landing-page");
    },
  },
  beforeCreate() {
    document.body.classList.add("landing");
  },
  created() {
    this.getContent();
  },
  beforeDestroy() {
    document.body.classList.remove("landing");
    curtains.dispose();
  },
};
</script>

<style>
body.landing {
  /* make the body fits our viewport */
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  background: black;
  font-family: "helvetica-neue", helvetica, arial, sans-serif;
}

#msg-404 {
  display: flex;
  flex-wrap: wrap;
  place-content: center;
  margin: 15%;
  color: white;
  mix-blend-mode: overlay;
  transition: opacity 2s 10s, visibility 2s 10s;
  font-size: 1.1em;
}

#wrapper-lang {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
}

#wrapper-lang a {
  display: flex;
  width: 50%;
  text-align: center;
  text-decoration: none;
}

#wrapper-lang a h1 {
  align-self: center;
  width: 20%;
  min-width: 50px;
  background: black;
  color: #f5f5f5;
  transition: 300ms;
  border: solid #420cbd;
  border-width: 1px 0;
}

#wrapper-lang a:hover h1 {
  width: 25%;
  min-width: 75px;
  padding: 1%;
  background: #f5f5f5;
  color: black;
  letter-spacing: 0.15em;
}

#wrapper-lang,
#msg-404 {
  /* make the canvas wrapper fits the document */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

.plane,
#canvas {
  /* define the size of your plane */
  position: absolute;
  width: 80%;
  height: 80vh;
  margin: 10vh 10%;
}

.plane img {
  /* hide the img element */
  display: none;
}
</style>