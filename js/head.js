/* The 3D head: a chibi Keyu with round glasses. It follows the pointer in the hero,
   then the camera travels into his left eye as you scroll, where the pupil holds a film. */
(function () {
const RoomEnvironment = THREE.RoomEnvironment;

const ss = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function irisTexture(img, bright) {
  // a page opened from disk can't read images into WebGL, so draw the iris without the film there
  if (img && location.protocol === "file:") img = null;
  const c = document.createElement("canvas"); c.width = c.height = 1024;
  const g = c.getContext("2d"); const R = 512;
  const gr = g.createRadialGradient(R, R, 60, R, R, R);
  gr.addColorStop(0, "#2a140c"); gr.addColorStop(0.6, "#4a2614"); gr.addColorStop(0.9, "#1b0d07"); gr.addColorStop(1, "#050202");
  g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
  g.strokeStyle = "rgba(180,110,60,.25)"; g.lineWidth = 2;
  for (let a = 0; a < 360; a += 2) {
    const t = (a * Math.PI) / 180, r1 = 440 + ((a * 37) % 40);
    g.beginPath(); g.moveTo(R + Math.cos(t) * 230, R + Math.sin(t) * 230); g.lineTo(R + Math.cos(t) * r1, R + Math.sin(t) * r1); g.stroke();
  }
  // the pupil is a window into the work
  const pr = bright ? 370 : 200;
  g.save(); g.beginPath(); g.arc(R, R, pr, 0, Math.PI * 2); g.clip();
  g.fillStyle = "#000"; g.fillRect(0, 0, 1024, 1024);
  if (img) {
    g.globalAlpha = bright ? 1 : 0.38;
    const s = Math.max((pr * 2) / img.width, (pr * 2) / img.height) * 1.05;
    g.drawImage(img, R - (img.width * s) / 2, R - img.height * s * 0.45, img.width * s, img.height * s);
  }
  g.restore();
  g.globalAlpha = 1; g.strokeStyle = "rgba(0,0,0,.7)"; g.lineWidth = bright ? 18 : 10;
  g.beginPath(); g.arc(R, R, pr, 0, Math.PI * 2); g.stroke();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

function buildHead(img) {
  const skin = new THREE.MeshPhysicalMaterial({ color: 0xe8b48e, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.6, sheenColor: new THREE.Color(0xffc9a8) });
  const hairM = new THREE.MeshPhysicalMaterial({ color: 0x151215, roughness: 0.48, clearcoat: 0.35, clearcoatRoughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color(0x46506a) });
  const blackM = new THREE.MeshPhysicalMaterial({ color: 0x0c0a0c, roughness: 0.18, clearcoat: 1, metalness: 0.2 });
  const head = new THREE.Group();

  const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), skin); skull.scale.set(1, 0.96, 0.93); head.add(skull);
  const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.78, 64, 64), skin); cheek.position.set(0, -0.3, 0.18); cheek.scale.set(1.12, 0.85, 0.95); head.add(cheek);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), skin); ear.position.set(s * 0.97, -0.12, 0.02); ear.scale.set(0.55, 1, 0.8); head.add(ear);
    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff6f7f, transparent: true, opacity: 0.28 }));
    blush.position.set(s * 0.52, -0.36, 0.78); blush.scale.set(1.2, 0.6, 0.3); head.add(blush);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 32, 32), skin); nose.position.set(0, -0.2, 0.99); head.add(nose);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 12, 48, Math.PI), new THREE.MeshStandardMaterial({ color: 0x5a2a22, roughness: 0.6 }));
  mouth.rotation.z = Math.PI; mouth.position.set(0, -0.43, 0.9); mouth.rotation.x = -0.25; head.add(mouth);

  // eyes: the iris shows the film faintly; the emissive map brightens it as the camera dives in
  const dimTex = irisTexture(img, false), brightTex = irisTexture(img, true);
  const irisMats = [], eyes = [], highlights = [], rims = [];
  const rod = (a, b, r) => {
    const d = b.clone().sub(a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 12), blackM);
    m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return m;
  };
  for (const s of [-1, 1]) {
    const p = new THREE.Vector3(s * 0.35, -0.04, 0.85), n = p.clone().normalize();
    const eye = new THREE.Group(); eye.position.copy(p); eye.lookAt(p.clone().add(n)); head.add(eye);
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.2, 64, 64), new THREE.MeshPhysicalMaterial({ color: 0xfbf6ef, roughness: 0.15, clearcoat: 1 }));
    sclera.scale.set(1, 1.1, 0.5); eye.add(sclera);
    const irisMat = new THREE.MeshPhysicalMaterial({ map: dimTex, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0xffffff, emissiveMap: brightTex, emissiveIntensity: 0 });
    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.17, 96), irisMat); iris.position.z = 0.106; iris.scale.set(1, 1.06, 1); eye.add(iris);
    irisMats.push(irisMat);
    for (const [x, y, r] of [[-0.06, 0.07, 0.04], [0.06, -0.06, 0.018]]) {
      const h = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      h.position.set(x, y, 0.11); h.scale.set(1, 1, 0.3); eye.add(h); highlights.push(h);
    }
    eyes.push(eye);
    // round glasses
    const c = p.clone().add(n.clone().multiplyScalar(0.13));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.017, 16, 96), blackM); rim.position.copy(c); rim.lookAt(c.clone().add(new THREE.Vector3(s * 0.12, 0, 1))); head.add(rim);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.24, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, roughness: 0, clearcoat: 1 }));
    lens.position.copy(c); lens.quaternion.copy(rim.quaternion); head.add(lens);
    const hinge = new THREE.Vector3(1, 0, 0).applyQuaternion(rim.quaternion).multiplyScalar(s * 0.245).add(c);
    head.add(rod(hinge, new THREE.Vector3(s * 1.0, 0, 0.05), 0.014));
    rims.push(c);
  }
  {
    const a = rims[0].clone().add(new THREE.Vector3(0.235, 0.03, 0)), b = rims[1].clone().add(new THREE.Vector3(-0.235, 0.03, 0));
    const mid = a.clone().add(b).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.05, 0.03));
    head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 24, 0.014, 10), blackM));
  }

  // hair: one sculpted shell whose radius rises above a hairline that depends on the angle around the head
  const HL = [[0, 0.27], [0.45, 0.25], [0.9, 0.2], [1.08, -0.2], [1.22, 0.1], [1.85, 0.1], [2.15, -0.55], [Math.PI, -0.7]];
  const hairline = (phi) => {
    const a = Math.abs(phi); let y = HL[HL.length - 1][1];
    for (let i = 0; i < HL.length - 1; i++) {
      const [a0, y0] = HL[i], [a1, y1] = HL[i + 1];
      if (a >= a0 && a <= a1) { const t = (a - a0) / (a1 - a0); y = y0 + (y1 - y0) * t * t * (3 - 2 * t); break; }
    }
    if (a < 1.0) { const f = 1 - a; y += 0.045 * Math.sin(phi * 1.4 + 0.5) * f + 0.028 * Math.max(0, Math.cos(phi * 19)) * f; } // swoop and strand tips
    return y;
  };
  const hg = new THREE.SphereGeometry(1, 320, 240), pos = hg.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i); const phi = Math.atan2(v.x, v.z);
    const t = ss(hairline(phi) - 0.05, hairline(phi) + 0.008, v.y);
    v.multiplyScalar(0.95 + t * (0.11 + 0.06 * Math.max(0, v.y) + 0.006 * Math.sin(phi * 46 + v.y * 6)));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  hg.computeVertexNormals();
  const hair = new THREE.Mesh(hg, hairM); hair.scale.set(1.02, 0.97, 0.95); head.add(hair);
  const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 16), hairM); tuft.position.set(0.1, 1.06, -0.12); tuft.rotation.set(-0.5, 0, -0.7); head.add(tuft);
  for (const s of [-1, 1]) {
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.12, 6, 12), new THREE.MeshStandardMaterial({ color: 0x1a1416, roughness: 0.6 }));
    brow.position.set(s * 0.34, 0.25, 0.93); brow.rotation.set(-0.3, 0, Math.PI / 2 + s * 0.12); head.add(brow);
  }
  return { head, eyes, irisMats, highlights, dimTex, brightTex };
}

/* initHead(canvas, img) → { resize, frame(state) }
   state: { px, py } pointer in 0..1 viewport units, { cx, cy, size } where the head sits on screen (px),
          zoom 0..1 (scroll progress into the eye) */
function initHead(canvas, img) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  const key = new THREE.DirectionalLight(0xfff1e0, 2.3); key.position.set(-3, 4, 5); scene.add(key);
  const rimR = new THREE.DirectionalLight(0xa9c6ff, 3.2); rimR.position.set(3.5, 1.2, -3); scene.add(rimR);
  const rimL = new THREE.DirectionalLight(0xa9c6ff, 1.8); rimL.position.set(-3.5, -0.5, -2.5); scene.add(rimL);
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  const { head, eyes, irisMats, highlights, dimTex: dimMap, brightTex: brightMap } = buildHead(img);
  const pivot = new THREE.Group(); pivot.add(head); scene.add(pivot);

  let W = 1, H = 1;
  const resize = () => {
    W = canvas.clientWidth; H = canvas.clientHeight;
    renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
  };
  resize();

  let yaw = 0, pitch = 0;
  const tmp = new THREE.Vector3(), fwd = new THREE.Vector3(), q = new THREE.Quaternion();
  const frame = (st) => {
    const t = ss(0, 1, st.zoom);
    // distance so the head is st.size px tall, and a world offset so it sits at (cx, cy)
    const tan = Math.tan((cam.fov * Math.PI) / 360);
    const d = (2 * H) / st.size / (2 * tan);
    const visH = 2 * d * tan, visW = visH * cam.aspect;
    const ox = ((st.cx - W / 2) / W) * visW, oy = (-(st.cy - H / 2) / H) * visH;
    pivot.position.set(ox * (1 - t), oy * (1 - t), 0);

    // look at the pointer (relative to the head's own position on screen)
    const ty = ((st.px * W - st.cx) / W) * 1.6, tp = ((st.py * H - st.cy) / H) * 1.3;
    const idle = st.time * 0.0006;
    const wantYaw = (Math.max(-0.75, Math.min(0.75, ty)) + Math.sin(idle) * 0.03) * (1 - t);
    const wantPitch = (Math.max(-0.45, Math.min(0.45, tp)) + Math.sin(idle * 1.3) * 0.02) * (1 - t);
    yaw = lerp(yaw, wantYaw, 0.08); pitch = lerp(pitch, wantPitch, 0.08);
    head.rotation.set(pitch, yaw, -yaw * 0.08);

    // camera: from the hero framing into the left eye
    const heroPos = tmp.set(0, 0.05, d);
    head.updateWorldMatrix(true, true);
    const eye = eyes[0]; const ep = new THREE.Vector3(); eye.getWorldPosition(ep);
    fwd.set(0, 0, 1).applyQuaternion(eye.getWorldQuaternion(q));
    const into = ep.clone().addScaledVector(fwd, lerp(0.95, 0.4, ss(0.3, 1, t)));
    const k = ss(0, 0.85, t);
    cam.position.set(lerp(heroPos.x, into.x, k), lerp(heroPos.y, into.y, k), lerp(heroPos.z, into.z, k));
    const look = new THREE.Vector3(lerp(pivot.position.x, ep.x, k), lerp(pivot.position.y - 0.05, ep.y, k), lerp(0, ep.z, k));
    cam.lookAt(look);
    for (const m of irisMats) { m.emissiveIntensity = ss(0.25, 0.8, t) * 0.8; m.map = t > 0.35 ? brightMap : dimMap; }
    for (const h of highlights) h.visible = t < 0.3;
    renderer.render(scene, cam);
  };
  return { resize, frame };
}
window.initKeyuHead = initHead;
})();
