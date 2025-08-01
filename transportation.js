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

// Particle setup (orange-ish particles)
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const color = new THREE.Color(0.9, 0.5, 0);
const particlesMaterial = new THREE.PointsMaterial({
  color,
  size: 0.02,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene0.add(particles);

// Camera setup
const sizes = { width: window.innerWidth, height: window.innerHeight };

const camera0 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera0.position.z = 5;
scene0.add(camera0);

const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera2.position.z = 1.3;
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

// Orbit Controls setup
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
controls1.enablePan = false;

const controls2 = new OrbitControls(camera3, canvas3);
controls2.enableDamping = true;
controls2.autoRotate = true;
controls2.enableZoom = false;
controls2.enablePan = false;
controls2.dampingFactor = 0.05;

// Lighting setup for scene2
scene2.add(new THREE.AmbientLight(0xffffff, 5));

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

const outlinePass = new OutlinePass(new THREE.Vector2(sizes.width, sizes.height), scene2, camera2);
outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 0.3;
outlinePass.visibleEdgeColor.set(color);
composer.addPass(outlinePass);

// Load brain model with userData
let brain;
const loader = new GLTFLoader();
loader.load("Transportation_Cerebellum.glb", (gltf) => {
  brain = gltf.scene;
  addOutlineObject(brain);
  brain.position.set(0, 0, 0);

  gsap.timeline({ defaults: { duration: 1 } }).fromTo(brain.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });

  brain.visible = true;

  brain.traverse((child) => {
    if (child.isMesh) {
      // Assign userData based on child names
      if (child.name === "Current") {
        child.userData = {
          description:
            "AI is actively transforming transportation by streamlining operations, improving route optimization, and supporting safety systems in both passenger and freight sectors. Machine learning algorithms now power predictive maintenance and help process vast amounts of real-time data from vehicles and infrastructure.",
          imageURL: "Transportation_current.png",
          nameobject: "Current state",
          braindescript:
            "Over 40% of transportation and warehousing businesses in the U.S. now use AI for data analytics or optimization tasks.",
          braindescript1:
            "Advanced Driver Assistance Systems (ADAS) powered by AI are becoming standard across many new vehicle models to increase safety.",
        };
      } else if (child.name === "Potential") {
        child.userData = {
          description:
            "Looking forward, AI promises a future of widespread autonomous vehicles and highly adaptive traffic ecosystems. These advancements could lead to safer streets, more sustainable mobility, and highly individualized transportation options driven by real-time data.",
          imageURL: "Transportation_potential.png",
          nameobject: "Potential benefits",
          braindescript:
            "Edge AI chips and supercomputers are being built into vehicles, enabling millisecond decision-making for autonomous driving.",
          braindescript1:
            "Emerging Vehicle-to-Everything (V2X) communication will let vehicles interact seamlessly with infrastructure, pedestrians, and each other to prevent accidents.",
        };
      } else if (child.name === "Ethical") {
        child.userData = {
          description:
            "Deploying AI in transportation raises critical ethical questions about safety, accountability, privacy, and workforce displacement. Ensuring fairness, explainability, and transparency in AI decision-making is a top priority for regulators and tech companies.",
          imageURL: "Transportation_ethical.png",
          nameobject: "Ethical and social implications",
          braindescript:
            "Governments and companies are increasingly prioritizing ethical frameworks for AI deployment, including data privacy and risks related to algorithmic bias.",
          braindescript1:
            "Ethical AI implementation is considered paramount by industry leaders, shaping R&D and regulatory approaches.",
        };
      } else if (child.name === "Case") {
        child.userData = {
          description:
            "AI is producing real-world benefits with active use cases in logistics, fleet management, and public transportation. From drowsiness detection for drivers to automated last-mile delivery robots, AI’s applications are broad and measurable.",
          imageURL: "Transportation_case.png",
          nameobject: "Case studies and research",
          braindescript: "Major logistics companies like Amazon and FedEx are deploying autonomous robots and drones for efficient package delivery.",
          braindescript1: "AI-powered drowsiness detection systems are already reducing accident risks among commercial drivers.",
        };
      } else if (child.name === "Conclusion") {
        child.userData = {
          description:
            "AI is revolutionizing transportation, delivering measurable improvements in safety, efficiency, and environmental impact while posing new challenges that require careful, collaborative stewardship. Embracing responsible AI adoption helps unlock future growth in global mobility.",
          imageURL: "Transportation_conclusion.png",
          nameobject: "Conclusion",
          braindescript: "AI-driven predictive analytics can now help prevent vehicle breakdowns, avoiding costly delays and improving efficiency.",
          braindescript1: "Cities with AI-based traffic management systems show significant reductions in congestion, enhancing urban mobility.",
        };
      } else if (child.name === "Developing_tech") {
        child.userData = {
          description:
            "Key innovations shaping the future of AI in transportation include predictive maintenance, cooperative vehicle systems, and autonomous driving technologies. Robust AI platforms are enabling scalable, adaptive systems that evolve in real-time with traffic and network conditions.",
          imageURL: "Transportation_developing.png",
          nameobject: "Developing Technology",
          braindescript: "Predictive maintenance, guided by telematics and AI, enables real-time health monitoring of vehicles and reduces repair costs.",
          braindescript1: "AI-powered traffic and routing algorithms now synthesize live variables (including weather and driver behavior) to dynamically suggest optimal routes for fleets.",
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

// Load logo model (scene3)
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
    modelNameElement.textContent = "AI Transportation";
    modelDescElement.textContent =
      "The cerebellum controls movement and balance in the human brain. In AI-powered transportation, it represents technologies that help vehicles safely navigate roads and quickly adapt to changing conditions—just as the cerebellum keeps us steady and coordinated.";
      modelbrainDescElement.textContent =
      "AI is transforming transportation by enhancing safety, efficiency, and sustainability. From self-driving cars to smart traffic management, AI technologies are reshaping how we move around the world.";
      modelbrainDesc1Element.textContent =
      "Modern AI transportation technologies can detect obstacles, read traffic signals, and adjust speed automatically—helping vehicles achieve balance and coordination on the road.";
    modelImageElement.src = "Transportation.png";
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
