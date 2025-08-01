import './research.css';
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scenes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Main scene
const scene0 = new THREE.Scene();
scenes.push(scene0);

//particles setup
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const randomColor1 = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
const particlesMaterial = new THREE.PointsMaterial({
  color: randomColor1,
  size: 0.02,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene0.add(particles);

// Scene 3 setup
const scene3 = new THREE.Scene();
scenes.push(scene3);

let edu;
const loader10 = new GLTFLoader();
loader10.load("text.glb", (gltf) => {
  edu = gltf.scene;
  edu.position.y = 1.1;
  gsap.timeline({ defaults: { duration: 1 } })
    .fromTo(edu.scale, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.5, z: 0.5 });

  edu.visible = true;
  edu.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
        color: 0xff0000,
      });
    }
  });

  scene3.add(edu);
});

// Sizes and Cameras
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera0 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera0.position.z = 5;
scene0.add(camera0);

const canvas0 = document.querySelector(".webgl");
const renderer0 = new THREE.WebGLRenderer({ canvas: canvas0 });
renderer0.setSize(sizes.width, sizes.height);
renderer0.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera3 = new THREE.PerspectiveCamera(45, 1); // Aspect ratio 1 300x300 canvas
camera3.position.z = 5;
scene3.add(camera3);

const canvas3 = document.querySelector(".webgl2");
const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3, alpha: true });
const smallSize = 300;
renderer3.setSize(smallSize, smallSize);
renderer3.setPixelRatio(1); // Lower pixel ratio for small canvas saves GPU

// Setup OrbitControls
function setupControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.1;
  controls.enableZoom = false;
  controls.enablePan = false;
  return controls;
}

const controls0 = setupControls(camera0, canvas0);
const controls3 = setupControls(camera3, canvas3);

function animate() {
  requestAnimationFrame(animate);

  // Subtle animation of particles z-position
  particles.position.z += 0.001;
  if (particles.position.z > 2) particles.position.z = 1.5;

  renderer0.render(scene0, camera0);
  renderer3.render(scene3, camera3);

  controls0.update();
  controls3.update();
}
animate();

function onClick(event) {
  const rect = canvas3.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera3);
  if (edu) {
    const intersects = raycaster.intersectObject(edu, true);
    if (intersects.length > 0) {
      window.location.href = "index.html";
    }
  }
}
window.addEventListener("click", onClick);

