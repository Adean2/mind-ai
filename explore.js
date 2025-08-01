import "./explore.css";
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";

// Globals for raycasting and outlines
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let objectsToOutline = [];

// Cached DOM elements for info display
const backgroundBox = document.getElementById("object");
const modelNameElement = document.getElementById("modelName");
const modelDescElement = document.getElementById("modelDescription");
const modelImageElement = document.getElementById("modelImage");

// Scene & Cameras
const scene0 = new THREE.Scene();   // Background particles scene
const scene2 = new THREE.Scene();   // Brain model scene

const sizes = { width: window.innerWidth, height: window.innerHeight };

const camera0 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 5000);
camera0.position.z = 5;
scene0.add(camera0);

const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1,5000);
camera2.position.z = 5;
scene2.add(camera2);

// Renderer setups
const canvas0 = document.querySelector(".webgl");
const renderer0 = new THREE.WebGLRenderer({ canvas: canvas0, antialias: false });
renderer0.setSize(sizes.width, sizes.height);
renderer0.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const canvas1 = document.querySelector(".webgl1");
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1, alpha: true, antialias: true });
renderer1.setSize(sizes.width, sizes.height);
renderer1.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enable shadows with limited resolution for renderer1
renderer1.shadowMap.enabled = true;
renderer1.shadowMap.type = THREE.PCFSoftShadowMap;
renderer1.shadowMap.width = 512;
renderer1.shadowMap.height = 512;

// Particles in scene0

const particleCount = 1000; // Reduce particles count for performance
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// fixed color for stability and performance
const PARTICLE_COLOR = "#ff8500"; 

const particlesMaterial = new THREE.PointsMaterial({
  color: PARTICLE_COLOR,
  size: 0.02,
  sizeAttenuation: true,
  depthWrite: false,
  transparent: true,
  opacity: 0.7,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.matrixAutoUpdate = false; // Disable matrix updates since static
particles.updateMatrix();
scene0.add(particles);

//Helper function to update outlined objects

function addOutlineObject(object) {
  objectsToOutline = [object];
  outlinePass.selectedObjects = objectsToOutline;
}

// Brain parts userData map
const brainPartsData = {
  Frontal: {
    description:
      "The frontal lobe is the largest region of the brain's cortex, responsible for executive functions, decision-making, and motor control.",
    imageURL: "/HumanBrain.png",
    objecturl: "finance.html",
    nameobject: "Frontal Lobe",
  },
  Brainstem: {
    description:
      "The brainstem regulates vital functions such as breathing, heart rate, and consciousness.",
    imageURL: "/Brainstem.png",
    objecturl: "healthcare.html",
    nameobject: "Brainstem",
  },
  Cerebellum: {
    description:
      "The cerebellum coordinates motor movements, balance, posture, and some cognitive functions.",
    imageURL: "/Cerebellum.png",
    objecturl: "transportation.html",
    nameobject: "Cerebellum",
  },
  Occipital: {
    description:
      "The occipital lobe processes visual information from the eyes.",
    imageURL: "/Occipital_Lobe.png",
    objecturl: "entertainment.html",
    nameobject: "Occipital Lobe",
  },
  Temporal: {
    description:
      "The temporal lobe processes auditory info, memory, and facial recognition.",
    imageURL: "/Temporal.png",
    objecturl: "customerservice.html",
    nameobject: "Temporal Lobe",
  },
  Hippocampus: {
    description:
      "The hippocampus is responsible for new memory formation and spatial navigation.",
    imageURL: "/Hippocampus.png",
    objecturl: "education.html",
    nameobject: "Hippocampus",
  },
  BasalGanglia: {
    description:
      "The basal ganglia are involved in motor control, learning, emotion and voluntary movement.",
    imageURL: "/Basal_Ganglia.png",
    objecturl: "automation.html",
    nameobject: "Basal Ganglia",
  },
  Limbic: {
    description:
      "The limbic system handles emotion, motivation, memory, and learning.",
    imageURL: "/Limbic_System.png",
    objecturl: "employment.html",
    nameobject: "Limbic System",
  },
  Nucleus: {
    description:
      "The nucleus contains genetic material controlling cellular functions.",
    imageURL: "/Limbic_System.png",
    objecturl: "government.html",
    nameobject: "Nucleus",
  },
  Parietal: {
    description:
      "The parietal lobe processes sensory info and spatial awareness.",
    imageURL: "/PARIETAL.png",
    objecturl: "security.html",
    nameobject: "Parietal Lobe",
  },
};

//Load Brain Model for scene2

const loader = new GLTFLoader();
let brain;

loader.load("MiINDAI4.glb", (gltf) => {
  brain = gltf.scene;
  brain.rotation.y = Math.PI / 2;
  brain.position.y = 0.9;

  gsap.timeline()
    .fromTo(brain.scale, { x: 0, y: 0, z: 0 }, { x: 1.4, y: 1.4, z: 1.4 })
    .fromTo("nav", { y: "-100%" }, { y: "0%" })
    .fromTo(".back", { opacity: 0 }, { opacity: 1 });

  brain.visible = true;

  // Set user data and shadows once after loading
  brain.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (brainPartsData[child.name]) {
        child.userData = brainPartsData[child.name];
      }
    }
  });

  scene2.add(brain);

  // Lighting setup
  scene2.add(new THREE.AmbientLight(0xffffff, 5)); // Lower intensity

  //lights and shadow casts
  [
    { position: [0, -5, 2], intensity: 3 },
    { position: [5, 0, 1], intensity: 2 },
    { position: [-5, 0, 0], intensity: 2 },
  ].forEach(({ position, intensity }) => {
    const light = new THREE.PointLight(0xffffff, intensity, 50);
    light.position.set(...position);
    scene2.add(light);
  });

  // Single spotlight
  const spotLight = new THREE.SpotLight(0xffffff, 3);
  spotLight.castShadow = true;
  spotLight.position.set(0, 10, 10);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.3;
  spotLight.decay = 2;
  spotLight.distance = 50;
  scene2.add(spotLight);

  // Brain rotation animation
  function animateBrain() {
    requestAnimationFrame(animateBrain);
    brain.rotation.y -= 0.001;
  }
  animateBrain();
});

//Orbit Controls

const controls = new OrbitControls(camera0, canvas0);
controls.enableDamping = true;
controls.autoRotate = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.dampingFactor = 0.05;
controls.autoRotateSpeed = 0.1;

const controls1 = new OrbitControls(camera2, canvas1);
controls1.enableDamping = true;
controls1.enableZoom = true;
controls1.enablePan = false;
controls1.minDistance = 4.5;
controls1.maxDistance = 6;

//Post-processing with outline effect

const composer = new EffectComposer(renderer1);
composer.addPass(new RenderPass(scene2, camera2));

const outlinePass = new OutlinePass(
  new THREE.Vector2(sizes.width, sizes.height),
  scene2,
  camera2
);
outlinePass.edgeStrength = 10;
outlinePass.edgeGlow = 0.1;
outlinePass.visibleEdgeColor.set("#df6b19");
composer.addPass(outlinePass);

//Animation loop optimized

function animate() {
  requestAnimationFrame(animate);

  // Render brain scene with post-processing
  composer.render();

  //static particle scene less frequently: update every 3 frames
  if (animate.frameCount === undefined) animate.frameCount = 0;
  animate.frameCount = (animate.frameCount + 1) % 3;
  if (animate.frameCount === 0) {
    renderer0.clear();
    renderer0.render(scene0, camera0);
  }

  // Update controls only if needed
  controls.update();
  controls1.update();
}
animate();

//Pointer move for highlighting with raycasting

function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera2);
  const intersects = raycaster.intersectObjects(scene2.children, true);

  if (intersects.length > 0) {
    const intersectObject = intersects[0].object;
    if (!objectsToOutline.includes(intersectObject)) {
      addOutlineObject(intersectObject);
    }

    const { nameobject = "", imageURL = "", description = "" } = intersectObject.userData || {};
    modelNameElement.textContent = nameobject;
    modelImageElement.src = imageURL;
    modelDescElement.textContent = description;
    backgroundBox.classList.remove("hidden");
  } else {
    objectsToOutline = [];
    outlinePass.selectedObjects = objectsToOutline;
    modelNameElement.textContent = "";
    modelImageElement.src = "";
    modelDescElement.textContent = "";
    backgroundBox.classList.add("hidden");
  }
}

//Click handler for redirection

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera2);
  const intersects = raycaster.intersectObjects(scene2.children, true);
  if (intersects.length > 0) {
    const url = intersects[0].object.userData?.objecturl;
    if (url) window.location.href = url;
  }
}

//Event listeners

window.addEventListener("pointermove", onPointerMove);
document.addEventListener("dblclick", onClick);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera0.aspect = sizes.width / sizes.height;
  camera0.updateProjectionMatrix();

  camera2.aspect = sizes.width / sizes.height;
  camera2.updateProjectionMatrix();

  renderer0.setSize(sizes.width, sizes.height);
  renderer1.setSize(sizes.width, sizes.height);
  composer.setSize(sizes.width, sizes.height);
});
