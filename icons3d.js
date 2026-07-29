/* =========================================================
   vino.made — glossy 3D skill objects (Three.js)
   Varied, environment-lit shapes (sphere, torus-knot, diamond,
   coin…) that float BESIDE the caricature. Positions follow
   invisible DOM anchors (.orb-ic) so it stays responsive.
   ========================================================= */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.getElementById("iconfx");
const hero = document.querySelector(".hero--diorama");
const anchors = Array.from(document.querySelectorAll(".orb-ic"));

if (canvas && hero && anchors.length) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
  camera.position.z = 200;

  // studio reflections for the glossy look
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(60, 90, 120); scene.add(key);
  const warm = new THREE.PointLight(0xffd9a8, 0.8, 800); warm.position.set(-120, -40, 120); scene.add(warm);

  let W = 1, H = 1;
  function resize() {
    const r = hero.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    camera.left = -W / 2; camera.right = W / 2; camera.top = H / 2; camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // one shape per skill (identity comes from the HTML label)
  const S = 34; // base size in px
  function shapeFor(kind) {
    switch (kind) {
      case "react":     return new THREE.TorusKnotGeometry(S * 0.62, S * 0.2, 160, 20);
      case "node":      return new THREE.IcosahedronGeometry(S, 0);
      case "python":    return new THREE.SphereGeometry(S * 0.92, 48, 48);
      case "ai":        return new THREE.OctahedronGeometry(S * 1.02, 0);
      case "code":      return new THREE.DodecahedronGeometry(S * 0.92, 0);
      case "analytics": return new THREE.CylinderGeometry(S * 0.9, S * 0.9, S * 0.42, 44);
      default:          return new THREE.SphereGeometry(S, 32, 32);
    }
  }
  const COLOR = { react: 0x61dafb, node: 0x66bb4a, python: 0x4b8bbe, ai: 0xff6f5e, code: 0x8b7bff, analytics: 0x8aa67e };

  const coins = anchors.map((a, i) => {
    const kind = a.dataset.ic;
    const mat = new THREE.MeshStandardMaterial({
      color: COLOR[kind] || 0xff6f5e, metalness: 0.55, roughness: 0.22, envMapIntensity: 1.4,
    });
    const mesh = new THREE.Mesh(shapeFor(kind), mat);
    scene.add(mesh);
    return { mesh, anchor: a, base: mesh.scale.x, sx: 0.25 + (i % 3) * 0.1, sy: 0.4 + (i % 2) * 0.15, wob: i * 1.3 };
  });

  // subtle mouse parallax on the whole cluster
  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5);
    mouse.y = (e.clientY / window.innerHeight - 0.5);
  });

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const t = clock.getElapsedTime();
    const cr = canvas.getBoundingClientRect();
    for (const o of coins) {
      const ar = o.anchor.getBoundingClientRect();
      if (ar.width < 1) { o.mesh.visible = false; continue; }
      o.mesh.visible = true;
      const cx = ar.left + ar.width / 2 - cr.left;
      const cy = ar.top + ar.height / 2 - cr.top;
      o.mesh.position.set(cx - W / 2 + mouse.x * 14, -(cy - H / 2) - mouse.y * 14, 0);
      if (!reduce) {
        o.mesh.rotation.x += 0.008 * (o.sx + 0.4);
        o.mesh.rotation.y += 0.01 * (o.sy + 0.4);
      }
    }
    renderer.render(scene, camera);
  }
  frame();
}
