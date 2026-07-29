/* =========================================================
   vino.made — Interactive miniature diorama (Three.js + GSAP)
   A handcrafted collectible-figurine of Vino at her cozy desk.
   Warm beige/brown · soft PBR lighting · drag to rotate ·
   click objects → cinematic zoom + info panel.
   ========================================================= */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";

const canvas = document.getElementById("diorama");
if (canvas) {
  const host = canvas.closest(".hero") || canvas.parentElement;
  const isMobile = window.matchMedia("(max-width: 860px)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const USE_DOF = !isMobile && !reduce;

  /* ---------- palette ---------- */
  const C = {
    wood: 0x9c6b43, woodDark: 0x7a4f30, woodRim: 0xc79a6b,
    skin: 0x8d5a3c, skinShade: 0x6f462e, hair: 0x1c140f,
    shirt: 0xb5623f, shirtAlt: 0x7f8b5b, pants: 0x53433a, shoe: 0x2e2620,
    desk: 0xb98a5e, metal: 0xb9c0c7, dark: 0x24201c, cream: 0xf3e7d4,
    coral: 0xe0623f, gold: 0xffc857, teal: 0x3aa88f, plant: 0x5a7d4e, sticky: 0xffd36b,
  };

  /* ---------- renderer ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.6 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0.2, 5.4, 9.2);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  /* ---------- lighting (warm, soft, realistic) ---------- */
  scene.add(new THREE.HemisphereLight(0xfff1dd, 0x6b4f3a, 0.55));
  const key = new THREE.SpotLight(0xffd9a8, 60, 40, Math.PI / 5, 0.5, 1.4); // warm desk lamp
  key.position.set(4.5, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
  key.shadow.bias = -0.0004;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xbcd0ff, 0.5); fill.position.set(-6, 4, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffcf9c, 0.6); rim.position.set(-2, 3, -6); scene.add(rim);

  /* ---------- materials ---------- */
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.0, ...o });
  const glossy = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.0, envMapIntensity: 1.1, ...o });

  /* ---------- canvas-texture helper ---------- */
  function cvTex(w, h, draw) {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const ctx = cv.getContext("2d");
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const redraw = () => { draw(ctx, w, h); tex.needsUpdate = true; };
    redraw();
    return { tex, ctx, w, h, redraw };
  }

  /* ========================================================= *
   *  BUILD THE DIORAMA
   * ========================================================= */
  const world = new THREE.Group();          // everything (for entrance)
  scene.add(world);
  const platform = new THREE.Group();        // rotates with modes
  world.add(platform);

  const interactives = [];                   // {mesh, key} for raycasting
  const register = (obj, key) => { obj.traverse((o) => { if (o.isMesh) o.userData.key = key; }); obj.userData.key = key; interactives.push(obj); return obj; };

  /* ----- circular wooden base ----- */
  const base = new THREE.Group();
  const baseTop = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.35, 64), glossy(C.wood, { roughness: 0.55 }));
  baseTop.position.y = -0.175; baseTop.receiveShadow = true; base.add(baseTop);
  const baseSkirt = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.05, 0.55, 64), mat(C.woodDark, { roughness: 0.6 }));
  baseSkirt.position.y = -0.55; baseSkirt.receiveShadow = true; base.add(baseSkirt);
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(3.12, 0.055, 16, 80), glossy(C.woodRim, { metalness: 0.2, roughness: 0.4 }));
  rimRing.rotation.x = Math.PI / 2; rimRing.position.y = 0.02; base.add(rimRing);
  platform.add(base);

  /* ----- desk ----- */
  const desk = new THREE.Mesh(new RoundedBoxGeometry(3.0, 0.22, 1.5, 4, 0.06), glossy(C.desk, { roughness: 0.5 }));
  desk.position.set(0, 0.55, 0.15); desk.castShadow = true; desk.receiveShadow = true;
  platform.add(desk);
  for (const dx of [-1.3, 1.3]) for (const dz of [-0.55, 0.55]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 12), mat(C.woodDark));
    leg.position.set(dx, 0.27, 0.15 + dz); leg.castShadow = true; platform.add(leg);
  }

  /* ========================= CHARACTER ========================= */
  const me = new THREE.Group();
  me.position.set(-0.05, 0.66, -0.35);
  platform.add(me);
  const skinMat = mat(C.skin, { roughness: 0.6 });
  const hairMat = glossy(C.hair, { roughness: 0.35 });

  // legs + shoes
  for (const lx of [-0.16, 0.16]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.42, 6, 14), mat(C.pants));
    leg.position.set(lx, 0.32, 0); leg.castShadow = true; me.add(leg);
    const shoe = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.14, 0.34, 3, 0.05), glossy(C.shoe, { roughness: 0.5 }));
    shoe.position.set(lx, 0.07, 0.06); shoe.castShadow = true; me.add(shoe);
  }
  // torso (shirt)
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.30, 0.5, 8, 18), glossy(C.shirt, { roughness: 0.65 }));
  torso.position.y = 0.95; torso.castShadow = true; me.add(torso);
  // neck + head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.12, 12), skinMat); neck.position.y = 1.32; me.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, 32, 32), skinMat);
  head.position.y = 1.6; head.scale.set(1, 1.06, 0.96); head.castShadow = true; me.add(head);
  // hair cap + ponytail
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.305, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
  hairCap.position.copy(head.position); hairCap.position.y += 0.02; me.add(hairCap);
  const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.31, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.28), hairMat);
  bangs.position.set(0, 1.7, 0.05); bangs.rotation.x = 0.3; me.add(bangs);
  const ponyPivot = new THREE.Group(); ponyPivot.position.set(0, 1.66, -0.22); me.add(ponyPivot);
  const pony = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.5, 6, 14), hairMat);
  pony.position.set(0, -0.28, -0.05); pony.rotation.x = -0.25; pony.castShadow = true; ponyPivot.add(pony);
  const ponyTie = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 10, 20), glossy(C.coral)); ponyTie.position.set(0, -0.03, -0.03); ponyTie.rotation.x = 1.2; ponyPivot.add(ponyTie);
  // face — YOUR real photo mapped onto the figurine.
  //   ↓ tweak these 3 numbers to reframe the crop on your face ↓
  const FACE_ZOOM = 0.60;   // smaller = zoom in more on the face
  const FACE_OFFX = 0.20;   // horizontal window start (0..1) — bigger = look right
  const FACE_OFFY = 0.34;   // vertical window start (0..1)   — bigger = look higher
  const faceTex = new THREE.TextureLoader().load("PROFILE.jpg");
  faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.anisotropy = 4;
  faceTex.repeat.set(FACE_ZOOM, FACE_ZOOM);
  faceTex.offset.set(FACE_OFFX, FACE_OFFY);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.85, metalness: 0 });
  const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.54), faceMat);
  facePlane.position.set(0, 1.6, 0.285);
  me.add(facePlane);

  // RIGHT arm — holding coffee (bent forward)
  const armR = new THREE.Group(); armR.position.set(-0.34, 1.14, 0); me.add(armR);
  const upperR = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.28, 6, 12), glossy(C.shirt, { roughness: 0.65 })); upperR.position.set(0, -0.16, 0.02); upperR.rotation.x = -0.9; armR.add(upperR);
  const foreR = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.24, 6, 12), skinMat); foreR.position.set(0, -0.34, 0.26); foreR.rotation.x = -1.5; armR.add(foreR);
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), skinMat); handR.position.set(0, -0.4, 0.42); armR.add(handR);

  // LEFT arm — wave-able (pivot at shoulder)
  const armL = new THREE.Group(); armL.position.set(0.34, 1.16, 0); me.add(armL);
  const upperL = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.3, 6, 12), glossy(C.shirt, { roughness: 0.65 })); upperL.position.set(0, -0.2, 0); armL.add(upperL);
  const foreL = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.26, 6, 12), skinMat); foreL.position.set(0, -0.48, 0); armL.add(foreL);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), skinMat); handL.position.set(0, -0.62, 0); armL.add(handL);
  armL.rotation.z = 0.15;

  register(me, "me");

  /* ========================= COFFEE CUP ========================= */
  const coffee = new THREE.Group();
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.2, 24), glossy(C.cream, { roughness: 0.3 }));
  const brew = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.02, 20), mat(0x3a2318)); brew.position.y = 0.09; coffee.add(brew);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 12, 20), glossy(C.cream, { roughness: 0.3 })); handle.position.set(0.12, 0, 0); handle.rotation.y = Math.PI / 2; coffee.add(handle);
  coffee.add(mug);
  coffee.position.set(-0.4, 1.2, 0.44); // in right hand
  coffee.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  me.add(coffee);
  register(coffee, "coffee");

  // steam particles above the mug
  const steam = new THREE.Group(); coffee.add(steam); steam.position.y = 0.12;
  const steamMat = new THREE.SpriteMaterial({ map: softDot(), color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
  const steamParts = [];
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Sprite(steamMat.clone()); s.scale.setScalar(0.12);
    s.userData = { t: Math.random(), sp: 0.35 + Math.random() * 0.25, sway: Math.random() * 6.28 };
    steam.add(s); steamParts.push(s);
  }

  /* ========================= LAPTOP ========================= */
  const laptop = new THREE.Group(); laptop.position.set(0.55, 0.67, 0.2); laptop.rotation.y = -0.5;
  const lapBase = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.04, 0.5, 3, 0.02), glossy(C.metal, { metalness: 0.7, roughness: 0.35 })); lapBase.castShadow = true; laptop.add(lapBase);
  const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), mat(0x3a3a3f)); kb.rotation.x = -Math.PI / 2; kb.position.y = 0.021; laptop.add(kb);
  const lidPivot = new THREE.Group(); lidPivot.position.set(0, 0.02, -0.25); laptop.add(lidPivot);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.46, 0.03, 3, 0.02), glossy(C.metal, { metalness: 0.7, roughness: 0.35 })); lid.position.set(0, 0.23, 0); lidPivot.add(lid); lid.castShadow = true;
  const codeTex = cvTex(256, 170, drawCode);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.4), new THREE.MeshBasicMaterial({ map: codeTex.tex }));
  screen.position.set(0, 0.23, 0.017); lidPivot.add(screen);
  lidPivot.rotation.x = -1.95;
  const screenGlow = new THREE.PointLight(0x8fb7ff, 2.2, 2.2, 2); screenGlow.position.set(0, 0.75, 0.15); laptop.add(screenGlow);
  laptop.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  register(laptop, "laptop");

  /* ========================= MARKETING DASHBOARD (floating) ========================= */
  const dashTex = cvTex(320, 210, (c, w, h) => drawDash(c, w, h, 0));
  const dash = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.66, 0.03, 4, 0.03), new THREE.MeshStandardMaterial({ map: dashTex.tex, emissive: 0xffffff, emissiveMap: dashTex.tex, emissiveIntensity: 0.35, roughness: 0.4 }));
  const dashGroup = new THREE.Group(); dashGroup.position.set(1.55, 1.75, -0.2); dashGroup.rotation.y = -0.5; dashGroup.add(dash);
  const dashFrame = new THREE.Mesh(new RoundedBoxGeometry(1.06, 0.72, 0.02, 4, 0.03), glossy(0xf6ecdd, { roughness: 0.5 })); dashFrame.position.z = -0.02; dashGroup.add(dashFrame);
  platform.add(dashGroup);
  register(dashGroup, "dashboard");

  /* ========================= AI CHIP (floating near laptop) ========================= */
  const chip = new THREE.Group(); chip.position.set(0.5, 1.5, 0.5);
  const chipBody = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.34, 0.06, 3, 0.02), glossy(0x2c2b33, { metalness: 0.6, roughness: 0.35 })); chip.add(chipBody);
  const chipCore = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.16, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ color: C.coral, emissive: C.coral, emissiveIntensity: 1.4, roughness: 0.4 })); chipCore.position.z = 0.03; chip.add(chipCore);
  for (let i = 0; i < 4; i++) { // pins
    const ang = i * Math.PI / 2;
    for (const s of [-1, 1]) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.08), glossy(C.gold, { metalness: 0.8, roughness: 0.3 }));
      pin.position.set(Math.cos(ang) * 0.2, Math.sin(ang) * 0.06 * s, 0);
      pin.rotation.z = ang; chip.add(pin);
    }
  }
  chip.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  platform.add(chip);
  register(chip, "chip");

  /* ========================= NOTEBOOK ========================= */
  const notebook = new THREE.Group(); notebook.position.set(-1.15, 0.67, 0.35); notebook.rotation.y = 0.4;
  const nbCover = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.05, 0.66, 3, 0.02), glossy(C.shirtAlt, { roughness: 0.6 })); nbCover.castShadow = true; notebook.add(nbCover);
  const nbPage = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.58), cvSketchMat()); nbPage.rotation.x = -Math.PI / 2; nbPage.position.y = 0.027; notebook.add(nbPage);
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.4, 10), glossy(C.coral)); pen.rotation.z = 1.2; pen.rotation.y = 0.4; pen.position.set(0.1, 0.05, 0.1); notebook.add(pen);
  register(notebook, "notebook");
  platform.add(notebook);

  /* ========================= PHONE ========================= */
  const phone = new THREE.Group(); phone.position.set(-0.75, 0.66, 0.62); phone.rotation.set(-0.1, 0.5, 0.05);
  const phoneBody = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.02, 0.5, 4, 0.03), glossy(0x1c1c22, { metalness: 0.5, roughness: 0.3 })); phoneBody.castShadow = true; phone.add(phoneBody);
  const phoneTex = cvTex(200, 380, (c, w, h) => drawPhone(c, w, h, 0));
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.44), new THREE.MeshBasicMaterial({ map: phoneTex.tex })); phoneScreen.rotation.x = -Math.PI / 2; phoneScreen.position.y = 0.012; phone.add(phoneScreen);
  register(phone, "phone");
  platform.add(phone);

  /* ========================= DECOR (non-interactive) ========================= */
  // tiny plant
  function plant(x, z, s = 1) {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.16, 16), glossy(0xc0714a, { roughness: 0.6 })); pot.position.y = 0.08; pot.castShadow = true; g.add(pot);
    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), mat(C.plant, { roughness: 0.7 }));
      leaf.scale.set(0.5, 1.4, 0.5); const a = i / 6 * 6.28;
      leaf.position.set(Math.cos(a) * 0.06, 0.22 + Math.random() * 0.06, Math.sin(a) * 0.06); leaf.rotation.z = Math.cos(a) * 0.4; leaf.rotation.x = Math.sin(a) * 0.4;
      g.add(leaf);
    }
    g.position.set(x, 0.66, z); g.scale.setScalar(s); return g;
  }
  platform.add(plant(1.25, 0.5, 1), plant(-1.5, -0.15, 0.85));

  // sticky notes on a little board behind
  const board = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.75, 0.04, 3, 0.02), mat(0xdcc19a, { roughness: 0.8 }));
  board.position.set(-1.55, 1.7, -0.35); board.rotation.y = 0.5; platform.add(board);
  const stickyCols = [0xffd36b, 0xff9e7d, 0x9fd6c0, 0xf4a9c0];
  for (let i = 0; i < 4; i++) {
    const st = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), mat(stickyCols[i], { roughness: 0.9 }));
    st.position.set(-1.55 + (i % 2 ? 0.16 : -0.16) + Math.cos(0.5) * 0, 1.82 - Math.floor(i / 2) * 0.28, -0.33);
    st.rotation.y = 0.5; st.rotation.z = (Math.random() - 0.5) * 0.2; st.position.x += (i % 2 ? 1 : -1) * 0.12; board.parent.add(st);
  }

  // headphones on desk
  const hp = new THREE.Group(); hp.position.set(1.15, 0.78, -0.35);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 12, 28, Math.PI), glossy(0x2c2620)); band.rotation.z = Math.PI; hp.add(band);
  for (const s of [-1, 1]) { const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 20), glossy(0x33291f)); cup.rotation.z = Math.PI / 2; cup.position.set(s * 0.16, -0.02, 0); hp.add(cup); }
  hp.traverse((o) => { if (o.isMesh) o.castShadow = true; }); platform.add(hp);

  // desk lamp (warm)
  const lamp = new THREE.Group(); lamp.position.set(1.05, 0.66, -0.45);
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.05, 20), glossy(0x9a8f80, { metalness: 0.5 })); lamp.add(lampBase);
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 10), glossy(0x9a8f80, { metalness: 0.5 })); arm1.position.set(0, 0.28, 0); arm1.rotation.z = 0.3; lamp.add(arm1);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.2, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0xf0c98a, emissive: 0xffca73, emissiveIntensity: 0.8, side: THREE.DoubleSide, roughness: 0.5 }));
  shade.position.set(0.18, 0.5, 0); shade.rotation.z = 1.9; lamp.add(shade);
  platform.add(lamp);

  /* ========================================================= *
   *  TEXTURE DRAW FUNCTIONS
   * ========================================================= */
  function softDot() {
    const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d");
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t;
  }
  function drawCode(c, w, h) {
    c.fillStyle = "#15131c"; c.fillRect(0, 0, w, h);
    const cols = ["#c7a4ff", "#7fd6ff", "#ffd36b", "#8fe6b0", "#ff9e7d"];
    c.font = "11px monospace";
    for (let i = 0; i < 11; i++) {
      let x = 12 + (i % 2) * 8; const y = 16 + i * 13;
      const n = 2 + Math.floor(Math.random() * 4);
      for (let j = 0; j < n; j++) { c.fillStyle = cols[(i + j) % cols.length]; const wid = 20 + Math.random() * 46; c.fillRect(x, y, wid, 6); x += wid + 8; }
    }
    c.fillStyle = "#e0623f"; c.fillRect(0, 0, w, 5);
  }
  function drawDash(c, w, h, t) {
    c.fillStyle = "#fbf4e8"; c.fillRect(0, 0, w, h);
    c.fillStyle = "#2b2420"; c.font = "bold 15px 'Plus Jakarta Sans',sans-serif"; c.fillText("Campaign Analytics", 16, 26);
    c.fillStyle = "#8c8178"; c.font = "11px sans-serif"; c.fillText("Reach ↑  ·  CTR 4.8%  ·  ROI 3.2x", 16, 44);
    // animated bars
    const bx = 16, by = 168, bw = 26, gap = 14; const n = 7;
    for (let i = 0; i < n; i++) {
      const bh = 30 + (Math.sin(t * 1.5 + i) * 0.5 + 0.5) * 90;
      c.fillStyle = i % 2 ? "#e0623f" : "#3aa88f";
      c.fillRect(bx + i * (bw + gap), by - bh, bw, bh);
    }
    // line
    c.strokeStyle = "#ffc857"; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i <= n; i++) { const x = bx + i * (bw + gap); const y = 90 + Math.sin(t * 1.2 + i * 0.7) * 26; if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
    c.stroke();
  }
  function drawPhone(c, w, h, t) {
    c.fillStyle = "#20202a"; c.fillRect(0, 0, w, h);
    c.fillStyle = "#e0623f"; c.fillRect(0, 0, w, 60); c.fillStyle = "#fff"; c.font = "bold 20px sans-serif"; c.fillText("Projects", 18, 38);
    const items = ["FinMate", "Sahaay-AI", "RoadWatch", "ContentSpark"];
    items.forEach((it, i) => {
      const y = 84 + i * 66; c.fillStyle = "#2c2c38"; roundRect(c, 14, y, w - 28, 54, 10); c.fill();
      c.fillStyle = "#8fe6b0"; c.beginPath(); c.arc(38, y + 27, 12, 0, 6.28); c.fill();
      c.fillStyle = "#fff"; c.font = "bold 15px sans-serif"; c.fillText(it, 62, y + 26); c.fillStyle = "#9a94a2"; c.font = "11px sans-serif"; c.fillText("live ↗", 62, y + 42);
    });
  }
  function drawSign(c, w, h, title, items, color) {
    c.fillStyle = "#fffaf0"; roundRect(c, 4, 4, w - 8, h - 8, 18); c.fill();
    c.fillStyle = "#" + color.toString(16).padStart(6, "0"); c.font = "bold 30px 'Fraunces',serif"; c.fillText(title, 22, 46);
    c.fillStyle = "#5b5048"; c.font = "16px 'Plus Jakarta Sans',sans-serif";
    items.forEach((it, i) => { c.fillStyle = "#" + color.toString(16).padStart(6, "0"); c.beginPath(); c.arc(30, 82 + i * 28, 5, 0, 6.28); c.fill(); c.fillStyle = "#5b5048"; c.fillText(it, 46, 87 + i * 28); });
  }
  function cvSketchMat() {
    const t = cvTex(210, 290, (c, w, h) => {
      c.fillStyle = "#fdf8ee"; c.fillRect(0, 0, w, h);
      c.strokeStyle = "#c9bca8"; c.lineWidth = 1; for (let y = 20; y < h; y += 22) { c.beginPath(); c.moveTo(10, y); c.lineTo(w - 10, y); c.stroke(); }
      c.strokeStyle = "#7f8b5b"; c.lineWidth = 3; c.beginPath(); c.moveTo(24, 60); c.bezierCurveTo(70, 20, 130, 100, 180, 50); c.stroke();
      c.strokeStyle = "#e0623f"; c.beginPath(); c.rect(30, 150, 70, 50); c.stroke(); c.beginPath(); c.rect(115, 150, 70, 90); c.stroke();
    });
    return new THREE.MeshStandardMaterial({ map: t.tex, roughness: 0.9 });
  }
  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  /* ========================================================= *
   *  INFO PANEL DATA + DOM
   * ========================================================= */
  const DATA = {
    coffee: { quote: "Fueled by curiosity and coffee." },
    laptop: { eyebrow: "💻 build", title: "Full-Stack Developer", sub: "Building AI-powered web applications", list: ["React", "Node.js", "Python", "MongoDB"], color: "#3aa88f" },
    dashboard: { eyebrow: "📈 grow", title: "Digital Marketing", list: ["SEO", "Performance Marketing", "Analytics", "Content Strategy"], color: "#e0623f" },
    chip: { eyebrow: "🤖 ai", title: "AI & Automation", list: ["Prompt Engineering", "AI Automation", "LLMs", "Generative AI", "Agentic Workflows"], color: "#a879ff" },
    notebook: { eyebrow: "📓 ideas", title: "Ideas & Research", list: ["Hackathons", "Product Ideas", "Startup Concepts", "Research"], color: "#7f8b5b" },
    phone: { eyebrow: "🚀 ship", title: "Projects", list: ["Projects", "Live Websites", "Case Studies"], color: "#ffb037" },
  };
  const panel = document.getElementById("dioPanel");
  const panelBody = document.getElementById("dioPanelBody");
  const bubble = document.getElementById("dioBubble");
  const loading = document.getElementById("dioLoading");
  const hint = document.getElementById("dioHint");

  function showPanel(key) {
    const d = DATA[key]; if (!d) return;
    hideBubble();
    let html = "";
    if (d.eyebrow) html += `<span class="dp-eyebrow">${d.eyebrow}</span>`;
    if (d.quote) html += `<p class="dp-quote">"${d.quote}"</p>`;
    if (d.title) html += `<h3 class="dp-title">${d.title}</h3>`;
    if (d.sub) html += `<p class="dp-sub">${d.sub}</p>`;
    if (d.list) html += `<ul class="dp-list" style="--accent:${d.color || "#e0623f"}">` + d.list.map((i) => `<li>${i}</li>`).join("") + `</ul>`;
    panelBody.innerHTML = html;
    panel.classList.add("open"); panel.setAttribute("aria-hidden", "false");
  }
  function hidePanel() { panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); }
  function showBubble() {
    bubble.innerHTML = `<b>Hi, I'm Vino 👋</b><br>I build products, market ideas, and ship experiences that people love.`;
    bubble.classList.add("open"); bubble.setAttribute("aria-hidden", "false");
  }
  function hideBubble() { bubble.classList.remove("open"); bubble.setAttribute("aria-hidden", "true"); }
  document.getElementById("dioClose").addEventListener("click", () => { hidePanel(); resetCamera(); });

  /* ========================================================= *
   *  CAMERA + CONTROLS
   * ========================================================= */
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 1.1, 0);
  controls.enablePan = false;
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 6.5; controls.maxDistance = 12;
  controls.minPolarAngle = 0.5; controls.maxPolarAngle = 1.35;
  controls.rotateSpeed = 0.85;
  controls.update();
  const HOME = { pos: camera.position.clone(), tgt: controls.target.clone() };

  canvas.addEventListener("pointerdown", () => canvas.classList.add("grabbing"));
  window.addEventListener("pointerup", () => canvas.classList.remove("grabbing"));

  function focusObject(obj, key) {
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    const dist = Math.max(2.4, size * 1.9);
    const camTo = center.clone().add(dir.multiplyScalar(dist));
    controls.enabled = false;
    gsap.to(controls.target, { x: center.x, y: center.y, z: center.z, duration: 1.1, ease: "power3.inOut", onUpdate: () => controls.update() });
    gsap.to(camera.position, { x: camTo.x, y: camTo.y, z: camTo.z, duration: 1.1, ease: "power3.inOut",
      onUpdate: () => controls.update(),
      onComplete: () => { if (key) showPanel(key); } });
  }
  function focusCharacter() {
    hidePanel();
    const center = new THREE.Vector3(); new THREE.Box3().setFromObject(head).getCenter(center);
    me.getWorldPosition(new THREE.Vector3());
    const wp = head.getWorldPosition(new THREE.Vector3());
    const camTo = new THREE.Vector3(wp.x + 0.4, wp.y + 0.2, wp.z + 4.2);
    controls.enabled = false;
    gsap.to(controls.target, { x: wp.x, y: wp.y - 0.2, z: wp.z, duration: 1.2, ease: "power3.inOut", onUpdate: () => controls.update() });
    gsap.to(camera.position, { x: camTo.x, y: camTo.y, z: camTo.z, duration: 1.2, ease: "power3.inOut", onUpdate: () => controls.update(), onComplete: () => { waveHello(); showBubble(); } });
  }
  function resetCamera() {
    hideBubble();
    controls.enabled = false;
    gsap.to(controls.target, { x: HOME.tgt.x, y: HOME.tgt.y, z: HOME.tgt.z, duration: 1, ease: "power3.inOut", onUpdate: () => controls.update() });
    gsap.to(camera.position, { x: HOME.pos.x, y: HOME.pos.y, z: HOME.pos.z, duration: 1, ease: "power3.inOut", onUpdate: () => controls.update(), onComplete: () => { controls.enabled = true; } });
  }

  /* wave animation */
  let waving = false;
  function waveHello() {
    if (waving) return; waving = true;
    const tl = gsap.timeline({ onComplete: () => { waving = false; } });
    tl.to(armL.rotation, { z: 2.4, x: -0.3, duration: 0.4, ease: "power2.out" })
      .to(armL.rotation, { z: 2.1, duration: 0.22, yoyo: true, repeat: 3, ease: "sine.inOut" })
      .to(armL.rotation, { z: 0.15, x: 0, duration: 0.5, ease: "power2.inOut" });
  }

  /* ========================================================= *
   *  RAYCAST — hover highlight + click
   * ========================================================= */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let hovered = null;
  const down = { x: 0, y: 0, t: 0 };

  function setPointer(e) { const r = canvas.getBoundingClientRect(); ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1; ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1; }
  function pick() { ray.setFromCamera(ptr, camera); const hits = ray.intersectObjects(interactives, true); if (!hits.length) return null; let o = hits[0].object; while (o && o.userData.key === undefined) o = o.parent; return o; }

  function setHover(obj) {
    if (hovered === obj) return;
    if (hovered) gsap.to(hovered.scale, { x: hovered.userData._s || 1, y: hovered.userData._s || 1, z: hovered.userData._s || 1, duration: 0.3, ease: "power2.out" });
    hovered = obj;
    if (hovered) { hovered.userData._s = hovered.userData._s || hovered.scale.x; gsap.to(hovered.scale, { x: hovered.userData._s * 1.08, y: hovered.userData._s * 1.08, z: hovered.userData._s * 1.08, duration: 0.3, ease: "back.out(2)" }); }
    canvas.style.cursor = hovered ? "pointer" : "grab";
  }

  canvas.addEventListener("pointermove", (e) => { if (canvas.classList.contains("grabbing")) { setHover(null); return; } setPointer(e); setHover(pick()); });
  canvas.addEventListener("pointerdown", (e) => { down.x = e.clientX; down.y = e.clientY; down.t = performance.now(); });
  canvas.addEventListener("pointerup", (e) => {
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    if (moved > 6 || performance.now() - down.t > 400) return; // was a drag
    setPointer(e); const obj = pick(); if (!obj) return;
    const key = obj.userData.key;
    if (key === "me") focusCharacter();
    else focusObject(obj, key);
  });

  /* ========================================================= *
   *  POST-PROCESSING (subtle DOF)
   * ========================================================= */
  let composer = null, bokeh = null;
  if (USE_DOF) {
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bokeh = new BokehPass(scene, camera, { focus: 9.0, aperture: 0.00035, maxblur: 0.006 });
      composer.addPass(bokeh);
      composer.addPass(new OutputPass());
    } catch (err) { console.warn("DOF disabled:", err); composer = null; }
  }

  /* ========================================================= *
   *  RESIZE + ENTRANCE + LOOP
   * ========================================================= */
  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); if (composer) composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize); resize();

  // entrance: rise + fade in, hide loader
  world.scale.setScalar(0.9); world.position.y = -0.4;
  gsap.to(world.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: "power3.out" });
  gsap.to(world.position, { y: 0, duration: 1.4, ease: "power3.out" });
  setTimeout(() => loading && loading.classList.add("gone"), 500);

  const clock = new THREE.Clock();
  let running = true, dashTick = 0, elapsed = 0;

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, clock.getDelta());
    elapsed += dt; const t = elapsed;

    if (!reduce) {
      // breathing
      const br = 1 + Math.sin(t * 1.6) * 0.012; torso.scale.set(1, br, 1); head.position.y = 1.6 + Math.sin(t * 1.6) * 0.006;
      // hair sway
      ponyPivot.rotation.z = Math.sin(t * 1.3) * 0.12; ponyPivot.rotation.x = Math.sin(t * 0.9) * 0.06;
      // idle body sway
      me.rotation.z = Math.sin(t * 0.8) * 0.01;
      // chip float + spin
      chip.position.y = 1.5 + Math.sin(t * 1.4) * 0.06; chip.rotation.y += dt * 0.8; chip.rotation.x = Math.sin(t) * 0.15;
      // dashboard float
      dashGroup.position.y = 1.75 + Math.sin(t * 1.1 + 1) * 0.05;
      // screen glow flicker
      screenGlow.intensity = 2.0 + Math.sin(t * 8) * 0.15 + Math.sin(t * 3) * 0.1;
      // steam
      steamParts.forEach((s) => {
        s.userData.t += dt * s.userData.sp;
        const p = s.userData.t % 1;
        s.position.y = p * 0.6; s.position.x = Math.sin(p * 6 + s.userData.sway) * 0.05;
        s.material.opacity = Math.sin(p * Math.PI) * 0.5; s.scale.setScalar(0.08 + p * 0.14);
      });
      // animated dashboard chart (throttled)
      dashTick += dt; if (dashTick > 0.07) { dashTick = 0; dashTex.redraw && drawDash(dashTex.ctx, dashTex.w, dashTex.h, t); dashTex.tex.needsUpdate = true; }
    }

    controls.update();
    if (bokeh) bokeh.uniforms["focus"].value = camera.position.distanceTo(controls.target);
    if (composer) composer.render(); else renderer.render(scene, camera);
  }
  loop();

  // pause offscreen for performance
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { if (!running) { running = true; clock.start(); loop(); } }
    else running = false;
  }), { threshold: 0 });
  io.observe(host);
}
