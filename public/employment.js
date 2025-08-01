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

// Particle setup (orange particles)
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const color = new THREE.Color(1, 0.5, 0);
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
camera2.position.z = 3;
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

// Multiple point lights 
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

// Post-processing with outline effect on scene2
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

// Load brain model with userData
let brain;
const loader = new GLTFLoader();
loader.load("MiINDAI4.glb", (gltf) => {
  brain = gltf.scene;
  addOutlineObject(brain);
  brain.rotation.y = Math.PI / 2;
  brain.position.set(0, 0, 0);

  gsap.timeline({ defaults: { duration: 1 } }).fromTo(brain.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });

  brain.visible = true;

  brain.traverse((child) => {
    if (child.isMesh) {
      // Assign userData
      if (child.name === "Frontal") {
        child.userData = {
          description: "AI is transforming the way businesses make critical hiring and workforce decisions, drawing inspiration from the executive functions of the brain’s frontal lobe. With AI now at the core of candidate screening and workforce analytics, organizations sharpen their focus on efficiency and accuracy in talent management.",
          imageURL: "Employment_frontal.jpeg",
          nameobject: "AI & Decision-Making in Employment",
          braindescript: "In 2025, 40% of employers plan to use AI for automating repetitive recruitment tasks, enabling HR teams to focus on strategic work.",
          braindescript1: "AI-powered platforms like Unilever’s hiring system have reduced candidate screening time by 75% through automated assessments.",
        };
      } else if (child.name === "Parietal") {
        child.userData = {
          description: "Just as the parietal lobe interprets sensory input, AI systems process vast data to spot workforce trends and skill gaps. Businesses use AI tools to identify employees’ strengths and recommend reskilling, helping teams stay agile in a changing market.",
          imageURL: "Employment_parietal.jpeg",
          nameobject: "AI & Workforce Adaptability",
          braindescript: "Over 65% of companies now use AI-driven tools to map workforce skills and personalize training by 2025.",
          braindescript1: "Studies show organizations using adaptive AI for workforce planning report a 30% reduction in talent shortages.",
        };
      } else if (child.name === "Temporal") {
        child.userData = {
          description: "Mimicking the temporal lobe’s role in language and memory, AI now augments communication in the workplace. From real-time language translation to AI assistants managing scheduling, employers harness these tools to bridge gaps in global and diverse teams.",
          imageURL: "Employment_temporal.jpeg",
          nameobject: "AI & Communication Skills",
          braindescript: "AI-powered chatbots resolve up to 60% of candidate queries during recruitment, increasing HR productivity.",
          braindescript1: "Real-time AI transcription and translation tools are now standard in 56% of multinational companies.",
        };
      } else if (child.name === "Occipital") {
        child.userData = {
          description: "Drawing inspiration from the occipital lobe, which processes visual input, AI analyzes video interviews and digital portfolios. Algorithms now assess facial cues, visual portfolios, and digital presence, ensuring a broader perspective in hiring.",
          imageURL: "Employment_occipital.jpeg",
          nameobject: "AI & Visual Analysis in Recruitment",
          braindescript: "Tools like HireVue assess candidates’ body language with 83% accuracy during video screenings.",
          braindescript1: "Recent research suggests AI-based portfolio analysis doubled interview rates for creative roles in 2025.",
        };
      } else if (child.name === "Cerebellum") {
        child.userData = {
          description: "AI, like the cerebellum’s role in coordination, synchronizes human and machine workforces. New technologies distribute routine tasks to automation, letting people focus on creativity and strategy.",
          imageURL: "Employment_cerebellum.jpeg",
          nameobject: "AI & Coordination of Human-Machine Teams",
          braindescript: "In 2025, AI is expected to displace 9 million jobs but create 11 million new roles focused on advanced skills.",
          braindescript1: "Demand for roles such as AI Prompt Engineer grew by 130% YoY, reflecting a shift toward hybrid human-AI teams.",
        };
      } else if (child.name === "Brainstem") {
        child.userData = {
          description: "AI automates vital “backbone” tasks of employment, mirroring the brainstem’s regulation of basic functions. Tools streamline interviewing, onboarding, and compliance, freeing human capital for innovation.",
          imageURL: "Employment_brainstem.jpeg",
          nameobject: "AI & Essential Operations",
          braindescript: "AI-driven platforms reduce time-to-hire by 60% through automated candidate assessments and scheduling.",
          braindescript1: "HR departments using AI for case management report a 35% improvement in workflow efficiency.",
        }      
      } else if (child.name === "Hippocampus") {
        child.userData = {
          description: "AI’s capacity for continuous learning is akin to the hippocampus forming new memories. In the workplace, machine learning personalizes upskilling and predicts future workforce needs.",
          imageURL: "Employment_hippocampus.jpeg",
          nameobject: "AI, Employment & Learning",
          braindescript: "Companies investing in AI-led learning platforms see employee retention rates rise by 24%.",
          braindescript1: "Over 70% of large enterprises offer AI-enhanced upskilling pathways, preparing staff for tomorrow’s jobs.",
        }
      } else if (child.name === "BasalGanglia") {
        child.userData = {
          description: "Just as the basal ganglia automate habitual actions, AI automates repetitive roles—shifting employees to more valuable tasks that require critical thinking and adaptability.",
          imageURL: "Employment_ganglia.jpeg",
          nameobject: "AI & Automation of Routine Work",
          braindescript: "About 47% of routine clerical positions are now at least partially automated in 2025.",
          braindescript1: "Employee satisfaction increased by 18% in firms where AI took over mundane tasks, freeing workers for creative contributions.",
        }
      } else if (child.name === "Limbic") {
        child.userData = {
          description: "AI also recognizes and responds to emotions, supporting well-being initiatives through sentiment analysis and mental health monitoring. This mirrors the limbic system’s role in emotion and motivation.",
          imageURL: "Employment_limbic.jpeg",
          nameobject: "AI, Emotion & Workplace Well-being",
          braindescript: "Sentiment AI tools help employers spot employee burnout, reportedly reducing turnover by up to 22%.",
          braindescript1: "AI-enabled mental health platforms are used by 38% of Fortune 500 firms to offer real-time wellness support.",
        }
      } else if (child.name === "Nucleus") {
        child.userData = {
          description: "The nucleus signifies the core of workplace change driven by AI: efficiency, innovation, and new job categories. Strategic use of AI ensures companies not only survive, but thrive through ethical and human-centered adoption.",
          imageURL: "Employment_nucleus.jpeg",
          nameobject: "AI-Powered Strategic Transformation",
          braindescript: "Despite automation, 86% of employers say “human” skills—creativity, empathy, leadership—are more valued than ever.",
          braindescript1: "AI-powered workforce strategies are central to the competitiveness of 92% of leading businesses in 2025.",
        }
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

// Interaction Handlers for pointer move and click
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
    modelNameElement.textContent = "AI Employment";
    modelDescElement.textContent = "Bringing it all together! AI is a powerful force affecting every sector in the world. Just as the brain’s parts connect, AI integrates across industries—healthcare, finance, education, transportation, and employment—to improve efficiency, support better decisions, and create new opportunities. This brain-inspired view shows how AI is shaping society’s future by impacting all key economic areas in a unified way.";
    modelbrainDescElement.textContent = "Only time will tell how AI will continue to evolve and impact our lives.";
    modelbrainDesc1Element.textContent = "AI will probably most likely lead to the end of the world, but in the meantime, there'll be great companies. - Sam Altman (CEO of OpenAI)";
    modelImageElement.src = "AI_Finance.jpeg";   
      modelImageElement.src = "Employment.jpeg";
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
