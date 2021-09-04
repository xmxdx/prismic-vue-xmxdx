let self = {};
let ctx = null;
let observer = null;
let animFrame = null;

function bfPrint() { self.progLang.classList.remove('idle'); }
function afPrint() { self.hasTriggered ? null : self.progLang.classList.add('idle') }
function tcStart(e) {
  if (e.target === self.progLang) {
    self.progLang.classList.toggle('hover');
  } else {
    self.progLang.classList.remove('hover');
  }
}

function scrollCB() {
  self.offset = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0;
  self.offset = self.offset * self.dpr;

  document.documentElement.style.setProperty('--hue', "hsl(" + (258 - self.offset * self.hueScale) + "deg 88% " + (39 - self.offset * 0.008) + "%)");

  if (self.offset < 400 * self.dpr) {
    self.myPic.style.transform = "perspective(500px) rotateX(" + (self.offset * 0.05) + "deg) translateY(" + (self.offset * 0.1 - 12) + "px)";
    self.langSel.style.visibility = 'visible';
    self.langSel.style.opacity = 1;
  } else {
    if (self.offset - self.prevOffset > 0) {
      self.langSel.style.visibility = 'hidden';
      self.langSel.style.opacity = 0;
    } else {
      self.langSel.style.visibility = 'visible';
      self.langSel.style.opacity = 1;
    }
  }

  if (self.needReqAnim && ctx) {
    animFrame = requestAnimationFrame((ts) => { self.prevTs = ts });
    animFrame = requestAnimationFrame(self.render);
    self.needReqAnim = false;
  }
}

function vsChange() {
  if (document.visibilityState === 'hidden') {
    clearTimeout(self.kill);
    // console.groupEnd(); console.log("*** killed | kill =", kill, Date().toString());
    self.kill = null;
    self.particles.splice(0, self.particles.length);
    self.needReqAnim = true;
  } else if (self.kill === null && document.visibilityState === 'visible') {
    self.kill = setTimeout(self.animateOnIdle, 500 + 2000 * Math.random());
    // console.log("*** restarted | kill =", kill, Date().toString()); console.groupCollapsed('Add');
  }
}

function animation() {
  self.langSel = document.getElementById('select-lang');
  self.progLang = document.getElementsByClassName('prog-lang')[0];
  self.myPic = document.getElementById('my-pic').firstElementChild;
  self.canvas = document.getElementById('bkgr');
  self.dpr = window.devicePixelRatio * 0.25;
  self.needReqAnim = true;
  self.offset = (document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0) * self.dpr;
  self.prevOffset = self.offset;
  self.prevTs = 0;
  self.particles = [];
  self.isAnyDead = false;
  self.kill = null;
  self.hasTriggered = false;
  self.hueScale = 120 / (document.documentElement.scrollHeight * self.dpr);
  self.render = (ts) => {
    adjustCanvasSize();
    run(ts);
    if (self.particles.length > 0) {
      animFrame = requestAnimationFrame(self.render);
    } else {
      self.needReqAnim = true;
    }
  };

  ctx = self.canvas.getContext ? self.canvas.getContext('2d') : null;

  {
    const hueVal = 258 - self.offset * self.hueScale;
    const lumVal = 39 - self.offset * 0.008;
    document.documentElement.style.setProperty('--hue', "hsl(" + hueVal + "deg 88% " + lumVal + "%)");
    const xRot = Math.min(self.offset, 400 * self.dpr) * 0.1;
    const yTrans = Math.min(self.offset, 400 * self.dpr) * 0.1 - 12;
    self.myPic.style.transform = "perspective(500px) rotateX(" + xRot + "deg) translateY(" + yTrans + "px)";
  }

  window.addEventListener("beforeprint", bfPrint);
  window.addEventListener("afterprint", afPrint);
  window.addEventListener("touchstart", tcStart);

  observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      entries[0].target.classList.remove('idle');
      self.hasTriggered = true;
    }
    if (self.hasTriggered) {
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(self.progLang);

  document.addEventListener("scroll", scrollCB);

  document.addEventListener("visibilitychange", vsChange);

  const removeParticles = () => {
    if (self.isAnyDead) {
      self.particles = self.particles.filter((particle) => particle.isAlive);
      self.isAnyDead = false;
    }
  };

  const inBoundsCheck = (pos) => {
    const yPosOnCanvas = pos.y - self.offset;
    if (pos.x < 0 ||
      pos.x > ctx.canvas.width ||
      yPosOnCanvas < 0 ||
      yPosOnCanvas > ctx.canvas.height) {
      self.isAnyDead = true;
      return false;
    }
    return true;
  };

  // const addCapsules = () => {
  //   if (self.offset !== self.prevOffset) {
  //     const span = Math.abs(self.offset - self.prevOffset) / (4 * self.dpr);
  //     const scrollDir = (self.offset - self.prevOffset) > 0 ? -1 : 1;
  //     const start = scrollDir > 0 ? 0 : ctx.canvas.height;
  //     const col = "hsl(" + (138 - self.offset * self.hueScale * 2) + "deg 80% 80%)";
  //     for (let yPos = 0; yPos < span; yPos += 10 * Math.random() + 2) {
  //       self.particles.push({
  //         speed: (5 * self.dpr * Math.random() + 1) * (Math.sign(Math.random() - 0.5) || 1),
  //         size: {
  //           body: 10 * self.dpr * Math.random() + 1,
  //           stroke: Math.floor(10 * self.dpr * Math.random() + 1)
  //         },
  //         pos: {
  //           x: 0.5 * ctx.canvas.width,
  //           y: (yPos * scrollDir) + self.offset + start
  //         },
  //         color: col,
  //         isAlive: true
  //       });
  //     }
  //     self.prevOffset = self.offset;
  //   }
  // };

  const addDrops = (num) => {
    if (num) {
      const dir = Math.sign(Math.random() - 0.5) || 1;
      const start = dir > 0 ? 0 : ctx.canvas.height;
      for (let i = 0; i < num; i++) {
        self.particles.push({
          speed: (5 * self.dpr * Math.random() + 1) * dir,
          size: {
            body: 10 * self.dpr * Math.random() + 1,
            stroke: Math.floor(10 * self.dpr * Math.random() + 1)
          },
          pos: {
            x: Math.random() * ctx.canvas.width,
            y: self.offset + start
          },
          color: "hsl(" + (258 - (self.offset + Math.random() * ctx.canvas.height) * self.hueScale) + "deg " + (80 - self.offset * 0.02) + "% 80%)",
          isAlive: true
        });
      }

    } else if (self.offset !== self.prevOffset) {
      const span = Math.abs(self.offset - self.prevOffset) / (2 * self.dpr);
      const scrollDir = (self.offset - self.prevOffset) > 0 ? -1 : 1;
      const start = scrollDir > 0 ? 0 : ctx.canvas.height;
      const col = "hsl(" + (258 - self.offset * self.hueScale) + "deg " + (80 - self.offset * 0.02) + "% 80%)";
      const sparsity = 17000 / span;
      for (let xPos = sparsity * Math.random(); xPos < ctx.canvas.width; xPos += sparsity * Math.random() + sparsity) {
        self.particles.push({
          speed: (5 * self.dpr * Math.random() + 1) * scrollDir,
          size: {
            body: 10 * self.dpr * Math.random() + 1,
            stroke: Math.floor(10 * self.dpr * Math.random() + 1)
          },
          pos: {
            x: xPos,
            y: Math.random() * span * scrollDir + self.offset + start
          },
          color: col,
          isAlive: true
        });
      }
      self.prevOffset = self.offset;
    }
  };

  // const moveCapsules = (ts) => {
  //   const deltaTs = (ts - self.prevTs);
  //   self.prevTs = ts;
  //   self.particles.forEach((particle) => {
  //     particle.pos.x += particle.speed * deltaTs * 0.08;
  //     particle.isAlive = inBoundsCheck(particle.pos);
  //   });
  // };

  const moveDrops = (ts) => {
    const deltaTs = (ts - self.prevTs);
    self.prevTs = ts;
    self.particles.forEach((particle) => {
      particle.pos.y += particle.speed * deltaTs * 0.08;
      particle.isAlive = inBoundsCheck(particle.pos);
    });
  };

  // const updateCapsules = (ts) => {
  //   removeParticles();
  //   addCapsules();
  //   moveCapsules(ts);
  // };

  const updateDrops = (ts) => {
    removeParticles();
    addDrops();
    moveDrops(ts);
  };

  // const drawCapsules = () => {
  //   ctx.lineCap = 'round';
  //   ctx.globalCompositeOperation = 'overlay';
  //   self.particles.forEach((particle) => {
  //     const yPosOnCanvas = Math.floor(particle.pos.y - self.offset) + particle.size.stroke * 0.5;
  //     ctx.beginPath();
  //     ctx.moveTo(Math.floor(particle.pos.x), yPosOnCanvas);
  //     ctx.lineTo(Math.floor(particle.pos.x + particle.size.body * particle.speed), yPosOnCanvas);
  //     ctx.strokeStyle = particle.color;
  //     ctx.lineWidth = particle.size.stroke;
  //     ctx.stroke();
  //   });
  // };

  const drawDrops = () => {
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'overlay';
    self.particles.forEach((particle) => {
      const xPosOnCanvas = Math.floor(particle.pos.x) + particle.size.stroke * 0.5;
      const yPosOnCanvas = Math.round(particle.pos.y - self.offset);
      ctx.beginPath();
      ctx.moveTo(xPosOnCanvas, yPosOnCanvas);
      ctx.lineTo(xPosOnCanvas, yPosOnCanvas + Math.floor(particle.size.body * particle.speed));
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = particle.size.stroke;
      ctx.stroke();
    });
  };

  const run = (ts) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    updateDrops(ts);
    drawDrops();
  };

  const adjustCanvasSize = () => {
    self.dpr = window.devicePixelRatio * 0.25;
    const width = ~~(ctx.canvas.clientWidth * self.dpr);
    const height = ~~(ctx.canvas.clientHeight * self.dpr);
    if (ctx.canvas.width != width || ctx.canvas.height != height) {
      ctx.canvas.width = width;
      ctx.canvas.height = height;
    }
  };

  const animateOnIdle = () => {
    addDrops(Math.floor(1 + Math.random() * 3));
    if (self.needReqAnim && ctx) {
      animFrame = requestAnimationFrame((ts) => { self.prevTs = ts });
      animFrame = requestAnimationFrame(self.render);
      self.needReqAnim = false;
    }
    self.kill = setTimeout(animateOnIdle, 500 + 2000 * Math.random());
    // console.log("added | kill = ", kill, Date().toString());
  };

  if (document.visibilityState === 'visible') {
    self.kill = setTimeout(animateOnIdle, 500 + 2000 * Math.random());
    // console.log("*** started | kill =", kill, Date().toString()); console.groupCollapsed('Add');
  }
}

function releaseResources() {
  observer.disconnect();
  observer = null;
  window.removeEventListener("beforeprint", bfPrint);
  window.removeEventListener("afterprint", afPrint);
  window.removeEventListener("touchstart", tcStart);
  document.removeEventListener("scroll", scrollCB);
  document.removeEventListener("visibilitychange", vsChange);
  cancelAnimationFrame(animFrame);
  animFrame = null;
  // ctx = null;
  // self = null;
}

export { animation, releaseResources };