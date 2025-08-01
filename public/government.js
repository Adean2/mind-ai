import "./mindbg.css";
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";

// Cached DOM elements for info display
const backgroundBox = document.getElementById("object");
const modelNameElement = document.getElementById("modelName");
const modelDescElement = document.getElementById("modelDescription");
const modelbrainDescElement = document.getElementById("brainconnection");
const modelbrainDesc1Element = document.getElementById("brainconnection1");
const modelpageDescElement = document.getElementById("pageDescription");
const modelImageElement = document.getElementById("modelImage");

// Globals and constants
const scenes = [];
let objectsToOutline = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Helper to update outline selected objects
function addOutlineObject(object) {
  objectsToOutline = [object];
  outlinePass.selectedObjects = objectsToOutline;
}

// Scene setup
const scene0 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
scenes.push(scene0, scene2, scene3);

// Particle setup (white particles)
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const color = new THREE.Color(1, 1, 1);
const particlesMaterial = new THREE.PointsMaterial({
  color,
  size: 0.02,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene0.add(particles);

// Cameras setup
const sizes = { width: window.innerWidth, height: window.innerHeight };

const camera0 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera0.position.z = 5;
scene0.add(camera0);

const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera2.position.z = 1;
scene2.add(camera2);

const camera3 = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera3.position.z = 5;
scene3.add(camera3);

// Renderers with capped pixel ratio
const canvas0 = document.querySelector(".webgl");
const renderer0 = new THREE.WebGLRenderer({ canvas: canvas0 });
renderer0.setSize(sizes.width, sizes.height);
renderer0.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const canvas1 = document.querySelector(".webgl1");
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1, alpha: true });
renderer1.setSize(sizes.width, sizes.height);
renderer1.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const canvas3 = document.querySelector(".webgl2");
const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3, alpha: true });
renderer3.setSize(300, 300);
renderer3.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// OrbitControls setup
const controls = new OrbitControls(camera0, canvas0);
controls.enableDamping = true;
controls.autoRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.dampingFactor = 0.05;
controls.autoRotateSpeed = 0.1;

const controls1 = new OrbitControls(camera2, canvas1);
controls1.enableDamping = true;
controls1.enableZoom = false;
controls1.enablePan = false; // auto-rotate particles scene


const controls2 = new OrbitControls(camera3, canvas3);
controls2.enableDamping = true;
controls2.autoRotate = true;
controls2.enableZoom = false;
controls2.enablePan = false;
controls2.dampingFactor = 0.05;

// Lighting setup for scene2
scene2.add(new THREE.AmbientLight(0xffffff, 5));

// Add multiple point lights using a loop
[
  { position: [0, -5, 2], intensity: 10 },
  { position: [5, 0, 1], intensity: 3 },
  { position: [-5, 0, 0], intensity: 3 },
  { position: [0, 0, -5], intensity: 5 },
  { position: [0, 0, 7], intensity: 0.5 },
].forEach(({ position, intensity }) => {
  const light = new THREE.PointLight(0xffffff, intensity, 10);
  light.position.set(...position);
  scene2.add(light);
});

const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.castShadow = true;
spotLight.position.set(0, 10, 0);
scene2.add(spotLight);

// Postprocessing composer and outlinePass for scene2
const composer = new EffectComposer(renderer1);
composer.addPass(new RenderPass(scene2, camera2));

const outlinePass = new OutlinePass(
  new THREE.Vector2(sizes.width, sizes.height),
  scene2,
  camera2
);
outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 0.3;
outlinePass.visibleEdgeColor.set(color);
composer.addPass(outlinePass);

// Load brain model with userData assignment
let brain;
const loader = new GLTFLoader();
loader.load("Government_Nucleus.glb", (gltf) => {
  brain = gltf.scene;
  addOutlineObject(brain);
  brain.position.set(0, 0, 0);


  gsap.timeline({ defaults: { duration: 1 } }).fromTo(brain.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });

  brain.visible = true;

  brain.traverse((child) => {
    if (child.isMesh) {
      // userData assignments as original
      if (child.name === "Current") {
        child.userData = {
          description: "AI technologies in government analyze large social and economic data sets to support evidence-based policymaking, streamline public service delivery, and improve decision-making quality. Tools like natural language processing speed up the review and synthesis of legislative and policy documents.",
          imageURL: "Goverment_current.jpeg",
          nameobject: "Current state",
          braindescript: "AI enables near real-time analysis of policy consultation submissions, making government responses more agile and informed.",
          braindescript1: "Federal and state governments are increasingly adopting AI to automate routine tasks and enhance service delivery efficiency.",
        };
      } else if (child.name === "Potential") {
        child.userData = {
          description: "Future AI systems promise deeper predictive analytics for social trends and resource allocation, enabling governments to make proactive, data-driven decisions that better meet citizens' needs. AI could enable hyper-personalized public services and more adaptive policy frameworks.",
          imageURL: "Goverment_potential.jpeg",
          nameobject: "Potential benefits",
          braindescript: "AI can forecast policy impacts across diverse population segments and regions, improving targeted program effectiveness.",
          braindescript1: "Advanced government AI platforms will link cross-sector data to address complex societal challenges holistically.",
        };
      } else if (child.name === "Ethical") {
        child.userData = {
          description: "Governments are already using AI for applications like real-time policy monitoring dashboards, public consultation analysis, fraud detection, and program evaluation, yielding measurable improvements. AI tools help identify policy risks and service bottlenecks early.",
          imageURL: "Goverment_Ethical.png",
          nameobject: "Ethical and social implications",
          braindescript: "Governments worldwide are developing ethical guidelines to govern AI use, prioritizing citizen rights and algorithmic fairness.",
          braindescript1: "Ethical use of AI in government is crucial to prevent misuse such as privacy violations or reinforcing biases.",
        };
      } else if (child.name === "Case") {
        child.userData = {
          description: "AI is already being used in education with promising results. Research and data gathering are important to fully understand the potential of AI in education.",
          imageURL: "Goverment_case.png",
          nameobject: "Case studies and research",
          braindescript: "AI-powered dashboards track the effectiveness of policies and service delivery in real-time.",
          braindescript1: "Public agencies leverage AI to analyze thousands of stakeholder inputs quickly, shaping more responsive policies.",
        };
      } else if (child.name === "Conclusion") {
        child.userData = {
          description: "AI is transforming government functions, enhancing policy development, implementation, and evaluation, while demanding careful management of risks. Responsible adoption can help build governments that are more efficient, responsive, and equitable.",
          imageURL: "Goverment_conclusion.png",
          nameobject: "Conclusion",
          braindescript: "AI boosts policy cycle effectiveness from problem identification to impact assessment.",
          braindescript1: "Properly implemented AI fosters improved collaboration across government departments for holistic governance.",
        };
      } else if (child.name === "Developing_tech") {
        child.userData = {
          description: "Cutting-edge AI solutions in government include real-time data aggregation, smart resource allocation algorithms, and AI-assisted legislative drafting and impact analysis. These technologies aim to modernize government operations and optimize social outcomes.",
          imageURL: "Goverment_developing.jpeg",
          nameobject: "Developing Technology",
          braindescript: "AI-assisted tools are increasingly used to draft and refine policy documents using natural language generation.",
          braindescript1: "Emerging AI systems integrate multi-source data to optimize resource distribution and program effectiveness dynamically.",
        };
      }
    }
  });

  scene2.add(brain);

  function animateBrain() {
    function animate() {
      composer.render();
      requestAnimationFrame(animate);
      if (brain) brain.rotation.y -= 0.0009;
      controls1.update();
    }
    animate();
  }
  animateBrain();
});

// Load logo model in scene3
let edu;
const loader10 = new GLTFLoader();
loader10.load("text.glb", (gltf) => {
  edu = gltf.scene;
  edu.position.y = 1.1;
  gsap.timeline({ defaults: { duration: 1 } }).fromTo(edu.scale, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.5, z: 0.5 });
  edu.visible = true;
  edu.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshNormalMaterial({
        visible: true,
        side: THREE.DoubleSide,
        color: 0xff0000,
      });
    }
  });
  scene3.add(edu);
});

// Animation loop for scenes 0 and 3 plus controls updates
function animate() {
  particles.position.z = 1.5;
  requestAnimationFrame(animate);
  renderer0.render(scene0, camera0);
  renderer3.render(scene3, camera3);
  controls.update();
  controls2.update();
}
animate();

// Interaction handlers
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
    const { nameobject, imageURL, description, braindescript, braindescript1, page } = intersectObject.userData;
    modelNameElement.textContent = nameobject || "";
    modelImageElement.src = imageURL || "";
    modelDescElement.textContent = description || "";
    modelbrainDescElement.textContent = braindescript || "";
    modelbrainDesc1Element.textContent = braindescript1 || "";
    modelpageDescElement.textContent = page || "";
    backgroundBox.classList.remove("hidden");
  } else {
    objectsToOutline = [];
    outlinePass.selectedObjects = objectsToOutline;
    modelNameElement.textContent = "AI Government";
    modelDescElement.textContent ="The nucleus regulates basic functions like sleep and appetite in the human brain. In AI for government, it symbolizes advanced technologies that analyze social and economic data to predict trends, improve policy-making, and optimize resource allocation, much like the nucleus manages essential life processes.";
    modelbrainDescElement.textContent = "Machine learning helps governments forecast social and economic trends by analyzing vast datasets, supporting more informed and proactive policy decisions.";
    modelbrainDesc1Element.textContent = "AI-driven governance tools enable real-time monitoring and adjustment of policies, improving resource distribution and responsiveness to societal needs.";
    modelImageElement.src = "Goverment_council.png";
    backgroundBox.classList.add("hidden");
  }
}

function onClick(event) {
  const rect = canvas3.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera3);
  if (edu) {
    const intersects = raycaster.intersectObject(edu, true);
    if (intersects.length > 0) {
      window.location.href = "index.html"; // navigate to another page
    }
  }
}

// Register event listeners
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onClick);

// Window resize handler
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
