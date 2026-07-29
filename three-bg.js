/* =========================================================
   vino.made — elegant 3D space hero (Three.js)
   starfield · glossy floating objects · bloom glow
   drag to rotate · mouse parallax · smooth entrance
   ========================================================= */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.getElementById("hero3d");
if (canvas) {
  const host = canvas.closest(".hero") || canvas.parentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 13);

  // reflections for glossy materials
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // colored rim lights (elegant space palette + brand coral)
  scene.add(new THREE.AmbientLight(0x8899ff, 0.5));
  const l1 = new THREE.PointLight(0x8b7bff, 90, 60); l1.position.set(-8, 5, 6); scene.add(l1); // violet
  const l2 = new THREE.PointLight(0x53d6ff, 70, 60); l2.position.set(9, -3, 5); scene.add(l2);  // cyan
  const l3 = new THREE.PointLight(0xff7a66, 60, 60); l3.position.set(3, 7, -3); scene.add(l3);  // coral

  /* ---------- starfield ---------- */
  const STAR_COUNT = window.innerWidth < 700 ? 900 : 1800;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 30 + Math.random() * 40;
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    starPos[i * 3 + 2] = r * Math.cos(ph);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0xbcc6ff, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false,
  }));
  scene.add(stars);

  /* ---------- floating objects cluster (right side) ---------- */
  const cluster = new THREE.Group();
  cluster.position.x = 3.2;
  scene.add(cluster);

  const ACCENTS = [0x8b7bff, 0x53d6ff, 0xff7a66, 0x6f7bff, 0xc9a0ff];
  function metalMat(color, emissive = 0) {
    return new THREE.MeshStandardMaterial({
      color, metalness: 1, roughness: 0.18,
      emissive: emissive, emissiveIntensity: emissive ? 0.6 : 0, envMapIntensity: 1.3,
    });
  }
  const defs = [
    { geo: new THREE.TorusKnotGeometry(1.05, 0.32, 160, 24), mat: metalMat(0x9a8cff, 0x3a2f7a), pos: [0, 0.2, 0], scale: 1, spin: [0.05, 0.12, 0] },
    { geo: new THREE.IcosahedronGeometry(0.85, 0), mat: metalMat(0x53d6ff), pos: [-2.6, 1.7, -0.6], scale: 1, spin: [0.1, 0.15, 0] },
    { geo: new THREE.OctahedronGeometry(0.8, 0), mat: metalMat(0x6f7bff), pos: [2.5, 1.5, -0.4], scale: 1, spin: [0.14, 0.08, 0] },
    { geo: new THREE.IcosahedronGeometry(0.55, 0), mat: metalMat(0xff7a66, 0x5a1f16), pos: [2.9, -1.4, 0.5], scale: 1, spin: [0.12, 0.12, 0] },
    { geo: new THREE.TorusGeometry(0.62, 0.2, 20, 48), mat: metalMat(0xd7dcff), pos: [-2.4, -1.5, 0.3], scale: 1, spin: [0.2, 0.1, 0] },
    { geo: new THREE.SphereGeometry(0.42, 32, 32), mat: metalMat(0xc9a0ff, 0x2a1f4a), pos: [-0.4, 2.6, -1], scale: 1, spin: [0, 0.1, 0] },
    { geo: new THREE.DodecahedronGeometry(0.5, 0), mat: metalMat(0x53d6ff), pos: [0.6, -2.5, -0.6], scale: 1, spin: [0.1, 0.14, 0] },
  ];
  const objs = [];
  defs.forEach((d, i) => {
    const m = new THREE.Mesh(d.geo, d.mat);
    m.position.set(...d.pos);
    m.userData = {
      spin: d.spin, base: d.pos.slice(),
      amp: 0.18 + Math.random() * 0.22, sp: 0.5 + Math.random() * 0.5, ph: Math.random() * 6.28,
      delay: i * 0.09, target: d.scale,
    };
    m.scale.setScalar(0.001);
    cluster.add(m);
    objs.push(m);
  });

  /* ---------- postprocessing (bloom) ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.75, 0.5, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    // move cluster toward center on small screens
    cluster.position.x = w < 760 ? 0 : 3.2;
    cluster.position.y = w < 760 ? -0.5 : 0;
    camera.position.z = w < 760 ? 15 : 13;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- interaction: drag to rotate + parallax + inertia ---------- */
  const rot = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
  let dragging = false, lastX = 0, lastY = 0;
  const mouse = { x: 0, y: 0 };

  canvas.style.pointerEvents = "auto"; // allow drag on the canvas
  canvas.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointerup", (e) => { dragging = false; try { canvas.releasePointerCapture(e.pointerId); } catch {} });
  canvas.addEventListener("pointerleave", () => { dragging = false; });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      rot.vy += dx * 0.0006; rot.vx += dy * 0.0006;
      lastX = e.clientX; lastY = e.clientY;
    }
  });
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---------- entrance + loop ---------- */
  const clock = new THREE.Clock();
  let running = true, started = 0;

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    const t = clock.getElapsedTime();
    if (!started) started = t;
    const since = t - started;

    // entrance: objects scale in with stagger + camera dolly
    objs.forEach((m) => {
      const p = Math.max(0, Math.min(1, (since - m.userData.delay) / 0.9));
      const e = 1 - Math.pow(1 - p, 3);                 // easeOutCubic
      const s = m.userData.target * (0.4 + 0.6 * e) * (reduce ? 1 : 1);
      m.scale.setScalar(reduce ? m.userData.target : s);
      // float + self-spin
      const u = m.userData;
      if (!reduce) {
        m.rotation.x += u.spin[0] * 0.01;
        m.rotation.y += u.spin[1] * 0.01;
        m.position.y = u.base[1] + Math.sin(t * u.sp + u.ph) * u.amp;
      }
    });
    if (!reduce) {
      const dz = 13 - Math.min(1, since / 1.6) * 0; // (camera stays; entrance handled by scale)
    }

    // rotation: drag velocity + inertia + subtle auto-rotate + mouse parallax
    rot.vy *= 0.94; rot.vx *= 0.94;
    rot.y += rot.vy + (reduce ? 0 : 0.0016);
    rot.x += rot.vx;
    rot.x = Math.max(-0.6, Math.min(0.6, rot.x));
    const pyaw = mouse.x * 0.18, ppit = mouse.y * 0.12;
    cluster.rotation.y = rot.y + pyaw;
    cluster.rotation.x = rot.x + ppit;
    stars.rotation.y = t * 0.005;

    composer.render();
  }

  if (reduce) { composer.render(); }
  else { frame(); }

  // pause when hero off-screen
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting && !reduce) { if (!running) { running = true; clock.start(); frame(); } }
      else { running = false; }
    });
  }, { threshold: 0 });
  io.observe(host);
}
