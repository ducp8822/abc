/**
 * Trung Thu Của Đặng Bảo Chi ❤️ - Cung Trăng Tình Yêu
 * Interactive 3D Mid-Autumn Romantic Experience for Đặng Bảo Chi
 */

// 1. CẤU HÌNH & KHỞI TẠO MÔI TRƯỜNG
const container = document.getElementById("webgl-container");
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

// 2. KHỞI TẠO SCENE, CAMERA & RENDERER THREE.JS
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x060312, 0.0065);

const camera = new THREE.PerspectiveCamera(
  isMobile ? 58 : 45,
  window.innerWidth / window.innerHeight,
  0.1,
  1200
);

const INTRO_CAM_POS = isMobile
  ? new THREE.Vector3(0, 22, 54)
  : new THREE.Vector3(0, 18, 48);

const DEFAULT_CAM_POS = isMobile
  ? new THREE.Vector3(0, 12, 44)
  : new THREE.Vector3(0, 9.5, 38);
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 5.8, 0);

camera.position.copy(INTRO_CAM_POS);

const renderer = new THREE.WebGLRenderer({
  antialias: !isMobile,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.32;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// ORBIT CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 + 0.04;
controls.minDistance = 7;
controls.maxDistance = 90;
controls.target.copy(DEFAULT_CAM_TARGET);
controls.autoRotate = false;
controls.autoRotateSpeed = 0.75;

// ==========================================
// 3. ÂM THANH CHIME & LỜI NHẮN (Web Audio API)
// ==========================================
function playTone(freq, type = "sine", duration = 0.6, gainLevel = 0.12) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!window._audioCtx) window._audioCtx = new AudioContext();
    const ctx = window._audioCtx;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { }
}

function playSparkleSound() {
  const freqs = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
  freqs.forEach((f, i) => {
    setTimeout(() => playTone(f, "triangle", 0.8, 0.08), i * 75);
  });
}

function playLoveChime() {
  const chords = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
  chords.forEach((f, i) => {
    setTimeout(() => playTone(f, "sine", 0.9, 0.1), i * 85);
  });
}

function playCuteBunnyChime() {
  const notes = [659.25, 783.99, 987.77, 1318.51]; // E, G, B, High E
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, "triangle", 0.45, 0.09), i * 65);
  });
}

// ==========================================
// 5. CÁC HÀM TẠO TEXTURE PROCEDURAL
// ==========================================
function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 64, 64);
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,230,210,0.85)");
  grad.addColorStop(0.65, "rgba(255,160,185,0.35)");
  grad.addColorStop(0.92, "rgba(255,160,185,0)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function createGlowTexture(colorInner = "#fff8db", colorOuter = "rgba(255,190,70,0)") {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 128, 128);
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  grad.addColorStop(0, colorInner);
  grad.addColorStop(0.35, "rgba(255, 195, 75, 0.55)");
  grad.addColorStop(0.7, "rgba(255, 140, 40, 0.18)");
  grad.addColorStop(0.92, colorOuter);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

const particleMap = createParticleTexture();
const goldGlowMap = createGlowTexture("#fff9e6");
const heartGlowMap = createGlowTexture("#ff9ebb", "rgba(255,51,102,0)");
const fireflyGlowMap = createGlowTexture("#d4ff80", "rgba(180,255,50,0)");

// ==========================================
// 6. HỆ THỐNG ÁNH SÁNG
// ==========================================
const ambientLight = new THREE.AmbientLight(0x2d123d, 1.45);
scene.add(ambientLight);

const mainDirLight = new THREE.DirectionalLight(0xfff0d0, 1.35);
mainDirLight.position.set(6, 22, 14);
scene.add(mainDirLight);

const treeLight = new THREE.PointLight(0xffb2ca, 2.6, 48);
treeLight.position.set(0, 8.5, 0);
scene.add(treeLight);

const islandUnderLight = new THREE.PointLight(0xff9922, 2.2, 32);
islandUnderLight.position.set(0, -1.8, 0);
scene.add(islandUnderLight);

// ==========================================
// 7. VẦNG TRĂNG RẰM CUNG TRĂNG (FULL MOON)
// ==========================================
function createFullMoon() {
  const moonGroup = new THREE.Group();
  moonGroup.position.set(-18, 22, -38);

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
  grad.addColorStop(0, "#fffef4");
  grad.addColorStop(0.65, "#fcedb6");
  grad.addColorStop(0.88, "#f0da8e");
  grad.addColorStop(1, "#d6ba68");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 254, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(168, 142, 85, 0.24)";
  const craters = [
    { x: 195, y: 220, r: 75 },
    { x: 310, y: 195, r: 85 },
    { x: 330, y: 310, r: 65 },
    { x: 235, y: 320, r: 60 },
    { x: 175, y: 145, r: 42 },
    { x: 270, y: 260, r: 48 },
    { x: 380, y: 240, r: 38 },
    { x: 200, y: 380, r: 45 },
  ];
  craters.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const rimGrad = ctx.createRadialGradient(256, 256, 220, 256, 256, 256);
  rimGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.65)");
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(256, 256, 254, 0, Math.PI * 2);
  ctx.fill();

  const moonTex = new THREE.CanvasTexture(canvas);
  const moonGeo = new THREE.SphereGeometry(7.2, 32, 32);
  const moonMat = new THREE.MeshBasicMaterial({
    map: moonTex,
    color: 0xfff9e6,
    fog: false,
  });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonGroup.add(moonMesh);

  const haloMat = new THREE.SpriteMaterial({
    map: goldGlowMap,
    color: 0xffeaab,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const moonHalo = new THREE.Sprite(haloMat);
  moonHalo.scale.set(34, 34, 1);
  moonGroup.add(moonHalo);

  const outerHaloMat = new THREE.SpriteMaterial({
    map: goldGlowMap,
    color: 0xffd277,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const outerHalo = new THREE.Sprite(outerHaloMat);
  outerHalo.scale.set(56, 56, 1);
  moonGroup.add(outerHalo);

  const cloudsGroup = new THREE.Group();
  function createCloudTex() {
    const cCanvas = document.createElement("canvas");
    cCanvas.width = 256;
    cCanvas.height = 128;
    const cCtx = cCanvas.getContext("2d");
    cCtx.clearRect(0, 0, 256, 128);
    const cGrad = cCtx.createRadialGradient(128, 64, 5, 128, 64, 95);
    cGrad.addColorStop(0, "rgba(255, 240, 220, 0.45)");
    cGrad.addColorStop(0.4, "rgba(230, 205, 245, 0.22)");
    cGrad.addColorStop(0.75, "rgba(180, 150, 220, 0.05)");
    cGrad.addColorStop(0.95, "rgba(0, 0, 0, 0)");
    cGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    cCtx.fillStyle = cGrad;
    cCtx.fillRect(0, 0, 256, 128);
    return new THREE.CanvasTexture(cCanvas);
  }

  const cloudTex = createCloudTex();
  for (let i = 0; i < 3; i++) {
    const cloudGeo = new THREE.PlaneGeometry(16 + i * 4, 5.5 + i);
    const cloudMat = new THREE.MeshBasicMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      fog: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.position.set(-6 + i * 5, -2 + i * 2.2, 4.0);
    cloudMesh.userData = { speed: 0.007 + i * 0.004 };
    cloudsGroup.add(cloudMesh);
  }
  moonGroup.add(cloudsGroup);

  scene.add(moonGroup);
  return { moonGroup, cloudsGroup };
}

const { cloudsGroup: moonClouds } = createFullMoon();


// ==========================================
// 9. ĐẢO BỒNG BỀNH (FLOATING ISLAND)
// ==========================================
const islandGroup = new THREE.Group();
scene.add(islandGroup);

const islandGeo = new THREE.CylinderGeometry(
  8.6,
  2.0,
  7.8,
  isMobile ? 32 : 48,
  12
);
const posAttr = islandGeo.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
  const vx = posAttr.getX(i);
  const vy = posAttr.getY(i);
  const vz = posAttr.getZ(i);

  const distFromCenter = Math.sqrt(vx * vx + vz * vz);
  const noise =
    Math.sin(vx * 0.8) * Math.cos(vz * 0.8) * 0.6 +
    Math.sin(vx * 1.8 + vz * 1.5) * 0.3;

  if (vy > 0) {
    posAttr.setY(i, vy + noise * (1.0 - distFromCenter / 12));
  } else {
    posAttr.setX(i, vx + (Math.random() - 0.5) * 1.5);
    posAttr.setZ(i, vz + (Math.random() - 0.5) * 1.5);
  }
}
islandGeo.computeVertexNormals();

const islandMat = new THREE.MeshStandardMaterial({
  color: 0x44241d,
  roughness: 0.85,
  flatShading: true,
});
const islandMesh = new THREE.Mesh(islandGeo, islandMat);
islandGroup.add(islandMesh);

const topGeo = new THREE.CylinderGeometry(8.8, 8.0, 0.9, isMobile ? 32 : 48, 4);
const topPos = topGeo.attributes.position;
for (let i = 0; i < topPos.count; i++) {
  const vx = topPos.getX(i);
  const vy = topPos.getY(i);
  const vz = topPos.getZ(i);
  const noise = Math.sin(vx * 0.9) * Math.cos(vz * 0.9) * 0.45;
  topPos.setY(i, vy + noise * 0.35);
}
topGeo.computeVertexNormals();
const topMat = new THREE.MeshStandardMaterial({
  color: 0x2e1916,
  roughness: 0.85,
  flatShading: true,
});
const topMesh = new THREE.Mesh(topGeo, topMat);
topMesh.position.y = 3.8;
islandGroup.add(topMesh);

const stoneMat = new THREE.MeshStandardMaterial({
  color: 0x5a5d68,
  roughness: 0.78,
  metalness: 0.15,
  flatShading: true,
});
const mainStonePlatformGeo = new THREE.CylinderGeometry(2.6, 3.2, 0.22, 8);
const mainStonePlatform = new THREE.Mesh(mainStonePlatformGeo, stoneMat);
mainStonePlatform.position.set(0, 4.1, 0);
islandGroup.add(mainStonePlatform);

const rockCount = 5;
for (let i = 0; i < rockCount; i++) {
  const rockGeo = new THREE.DodecahedronGeometry(0.25 + Math.random() * 0.28, 0);
  const rockMesh = new THREE.Mesh(rockGeo, stoneMat);
  const angle = (i / rockCount) * Math.PI * 2 + 0.4;
  const dist = 3.6 + Math.random() * 2.8;
  rockMesh.position.set(Math.cos(angle) * dist, 4.1, Math.sin(angle) * dist);
  rockMesh.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  islandGroup.add(rockMesh);
}

// ==========================================
// 10. CÂY CỔ THỤ HOA ANH ĐÀO
// ==========================================
const treeGroup = new THREE.Group();
treeGroup.position.set(0, 4.15, 0);
islandGroup.add(treeGroup);

const trunkMat = new THREE.MeshStandardMaterial({
  color: 0x2a120c,
  roughness: 0.85,
});

const trunkCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0.18, 2.6, -0.12),
  new THREE.Vector3(-0.12, 5.2, 0.12),
  new THREE.Vector3(0.0, 7.8, 0.0),
]);

const trunkGeo = new THREE.TubeGeometry(trunkCurve, 32, 0.3, 8, false);
const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
treeGroup.add(trunkMesh);

const branchClusters = [];
const mainBranchCount = 14;
for (let i = 0; i < mainBranchCount; i++) {
  const angle = (i / mainBranchCount) * Math.PI * 2 + Math.random() * 0.35;
  const h = 2.8 + Math.random() * 4.4;
  const startP = trunkCurve.getPointAt(h / 7.8);
  const len = 3.2 + Math.random() * 2.4;

  const endP = new THREE.Vector3(
    startP.x + Math.cos(angle) * len,
    startP.y + 0.9 + Math.random() * 1.2,
    startP.z + Math.sin(angle) * len
  );

  const midP = new THREE.Vector3().addVectors(startP, endP).multiplyScalar(0.5);
  midP.y += 0.45;

  const bCurve = new THREE.CatmullRomCurve3([startP, midP, endP]);
  const bGeo = new THREE.TubeGeometry(bCurve, 12, 0.095, 6, false);
  const bMesh = new THREE.Mesh(bGeo, trunkMat);
  treeGroup.add(bMesh);

  branchClusters.push({ center: endP, radius: 3.4 + Math.random() * 1.1 });
}

const blossomCount = isMobile ? 22000 : 38000;
const blossomGeo = new THREE.BufferGeometry();
const blossomPos = new Float32Array(blossomCount * 3);
const blossomColors = new Float32Array(blossomCount * 3);

const colDusty = new THREE.Color(0xe897a2);
const colSoftPink = new THREE.Color(0xf6b5bd);
const colPaleRose = new THREE.Color(0xfce0e4);
const colWarmGold = new THREE.Color(0xfff0c4);

const clusters = [
  { center: new THREE.Vector3(0, 9.8, 0), radius: 6.5 },
  { center: new THREE.Vector3(0, 7.8, 0), radius: 7.4 },
  { center: new THREE.Vector3(0, 5.8, 0), radius: 6.2 },
  ...branchClusters,
];

for (let i = 0; i < blossomCount; i++) {
  const c = clusters[Math.floor(Math.random() * clusters.length)];
  const u = Math.random();
  const r = Math.pow(u, 0.65) * c.radius;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  const x = c.center.x + r * Math.sin(phi) * Math.cos(theta);
  const y = c.center.y + r * Math.sin(phi) * Math.sin(theta) * 0.82;
  const z = c.center.z + r * Math.cos(phi);

  blossomPos[i * 3] = x;
  blossomPos[i * 3 + 1] = y;
  blossomPos[i * 3 + 2] = z;

  const heightFactor = THREE.MathUtils.clamp((y - 3) / 7.5, 0, 1);
  const randC = Math.random();
  let col;

  if (heightFactor < 0.3) {
    col = randC < 0.6 ? colDusty : colSoftPink;
  } else if (heightFactor < 0.7) {
    col = randC < 0.45 ? colSoftPink : randC < 0.85 ? colPaleRose : colDusty;
  } else {
    col = randC < 0.5 ? colWarmGold : colPaleRose;
  }

  blossomColors[i * 3] = col.r;
  blossomColors[i * 3 + 1] = col.g;
  blossomColors[i * 3 + 2] = col.b;
}

blossomGeo.setAttribute("position", new THREE.BufferAttribute(blossomPos, 3));
blossomGeo.setAttribute("color", new THREE.BufferAttribute(blossomColors, 3));

const blossomMat = new THREE.PointsMaterial({
  size: isMobile ? 0.32 : 0.26,
  vertexColors: true,
  map: particleMap,
  transparent: true,
  opacity: 0.82,
  blending: THREE.NormalBlending,
  depthWrite: false,
});
const blossomParticles = new THREE.Points(blossomGeo, blossomMat);
treeGroup.add(blossomParticles);

// ==========================================
// 11. THỎ NGỌC TÌNH YÊU & TƯƠNG TÁC CHẠM (PETTING)
// ==========================================
function createCuteRabbit() {
  const group = new THREE.Group();
  const furMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
  });
  const innerEarMat = new THREE.MeshStandardMaterial({
    color: 0xffafcc,
    roughness: 0.55,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.8,
  });

  const bodyGeo = new THREE.SphereGeometry(0.48, 14, 14);
  bodyGeo.scale(0.85, 1, 0.95);
  const bodyMesh = new THREE.Mesh(bodyGeo, furMat);
  bodyMesh.position.y = 0.42;
  group.add(bodyMesh);

  const headGeo = new THREE.SphereGeometry(0.36, 14, 14);
  const headMesh = new THREE.Mesh(headGeo, furMat);
  headMesh.position.set(0, 0.88, 0.22);
  group.add(headMesh);

  const eyeGeo = new THREE.SphereGeometry(0.055, 8, 8);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.14, 0.93, 0.5);
  group.add(eyeL);

  const eyeR = eyeL.clone();
  eyeR.position.x = 0.14;
  group.add(eyeR);

  const noseGeo = new THREE.SphereGeometry(0.04, 6, 6);
  const noseMesh = new THREE.Mesh(noseGeo, innerEarMat);
  noseMesh.position.set(0, 0.86, 0.55);
  group.add(noseMesh);

  const earGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.55, 8);
  const earL = new THREE.Mesh(earGeo, furMat);
  earL.position.set(-0.13, 1.32, 0.18);
  earL.rotation.z = 0.15;
  earL.rotation.x = -0.1;
  group.add(earL);

  const earR = earL.clone();
  earR.position.x = 0.13;
  earR.rotation.z = -0.15;
  group.add(earR);

  const inEarGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.42, 6);
  const inEarL = new THREE.Mesh(inEarGeo, innerEarMat);
  inEarL.position.set(-0.13, 1.3, 0.21);
  inEarL.rotation.z = 0.15;
  inEarL.rotation.x = -0.08;
  group.add(inEarL);

  const inEarR = inEarL.clone();
  inEarR.position.x = 0.13;
  inEarR.rotation.z = -0.15;
  group.add(inEarR);

  const tailGeo = new THREE.SphereGeometry(0.14, 8, 8);
  const tailMesh = new THREE.Mesh(tailGeo, furMat);
  tailMesh.position.set(0, 0.35, -0.42);
  group.add(tailMesh);

  return group;
}

const coupleGroup = new THREE.Group();
coupleGroup.position.set(0.6, 4.15, 1.6);
islandGroup.add(coupleGroup);

const rabChi = createCuteRabbit();
rabChi.scale.set(0.85, 0.85, 0.85);
rabChi.position.set(-0.35, 0, 0);
rabChi.rotation.y = 0.35;
coupleGroup.add(rabChi);

const rabAnh = createCuteRabbit();
rabAnh.scale.set(0.95, 0.95, 0.95);
rabAnh.position.set(0.35, 0, 0);
rabAnh.rotation.y = -0.35;
coupleGroup.add(rabAnh);

// Beating 3D Heart above the couple
function createFloatingHeartMesh() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x + 0.25, y + 0.25);
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
  shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
  shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
  shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

  const extrudeSettings = {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xff3366,
    emissive: 0xff0044,
    emissiveIntensity: 0.6,
    roughness: 0.3,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.z = Math.PI;
  mesh.rotation.y = Math.PI;
  mesh.scale.set(0.5, 0.5, 0.5);
  mesh.position.set(0.12, 1.8, 0);
  return mesh;
}

const loveHeartMesh = createFloatingHeartMesh();
coupleGroup.add(loveHeartMesh);

// Click hit sphere for petting bunnies
const bunnyHitGeo = new THREE.SphereGeometry(1.5, 8, 8);
const bunnyHitMat = new THREE.MeshBasicMaterial({ visible: false });
const bunnyHitMesh = new THREE.Mesh(bunnyHitGeo, bunnyHitMat);
bunnyHitMesh.position.set(0, 0.8, 0);
bunnyHitMesh.userData = { isBunnyGroup: true };
coupleGroup.add(bunnyHitMesh);

// Hopping rabbits
const hoppingRabbits = [];
for (let i = 0; i < 2; i++) {
  const rMesh = createCuteRabbit();
  islandGroup.add(rMesh);

  hoppingRabbits.push({
    mesh: rMesh,
    orbitRadius: 3.6 + i * 1.5,
    orbitSpeed: (0.18 + i * 0.06) * (i === 0 ? 1 : -1),
    phase: i * Math.PI,
    baseY: 4.2,
    hopSpeed: 5.0,
    hopHeight: 0.18,
    scale: 0.8,
  });
  rMesh.scale.setScalar(0.8);
}

function updateRabbits(time) {
  const heartBeatScale = 0.5 + Math.sin(time * 3.5) * 0.06;
  loveHeartMesh.scale.set(heartBeatScale, heartBeatScale, heartBeatScale);
  loveHeartMesh.position.y = 1.75 + Math.sin(time * 2) * 0.08;

  hoppingRabbits.forEach((r) => {
    const angle = r.phase + time * r.orbitSpeed;
    const sign = Math.sign(r.orbitSpeed) || 1;

    const x = Math.cos(angle) * r.orbitRadius;
    const z = Math.sin(angle) * r.orbitRadius;
    const hop = Math.abs(Math.sin(time * r.hopSpeed)) * r.hopHeight;

    r.mesh.position.set(x, r.baseY + hop, z);

    const dx = -Math.sin(angle) * sign;
    const dz = Math.cos(angle) * sign;
    r.mesh.rotation.y = Math.atan2(dx, dz);
  });
}

// Bunny dialogue quotes when petted
const bunnyQuotes = [
  "Bảo Chi là cô bé đáng yêu nhất vũ trụ của anh! ❤️",
  "Hôm nay Chi đã ăn cơm ngon miệng chưa nè? 🐰",
  "Anh người yêu dặn Chi không được thức khuya đâu đấy!",
  "Chi ngoan, anh yêu và thương Chi nhiều nhất trần đời! 💖",
  "Có Chi bên cạnh, ngày nào với anh cũng là rằm trọn vẹn!",
];
let currentQuoteIdx = 0;
const bunnyBubble = document.getElementById("bunnyBubble");
const bunnyText = document.getElementById("bunnyText");
let bubbleTimer = null;

function petBunnies() {
  playCuteBunnyChime();

  // Jump animation
  coupleGroup.position.y = 4.6;
  setTimeout(() => {
    coupleGroup.position.y = 4.15;
  }, 300);

  // Heart firework
  const bWorldPos = new THREE.Vector3();
  coupleGroup.getWorldPosition(bWorldPos);
  bWorldPos.y += 2.0;
  createHeartFirework(bWorldPos, 0xff3366);

  // Project bubble onto screen
  const screenPos = bWorldPos.clone().project(camera);
  const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;

  bunnyBubble.style.left = `${x}px`;
  bunnyBubble.style.top = `${y}px`;
  bunnyText.textContent = bunnyQuotes[currentQuoteIdx % bunnyQuotes.length];
  currentQuoteIdx++;

  bunnyBubble.classList.add("show");
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => {
    bunnyBubble.classList.remove("show");
  }, 4200);
}

// ==========================================
// 12. BIỂN MÂY BỒNG BỀNH (SEA OF CLOUDS)
// ==========================================
const cloudSeaGroup = new THREE.Group();
cloudSeaGroup.position.set(0, -9, 0);
scene.add(cloudSeaGroup);

const cloudDiscGeo = new THREE.CircleGeometry(16, 24);
const cloudSeaTex = (function () {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(235, 210, 255, 0.45)");
  grad.addColorStop(0.5, "rgba(200, 160, 240, 0.2)");
  grad.addColorStop(1, "rgba(100, 80, 180, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
})();

const cloudPuffs = [];
for (let i = 0; i < 9; i++) {
  const cloudMat = new THREE.MeshBasicMaterial({
    map: cloudSeaTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const cloudMesh = new THREE.Mesh(cloudDiscGeo, cloudMat);
  cloudMesh.rotation.x = -Math.PI / 2;
  const ang = (i / 9) * Math.PI * 2;
  const rad = 10 + Math.random() * 12;
  cloudMesh.position.set(
    Math.cos(ang) * rad,
    (Math.random() - 0.5) * 3,
    Math.sin(ang) * rad
  );
  const sc = 1.2 + Math.random() * 0.8;
  cloudMesh.scale.set(sc, sc, sc);
  cloudSeaGroup.add(cloudMesh);
  cloudPuffs.push({ mesh: cloudMesh, rotSpeed: (Math.random() - 0.5) * 0.003 });
}

// ==========================================
// 13. ĐOM ĐÓM PHÉP THUẬT & MINI-QUEST
// ==========================================
const fireflyCount = isMobile ? 32 : 55;
const fireflies = [];
const firefliesGroup = new THREE.Group();
scene.add(firefliesGroup);

const interactiveFireflies = [];
let caughtFireflies = 0;
const fireflyCountText = document.getElementById("fireflyCountText");
const secretGiftModal = document.getElementById("secretGiftModal");

const fireflySpriteMat = new THREE.SpriteMaterial({
  map: fireflyGlowMap,
  color: 0xddff66,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
});

for (let i = 0; i < fireflyCount; i++) {
  const sprite = new THREE.Sprite(fireflySpriteMat.clone());
  const sc = 0.42 + Math.random() * 0.35;
  sprite.scale.set(sc, sc, 1);

  const radius = 3.5 + Math.random() * 8.5;
  const height = 3.5 + Math.random() * 9.0;
  const angle = Math.random() * Math.PI * 2;

  sprite.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
  firefliesGroup.add(sprite);

  // Click hit sphere for firefly quest
  const fHitGeo = new THREE.SphereGeometry(1.4, 6, 6);
  const fHitMat = new THREE.MeshBasicMaterial({ visible: false });
  const fHitMesh = new THREE.Mesh(fHitGeo, fHitMat);
  fHitMesh.position.copy(sprite.position);
  fHitMesh.userData = { isFirefly: true, fireflyIndex: i };
  interactiveFireflies.push(fHitMesh);
  scene.add(fHitMesh);

  fireflies.push({
    sprite: sprite,
    hitMesh: fHitMesh,
    radius: radius,
    baseY: height,
    angle: angle,
    speed: (0.15 + Math.random() * 0.25) * (Math.random() > 0.5 ? 1 : -1),
    bobSpeed: 1.2 + Math.random() * 1.8,
    pulseSpeed: 2.0 + Math.random() * 2.5,
    pulseOffset: Math.random() * Math.PI * 2,
  });
}

function updateFireflies(time) {
  fireflies.forEach((f) => {
    f.angle += f.speed * 0.02;
    const x = Math.cos(f.angle) * f.radius;
    const z = Math.sin(f.angle) * f.radius;
    const y = f.baseY + Math.sin(time * f.bobSpeed + f.pulseOffset) * 0.5;

    f.sprite.position.set(x, y, z);
    f.hitMesh.position.set(x, y, z);

    const pulse = 0.5 + Math.sin(time * f.pulseSpeed + f.pulseOffset) * 0.45;
    f.sprite.material.opacity = pulse;
  });
}

function catchFirefly(hitMesh) {
  const fData = fireflies[hitMesh.userData.fireflyIndex];
  if (!fData) return;

  playSparkleSound();
  createHeartFirework(fData.sprite.position, 0xd4ff80);

  // Respawn firefly further away
  fData.radius = 12 + Math.random() * 8;
  fData.baseY = 6 + Math.random() * 6;

  caughtFireflies++;
  fireflyCountText.textContent = `${Math.min(caughtFireflies, 5)}/5`;

  if (caughtFireflies < 5) {
    showToast(`✨ Chi đã bắt được ${caughtFireflies}/5 đom đóm phép thuật!`);
  } else if (caughtFireflies === 5) {
    launchMultiFireworks();
    setTimeout(() => {
      secretGiftModal.classList.add("active");
      playLoveChime();
      showToast("🎉 Chúc mừng Bảo Chi đã mở khóa Quà Tặng Bí Mật!");
    }, 400);
  }
}

// ==========================================
// 14. LỒNG ĐÈN TÌNH YÊU DÀNH CHO ĐẶNG BẢO CHI
// ==========================================
const lanternsGroup = new THREE.Group();
scene.add(lanternsGroup);

const lanterns = [];
const interactiveObjects = [];

const defaultWishes = [
  {
    sender: "Người Yêu em (Không phải Đức)",
    text: "Trung Thu vui vẻ nha. Anh cũng không biết nói gì nhiều đâu, chỉ mong em lúc nào cũng vui, ít suy nghĩ linh tinh lại và ở bên anh thật lâu là được. Yêu em.",
    img: "./assets/1.jpg",
    style: "heart",
  },

  {
    sender: "Anh",
    text: "Trung Thu người ta ngắm trăng, còn anh ngắm em thôi =)) Với anh thì em vẫn là xinh nhất rồi, nhìn mãi chả chán.",
    img: "./assets/2.jpg",
    style: "star",
  },

  {
    sender: "Người Luôn Ở Đây",
    text: "Anh chỉ mong em luôn vui vẻ với bình an thôi. Có gì buồn hay mệt thì nói với anh, đừng có cứ giữ một mình. Anh vẫn ở đây mà.",
    img: "./assets/3.jpg",
    style: "lotus",
  },

  {
    sender: "Trung Thu Của Anh",
    text: "Năm nay có em nên Trung Thu cũng khác thật. Cảm ơn em vì vẫn ở bên anh đến giờ. Mong mấy năm sau, rồi nhiều năm sau nữa, người đi chơi Trung Thu với anh vẫn là em.",
    img: "./assets/4.jpg",
    style: "heart",
  },

  {
    sender: "Điều Anh Muốn",
    text: "Có lẽ baayh anh muốn là cùng đi chơi với em, lên phố để chơi chứ không phải là mình đi lên cùng nhau và anh về một mình :(, lên vội vã chả thưởng thức dudoc j... ",
    img: "./assets/5.jpg",
    style: "gold",
  },

  {
    sender: "Duc",
    text: "Anh không giỏi nói mấy câu sến sến đâu. Chỉ là anh thật sự rất vui vì có em bên cạnh. Anh nhớ em lắm, anh xin lỗi vì nhiều lúc làm em buồn ạ.",
    img: "./assets/6.jpg",
    style: "heart",
  },
];


function createStarShape(outerRadius = 0.75, innerRadius = 0.35, points = 5) {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

const starGeometry = (function () {
  const shape = createStarShape(0.72, 0.35, 5);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
})();

function createLanternTexture(type = "gold") {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  if (type === "star" || type === "red") {
    grad.addColorStop(0, "#ff3344");
    grad.addColorStop(0.5, "#d90429");
    grad.addColorStop(1, "#ff8800");
  } else if (type === "lotus") {
    grad.addColorStop(0, "#ff5c8a");
    grad.addColorStop(0.6, "#d43d8a");
    grad.addColorStop(1, "#ffd166");
  } else if (type === "heart") {
    grad.addColorStop(0, "#ff3366");
    grad.addColorStop(0.6, "#c9184a");
    grad.addColorStop(1, "#ff9ebb");
  } else {
    grad.addColorStop(0, "#ff4d4d");
    grad.addColorStop(0.5, "#e63946");
    grad.addColorStop(1, "#ffb703");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = "#ffd700";
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 120, 120);

  if (type === "heart") {
    ctx.fillStyle = "rgba(255, 230, 240, 0.75)";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♥", 64, 66);
  } else {
    ctx.fillStyle = "rgba(255, 235, 120, 0.4)";
    ctx.beginPath();
    ctx.arc(64, 64, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

const lanternTextures = {
  gold: createLanternTexture("gold"),
  star: createLanternTexture("star"),
  lotus: createLanternTexture("lotus"),
  heart: createLanternTexture("heart"),
};

function createLanternMesh(style = "gold") {
  const group = new THREE.Group();

  let glowColor = 0xffaa00;
  let spriteMap = goldGlowMap;
  if (style === "lotus" || style === "heart") {
    glowColor = 0xff3366;
    spriteMap = heartGlowMap;
  }

  if (style === "star") {
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xee2233,
      emissive: 0xff3344,
      emissiveIntensity: 0.65,
      roughness: 0.35,
      metalness: 0.2,
    });
    const starMesh = new THREE.Mesh(starGeometry, starMat);
    group.add(starMesh);

    const ringGeo = new THREE.RingGeometry(0.28, 0.35, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.z = 0.12;
    group.add(ringMesh);

    const tagGeo = new THREE.PlaneGeometry(0.28, 0.7);
    const tagMat = new THREE.MeshBasicMaterial({
      color: 0xffb703,
      side: THREE.DoubleSide,
    });
    const tag = new THREE.Mesh(tagGeo, tagMat);
    tag.position.set(0, -0.9, 0);
    group.add(tag);
  } else {
    const bodyGeo = new THREE.CylinderGeometry(0.58, 0.42, 1.35, 7);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: lanternTextures[style] || lanternTextures.gold,
      emissive: style === "heart" ? 0xcc1144 : 0xff6600,
      emissiveIntensity: 0.75,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const capGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.1, 7);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.45,
    });
    const capTop = new THREE.Mesh(capGeo, capMat);
    capTop.position.y = 0.68;
    group.add(capTop);

    const tagGeo = new THREE.PlaneGeometry(0.32, 0.65);
    const tagMat = new THREE.MeshBasicMaterial({
      color: style === "heart" ? 0xff3366 : 0xd90429,
      side: THREE.DoubleSide,
    });
    const tag = new THREE.Mesh(tagGeo, tagMat);
    tag.position.set(0, -1.05, 0);
    group.add(tag);
  }

  const spriteMat = new THREE.SpriteMaterial({
    map: spriteMap,
    color: glowColor,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Sprite(spriteMat);
  glow.scale.set(2.6, 2.6, 1);
  group.add(glow);

  const hitGeo = new THREE.SphereGeometry(1.6, 8, 8);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  group.add(hitMesh);

  return { group, hitMesh, glow };
}

// 1. VIP Heart Lantern in front dedicated to Bảo Chi
(function createVipLanternForChi() {
  const { group: vip, hitMesh, glow } = createLanternMesh("heart");
  vip.position.set(0.2, 5.2, 7.2);
  vip.scale.set(1.4, 1.4, 1.4);
  vip.userData = {
    speedY: 0.007,
    swingSpeed: 0.9,
    initialX: 0.2,
    initialZ: 7.2,
    wish: defaultWishes[0].text,
    sender: defaultWishes[0].sender,
    imgUrl: defaultWishes[0].img,
    id: 0,
    glow: glow,
  };
  hitMesh.userData.parentLantern = vip;
  lanternsGroup.add(vip);
  lanterns.push(vip);
  interactiveObjects.push(hitMesh);
})();

// SPAWN REST OF LANTERNS
const totalLanterns = isMobile ? 26 : 38;
for (let i = 1; i < totalLanterns; i++) {
  const wishData = defaultWishes[i % defaultWishes.length];
  const { group: lantern, hitMesh, glow } = createLanternMesh(wishData.style);

  const radius = 9 + Math.random() * 26;
  const angle = Math.random() * Math.PI * 2;
  const y = -1 + Math.random() * 32;

  lantern.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);

  lantern.userData = {
    speedY: 0.009 + Math.random() * 0.013,
    swingSpeed: 0.8 + Math.random() * 1.2,
    initialX: lantern.position.x,
    initialZ: lantern.position.z,
    wish: wishData.text,
    sender: wishData.sender,
    imgUrl: wishData.img,
    id: i,
    glow: glow,
  };

  const sc = 0.75 + Math.random() * 0.45;
  lantern.scale.set(sc, sc, sc);

  hitMesh.userData.parentLantern = lantern;

  lanternsGroup.add(lantern);
  lanterns.push(lantern);
  interactiveObjects.push(hitMesh);
}

// ==========================================
// 15. CÁNH HOA RƠI & SAO TRỜI
// ==========================================
const fallingPetalsCount = isMobile ? 80 : 180;
const petalsGeo = new THREE.BufferGeometry();
const petalsPos = new Float32Array(fallingPetalsCount * 3);
const petalsData = [];

for (let i = 0; i < fallingPetalsCount; i++) {
  petalsPos[i * 3] = (Math.random() - 0.5) * 38;
  petalsPos[i * 3 + 1] = Math.random() * 38;
  petalsPos[i * 3 + 2] = (Math.random() - 0.5) * 38;

  petalsData.push({
    speedY: 0.018 + Math.random() * 0.03,
    swaySpeed: 1.0 + Math.random() * 1.5,
    swayAmp: 0.015 + Math.random() * 0.02,
  });
}

petalsGeo.setAttribute("position", new THREE.BufferAttribute(petalsPos, 3));
const petalsMat = new THREE.PointsMaterial({
  size: isMobile ? 0.35 : 0.28,
  color: 0xfbd2d7,
  transparent: true,
  opacity: 0.8,
  map: particleMap,
  blending: THREE.NormalBlending,
  depthWrite: false,
});
const petalsParticles = new THREE.Points(petalsGeo, petalsMat);
scene.add(petalsParticles);

const starCount = isMobile ? 500 : 1000;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 220;
  starPos[i * 3 + 1] = Math.random() * 110;
  starPos[i * 3 + 2] = (Math.random() - 0.5) * 220;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.45,
  map: particleMap,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
scene.add(new THREE.Points(starGeo, starMat));

let shootingStar = null;
function spawnShootingStar() {
  const lineGeo = new THREE.BufferGeometry();
  const startX = (Math.random() - 0.5) * 80;
  const startY = 40 + Math.random() * 25;
  const startZ = -40 - Math.random() * 40;

  const points = [
    new THREE.Vector3(startX, startY, startZ),
    new THREE.Vector3(startX - 6, startY - 4, startZ + 3),
  ];
  lineGeo.setFromPoints(points);

  const lineMat = new THREE.LineBasicMaterial({
    color: 0xfff3c4,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
  });

  const line = new THREE.Line(lineGeo, lineMat);
  scene.add(line);

  shootingStar = {
    mesh: line,
    life: 1.0,
    dir: new THREE.Vector3(-0.9, -0.6, 0.4).normalize().multiplyScalar(0.7),
  };
}

// ==========================================
// 16. PHÁO HOA TRÁI TIM & PHÁO HOA NGHỆ THUẬT
// ==========================================
const fireworks = [];
const fireworkPalettes = [
  0xff3366, // Rose Crimson
  0xff758f, // Soft Pink
  0xffd700, // Gold
  0x00f0ff, // Cyan
  0xff9e00, // Amber
  0xd90429, // Ruby
];

function createHeartFirework(pos, customColor = 0xff3366) {
  const pCount = isMobile ? 55 : 85;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(pCount * 3);
  const velocities = [];

  for (let i = 0; i < pCount; i++) {
    pPositions[i * 3] = pos.x;
    pPositions[i * 3 + 1] = pos.y;
    pPositions[i * 3 + 2] = pos.z;

    const t = (i / pCount) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    const speed = 0.014 + Math.random() * 0.006;
    velocities.push(
      new THREE.Vector3(
        hx * speed,
        hy * speed,
        (Math.random() - 0.5) * 0.06
      )
    );
  }

  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.42,
    color: customColor,
    map: particleMap,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const pMesh = new THREE.Points(pGeo, pMat);
  scene.add(pMesh);

  fireworks.push({
    mesh: pMesh,
    velocities: velocities,
    life: 1.25,
    gravity: 0.0012,
  });

  playLoveChime();
}

function launchMultiFireworks() {
  const centers = [
    new THREE.Vector3(-8, 16, -8),
    new THREE.Vector3(7, 20, -12),
    new THREE.Vector3(0, 19, 0),
    new THREE.Vector3(-4, 22, 6),
    new THREE.Vector3(9, 15, 6),
  ];
  centers.forEach((p, idx) => {
    setTimeout(() => {
      createHeartFirework(p, idx % 2 === 0 ? 0xff3366 : 0xffd700);
    }, idx * 260);
  });
}

// ==========================================
// 17. TƯƠNG TÁC RAYCASTER & MODAL
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetCamPos = null;
let targetCamTarget = null;
let selectedLantern = null;
let currentWishIndex = 0;

// UI Elements
const introOverlay = document.getElementById("introOverlay");
const startExperienceBtn = document.getElementById("startExperienceBtn");

const wishModal = document.getElementById("wishModal");
const wishTitle = document.getElementById("wishTitle");
const wishAuthor = document.getElementById("wishAuthor");
const wishText = document.getElementById("wishText");
const wishImage = document.getElementById("wishImage");
const closeWishBtn = document.getElementById("closeWishBtn");
const prevWishBtn = document.getElementById("prevWishBtn");
const nextWishBtn = document.getElementById("nextWishBtn");
const copyWishBtn = document.getElementById("copyWishBtn");

const loveLetterModal = document.getElementById("loveLetterModal");
const letterBtn = document.getElementById("letter-btn");
const closeLetterBtn = document.getElementById("closeLetterBtn");
const letterReleaseBtn = document.getElementById("letterReleaseBtn");

const galleryModal = document.getElementById("galleryModal");
const galleryBtn = document.getElementById("gallery-btn");
const closeGalleryBtn = document.getElementById("closeGalleryBtn");

const closeGiftBtn = document.getElementById("closeGiftBtn");
const claimVoucherBtn = document.getElementById("claimVoucherBtn");

const makeWishModal = document.getElementById("makeWishModal");
const openMakeWishBtn = document.getElementById("open-make-wish-btn");
const closeMakeWishBtn = document.getElementById("closeMakeWishBtn");
const submitWishBtn = document.getElementById("submitWishBtn");
const senderInput = document.getElementById("senderInput");
const customWishInput = document.getElementById("customWishInput");

const toastNotice = document.getElementById("toastNotice");
const toastMsg = document.getElementById("toastMsg");

const resetCamBtn = document.getElementById("reset-cam-btn");
const autoRotateBtn = document.getElementById("auto-rotate-btn");
const fireworkBtn = document.getElementById("firework-btn");
const audioBtn = document.getElementById("audio-btn");
const bgm = document.getElementById("bgm");

function showToast(message, duration = 3200) {
  toastMsg.textContent = message;
  toastNotice.classList.add("show");
  clearTimeout(toastNotice._timer);
  toastNotice._timer = setTimeout(() => {
    toastNotice.classList.remove("show");
  }, duration);
}

// Display Wish Modal for a Lantern
function displayWishForLantern(lantern) {
  selectedLantern = lantern;
  currentWishIndex = lanterns.indexOf(lantern);
  const data = lantern.userData;

  wishTitle.textContent = data.sender
    ? `Lời Chúc Từ: ${data.sender}`
    : "Thông Điệp Gửi Bảo Chi";
  wishAuthor.textContent = `✦ Đèn Nguyện Ước Dành Riêng Cho Em ✦`;
  wishText.textContent = `"${data.wish}"`;
  wishImage.src = data.imgUrl || "./assets/1.jpg";

  wishModal.classList.add("active");
  playSparkleSound();
}

function focusCameraOnLantern(lantern) {
  const lPos = lantern.position;
  createHeartFirework(lPos);

  const offset = new THREE.Vector3()
    .subVectors(camera.position, lPos)
    .normalize()
    .multiplyScalar(5.5);
  targetCamPos = new THREE.Vector3().addVectors(lPos, offset);
  targetCamTarget = lPos.clone();

  setTimeout(() => {
    displayWishForLantern(lantern);
  }, 320);
}

// Pointer Events for Interaction
let pointerDownPos = { x: 0, y: 0 };

function onPointerDown(event) {
  pointerDownPos.x =
    event.clientX || (event.touches && event.touches[0].clientX) || 0;
  pointerDownPos.y =
    event.clientY || (event.touches && event.touches[0].clientY) || 0;
}

function onPointerUp(event) {
  if (
    event.target.closest(".intro-overlay") ||
    event.target.closest(".top-bar") ||
    event.target.closest(".header-left-group") ||
    event.target.closest(".quest-pill") ||
    event.target.closest(".bottom-actions") ||
    event.target.closest(".wish-modal") ||
    event.target.closest(".make-wish-modal")
  ) {
    return;
  }

  const clientX =
    event.clientX ||
    (event.changedTouches && event.changedTouches[0].clientX) ||
    0;
  const clientY =
    event.clientY ||
    (event.changedTouches && event.changedTouches[0].clientY) ||
    0;

  const distMoved = Math.hypot(
    clientX - pointerDownPos.x,
    clientY - pointerDownPos.y
  );
  if (distMoved > 7) return;

  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // 1. Check Petting Bunnies
  const bunnyHits = raycaster.intersectObject(bunnyHitMesh, false);
  if (bunnyHits.length > 0) {
    petBunnies();
    return;
  }

  // 2. Check Catching Fireflies
  const fireflyHits = raycaster.intersectObjects(interactiveFireflies, false);
  if (fireflyHits.length > 0) {
    catchFirefly(fireflyHits[0].object);
    return;
  }

  // 3. Check Lanterns
  const intersects = raycaster.intersectObjects(interactiveObjects, false);
  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    const lantern = hitMesh.userData.parentLantern || hitMesh.parent;
    focusCameraOnLantern(lantern);
  } else {
    // Clicked in sky -> Shoot heart firework
    const pointInSky = new THREE.Vector3();
    raycaster.ray.at(28, pointInSky);
    createHeartFirework(pointInSky);
  }
}

window.addEventListener("pointerdown", onPointerDown, { passive: true });
window.addEventListener("pointerup", onPointerUp, { passive: true });

// Desktop Cursor Hover Feedback
if (!isMobile) {
  window.addEventListener("pointermove", (e) => {
    if (
      wishModal.classList.contains("active") ||
      makeWishModal.classList.contains("active") ||
      loveLetterModal.classList.contains("active") ||
      galleryModal.classList.contains("active") ||
      secretGiftModal.classList.contains("active")
    ) {
      document.body.style.cursor = "default";
      return;
    }
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const hitLantern = raycaster.intersectObjects(interactiveObjects, false).length > 0;
    const hitBunny = raycaster.intersectObject(bunnyHitMesh, false).length > 0;
    const hitFirefly = raycaster.intersectObjects(interactiveFireflies, false).length > 0;

    document.body.style.cursor = hitLantern || hitBunny || hitFirefly ? "pointer" : "default";
  });
}

// Camera Reset
function resetCamera() {
  targetCamPos = DEFAULT_CAM_POS.clone();
  targetCamTarget = DEFAULT_CAM_TARGET.clone();
  selectedLantern = null;
}

resetCamBtn.addEventListener("click", () => {
  resetCamera();
  showToast("Đã đặt lại góc nhìn ban đầu");
});

// Close Wish Modal
function closeWishCard() {
  wishModal.classList.remove("active");
  resetCamera();
}

closeWishBtn.addEventListener("click", closeWishCard);
wishModal.addEventListener("click", (e) => {
  if (e.target === wishModal) closeWishCard();
});

prevWishBtn.addEventListener("click", () => {
  if (lanterns.length === 0) return;
  currentWishIndex = (currentWishIndex - 1 + lanterns.length) % lanterns.length;
  const prevLantern = lanterns[currentWishIndex];
  focusCameraOnLantern(prevLantern);
});

nextWishBtn.addEventListener("click", () => {
  if (lanterns.length === 0) return;
  currentWishIndex = (currentWishIndex + 1) % lanterns.length;
  const nextLantern = lanterns[currentWishIndex];
  focusCameraOnLantern(nextLantern);
});

copyWishBtn.addEventListener("click", () => {
  if (!selectedLantern) return;
  const text = `${selectedLantern.userData.wish}\n(Món quà Trung Thu dành tặng Đặng Bảo Chi ❤️)`;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("✨ Đã sao chép lời chúc vào bộ nhớ tạm!");
    })
    .catch(() => {
      showToast("✨ Đã sao chép lời chúc!");
    });
});


// Quest Pill Click
document.getElementById("questPill").addEventListener("click", () => {
  if (caughtFireflies >= 5) {
    secretGiftModal.classList.add("active");
  } else {
    showToast(`🌟 Chi hãy chạm vào ${5 - caughtFireflies} chú đom đóm nữa để mở quà bí mật nhé!`);
  }
});

// Love Letter Modal Handlers
letterBtn.addEventListener("click", () => {
  loveLetterModal.classList.add("active");
  playLoveChime();
});

function closeLoveLetter() {
  loveLetterModal.classList.remove("active");
  stopVoiceNote();
}

closeLetterBtn.addEventListener("click", closeLoveLetter);
loveLetterModal.addEventListener("click", (e) => {
  if (e.target === loveLetterModal) closeLoveLetter();
});

letterReleaseBtn.addEventListener("click", () => {
  closeLoveLetter();
  const { group: loveLant, hitMesh, glow } = createLanternMesh("heart");
  loveLant.position.set(0, 4.5, 3);
  loveLant.scale.set(1.3, 1.3, 1.3);
  loveLant.userData = {
    speedY: 0.016,
    swingSpeed: 1.1,
    initialX: 0,
    initialZ: 3,
    wish: "Mỗi ngày có Bảo Chi bên cạnh đều là ngày rằm trọn vẹn và ngọt ngào nhất. Anh yêu Chi nhiều lắm! ❤️",
    sender: "Người Yêu Bảo Chi",
    imgUrl: "./assets/1.jpg",
    id: lanterns.length,
    glow: glow,
  };
  hitMesh.userData.parentLantern = loveLant;
  lanternsGroup.add(loveLant);
  lanterns.unshift(loveLant);
  interactiveObjects.unshift(hitMesh);

  launchMultiFireworks();
  showToast("💖 Đèn tình yêu đã thắp sáng và bay lên Cung Trăng cho Chi!");
});

// Photo Gallery Handlers
galleryBtn.addEventListener("click", () => {
  galleryModal.classList.add("active");
  playSparkleSound();
});

function closeGallery() {
  galleryModal.classList.remove("active");
}

closeGalleryBtn.addEventListener("click", closeGallery);
galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) closeGallery();
});

// Secret Gift Handlers
function closeSecretGift() {
  secretGiftModal.classList.remove("active");
}
closeGiftBtn.addEventListener("click", closeSecretGift);
secretGiftModal.addEventListener("click", (e) => {
  if (e.target === secretGiftModal) closeSecretGift();
});

claimVoucherBtn.addEventListener("click", () => {
  closeSecretGift();
  launchMultiFireworks();
  showToast("🎁 Đã lưu toàn bộ voucher vào trái tim anh! Chi chỉ cần đòi là anh thực hiện ngay! ❤️");
});

// Voice Note Player Simulation (Web Audio Romantic Melody / Audio file)
const voicePlayBtn = document.getElementById("voicePlayBtn");
const voicePlayIcon = document.getElementById("voicePlayIcon");
const voiceWaves = document.getElementById("voiceWaves");
let isVoicePlaying = false;
let voiceMelodyTimer = null;

function stopVoiceNote() {
  isVoicePlaying = false;
  voiceWaves.classList.remove("playing");
  voicePlayIcon.className = "fas fa-play";
  if (voiceMelodyTimer) clearInterval(voiceMelodyTimer);
}

function playVoiceMelody() {
  isVoicePlaying = true;
  voiceWaves.classList.add("playing");
  voicePlayIcon.className = "fas fa-pause";

  // Play romantic chime sequence
  const loveMelody = [
    523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25,
  ];
  let noteIndex = 0;
  voiceMelodyTimer = setInterval(() => {
    if (!isVoicePlaying) return;
    playTone(loveMelody[noteIndex % loveMelody.length], "sine", 0.7, 0.12);
    noteIndex++;
    if (noteIndex >= loveMelody.length * 2) {
      stopVoiceNote();
      showToast("❤️ Giọng nói ngọt ngào của anh luôn dành cho Bảo Chi!");
    }
  }, 450);
}

voicePlayBtn.addEventListener("click", () => {
  if (isVoicePlaying) {
    stopVoiceNote();
  } else {
    playVoiceMelody();
  }
});

// Auto-Rotate Button
autoRotateBtn.addEventListener("click", () => {
  controls.autoRotate = !controls.autoRotate;
  autoRotateBtn.classList.toggle("active", controls.autoRotate);
  if (controls.autoRotate) {
    showToast("Đang bật chế độ tự xoay ngắm cảnh 360°");
  } else {
    showToast("Đã dừng tự xoay");
  }
});

// Firework Button
fireworkBtn.addEventListener("click", () => {
  launchMultiFireworks();
  showToast("🎆 Pháo hoa trái tim Trung Thu rực rỡ tặng Bảo Chi!");
});

// MAKE A WISH (THẢ ĐÈN CÙNG BẢO CHI)
let selectedStyle = "heart";
const lanternChoiceEls = document.querySelectorAll(".lantern-choice");
lanternChoiceEls.forEach((choice) => {
  choice.addEventListener("click", () => {
    lanternChoiceEls.forEach((c) => c.classList.remove("active"));
    choice.classList.add("active");
    selectedStyle = choice.getAttribute("data-style");
  });
});

const presetWishes = {
  yeuthuong:
    "Anh yêu Đặng Bảo Chi nhiều lắm, chúc công chúa nhỏ của anh luôn rạng rỡ và hạnh phúc bên anh mãi mãi! ❤️",
  binhan:
    "Cầu chúc cho Bảo Chi luôn bình an, tâm hồn an yên và mỗi ngày trôi qua đều có thật nhiều niềm vui và nụ cười!",
  mayman:
    "Chúc cho Bảo Chi của anh mọi điều thuận buồm xuôi gió, học tập công tác thăng hoa và luôn gặp may mắn!",
  doanvien:
    "Nguyện ước được cùng Đặng Bảo Chi đón thêm thật nhiều mùa Trung Thu đoàn viên, ngọt ngào và hạnh phúc trong tương lai!",
};

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-preset");
    if (presetWishes[key]) {
      customWishInput.value = presetWishes[key];
    }
  });
});

openMakeWishBtn.addEventListener("click", () => {
  makeWishModal.classList.add("active");
});

function closeMakeWish() {
  makeWishModal.classList.remove("active");
}

closeMakeWishBtn.addEventListener("click", closeMakeWish);
makeWishModal.addEventListener("click", (e) => {
  if (e.target === makeWishModal) closeMakeWish();
});

submitWishBtn.addEventListener("click", () => {
  const wish = customWishInput.value.trim();
  const sender = senderInput.value.trim() || "Người Yêu Bảo Chi";

  if (!wish) {
    showToast("Vui lòng viết điều ước gửi đến Bảo Chi nhé!");
    customWishInput.focus();
    return;
  }

  const imgList = ["./assets/1.jpg", "./assets/2.jpg", "./assets/3.jpg"];
  const randomImg = imgList[Math.floor(Math.random() * imgList.length)];

  const { group: newLantern, hitMesh, glow } = createLanternMesh(selectedStyle);
  newLantern.position.set(
    (Math.random() - 0.5) * 4,
    4.6,
    (Math.random() - 0.5) * 4
  );

  newLantern.userData = {
    speedY: 0.018,
    swingSpeed: 1.2,
    initialX: newLantern.position.x,
    initialZ: newLantern.position.z,
    wish: wish,
    sender: sender,
    imgUrl: randomImg,
    id: lanterns.length,
    glow: glow,
  };

  newLantern.scale.set(1.2, 1.2, 1.2);
  hitMesh.userData.parentLantern = newLantern;

  lanternsGroup.add(newLantern);
  lanterns.unshift(newLantern);
  interactiveObjects.unshift(hitMesh);

  closeMakeWish();
  createHeartFirework(newLantern.position);
  playSparkleSound();

  showToast(`🏮 Đèn ước nguyện của ${sender} đã được thả lên Cung Trăng!`);

  targetCamPos = new THREE.Vector3(
    newLantern.position.x,
    newLantern.position.y + 3,
    newLantern.position.z + 8
  );
  targetCamTarget = newLantern.position;
});

// ESC Key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeWishCard();
    closeMakeWish();
    closeLoveLetter();
    closeGallery();
    closeSecretGift();
  }
});

// ==========================================
// 18. NHẠC NỀN & MÀN CHÀO (INTRO EXPERIENCE)
// ==========================================
let isPlaying = false;

function toggleMusic() {
  if (isPlaying) {
    bgm.pause();
    audioBtn.classList.remove("playing", "active");
    audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    showToast("Đã tắt nhạc");
    isPlaying = false;
  } else {
    bgm
      .play()
      .then(() => {
        audioBtn.classList.add("playing", "active");
        audioBtn.innerHTML = '<i class="fas fa-music"></i>';
        showToast("🎵 Đang phát giai điệu Trung Thu tặng Bảo Chi...");
        isPlaying = true;
      })
      .catch(() => {
        showToast("Chạm lại để bật âm thanh nhé!");
      });
  }
}

audioBtn.addEventListener("click", toggleMusic);

startExperienceBtn.addEventListener("click", () => {
  introOverlay.classList.add("hidden");

  bgm
    .play()
    .then(() => {
      isPlaying = true;
      audioBtn.classList.add("playing", "active");
      audioBtn.innerHTML = '<i class="fas fa-music"></i>';
    })
    .catch(() => { });

  targetCamPos = DEFAULT_CAM_POS.clone();
  targetCamTarget = DEFAULT_CAM_TARGET.clone();

  setTimeout(() => {
    launchMultiFireworks();
    showToast("❤️ Chúc Đặng Bảo Chi mùa Trung Thu đong đầy yêu thương!");
  }, 400);
});

// ==========================================
// 19. VÒNG LẶP ANIMATION (RENDER LOOP)
// ==========================================
const clock = new THREE.Clock();
let nextShootingStarTime = 4;

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();

  // 1. Lanterns Animation
  lanterns.forEach((lantern) => {
    lantern.position.y += lantern.userData.speedY;
    lantern.position.x =
      lantern.userData.initialX +
      Math.sin(time * lantern.userData.swingSpeed + lantern.userData.id) * 0.45;
    lantern.position.z =
      lantern.userData.initialZ +
      Math.cos(time * lantern.userData.swingSpeed + lantern.userData.id) * 0.45;
    lantern.rotation.y += 0.006;

    if (lantern.userData.glow) {
      const flicker = 0.72 + Math.sin(time * 8 + lantern.userData.id * 3) * 0.15;
      lantern.userData.glow.material.opacity = flicker;
    }

    if (lantern.position.y > 36) {
      lantern.position.y = -3;
    }
  });

  // 2. Falling Petals
  const pPos = petalsGeo.attributes.position.array;
  for (let i = 0; i < fallingPetalsCount; i++) {
    pPos[i * 3 + 1] -= petalsData[i].speedY;
    pPos[i * 3] +=
      Math.sin(time * petalsData[i].swaySpeed + i) * petalsData[i].swayAmp;
    pPos[i * 3 + 2] +=
      Math.cos(time * petalsData[i].swaySpeed + i) * petalsData[i].swayAmp;

    if (pPos[i * 3 + 1] < -4) {
      pPos[i * 3 + 1] = 34;
      pPos[i * 3] = (Math.random() - 0.5) * 38;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 38;
    }
  }
  petalsGeo.attributes.position.needsUpdate = true;

  // 3. Fireworks Update
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    fw.life -= delta * 1.15;
    const posArr = fw.mesh.geometry.attributes.position.array;

    for (let j = 0; j < fw.velocities.length; j++) {
      fw.velocities[j].y -= fw.gravity;
      posArr[j * 3] += fw.velocities[j].x;
      posArr[j * 3 + 1] += fw.velocities[j].y;
      posArr[j * 3 + 2] += fw.velocities[j].z;
    }
    fw.mesh.geometry.attributes.position.needsUpdate = true;
    fw.mesh.material.opacity = Math.max(0, fw.life);

    if (fw.life <= 0) {
      scene.remove(fw.mesh);
      fw.mesh.geometry.dispose();
      fw.mesh.material.dispose();
      fireworks.splice(i, 1);
    }
  }

  // 4. Shooting Stars
  if (time > nextShootingStarTime) {
    spawnShootingStar();
    nextShootingStarTime = time + 6 + Math.random() * 8;
  }

  if (shootingStar) {
    shootingStar.mesh.position.add(shootingStar.dir);
    shootingStar.life -= delta * 1.2;
    shootingStar.mesh.material.opacity = Math.max(0, shootingStar.life);
    if (shootingStar.life <= 0) {
      scene.remove(shootingStar.mesh);
      shootingStar.mesh.geometry.dispose();
      shootingStar.mesh.material.dispose();
      shootingStar = null;
    }
  }


  // 6. Moon Clouds Drift
  if (moonClouds) {
    moonClouds.children.forEach((c) => {
      c.position.x += c.userData.speed;
      if (c.position.x > 18) c.position.x = -18;
    });
  }

  // 7. Sea of Clouds Puff Rotation
  cloudPuffs.forEach((p) => {
    p.mesh.rotation.z += p.rotSpeed;
  });

  // 8. Fireflies & Rabbits
  updateFireflies(time);
  updateRabbits(time);

  // 9. Island Float
  islandGroup.rotation.y = Math.sin(time * 0.12) * 0.04;
  islandGroup.position.y = Math.sin(time * 0.4) * 0.12;

  // 10. Smooth Camera Transition
  if (targetCamPos && targetCamTarget) {
    camera.position.lerp(targetCamPos, 0.045);
    controls.target.lerp(targetCamTarget, 0.045);

    if (camera.position.distanceTo(targetCamPos) < 0.08) {
      targetCamPos = null;
      targetCamTarget = null;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ==========================================
// 20. XỬ LÝ RESIZE MÀN HÌNH
// ==========================================
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.fov = width < 768 ? 58 : 45;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, width < 768 ? 1.5 : 2)
  );
});
