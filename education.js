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

// Particle setup (green particles)
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 0.02,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene0.add(particles);

// Cameras for each scene - sized once
const sizes = { width: window.innerWidth, height: window.innerHeight };

const camera0 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera0.position.z = 5;
scene0.add(camera0);

const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera2.position.z = 2.5;
scene2.add(camera2);

const camera3 = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera3.position.z = 5;
scene3.add(camera3);

// Renderers with pixel ratio capped at 2 for performance
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

// Orbit Controls for each camera + canvas with consistent options
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

const pointLights = [
  { position: [0, -5, 2], intensity: 10 },
  { position: [5, 0, 1], intensity: 3 },
  { position: [-5, 0, 0], intensity: 3 },
  { position: [0, 0, -5], intensity: 5 },
  { position: [0, 0, 7], intensity: 0.5 },
];

pointLights.forEach(({ position, intensity }) => {
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
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene2,
  camera2
);
outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 0.3;
outlinePass.visibleEdgeColor.set("#00ff00");
composer.addPass(outlinePass);

// Load brain model with userData assignment
let brain;
const loader = new GLTFLoader();
loader.load("EducationHippo.glb", (gltf) => {
  brain = gltf.scene;
  addOutlineObject(brain);
  brain.rotation.y = Math.PI / 2;
  brain.position.set(0, -0.5, 0);

  gsap.timeline({ defaults: { duration: 1 } }).fromTo(brain.scale, { x: 0, y: 0, z: 0 }, { x: 2, y: 2, z: 2 });

  brain.visible = true;

  brain.traverse((child) => {
    if (child.isMesh) {
      // Assign userData exactly as original
      if (child.name === "Current") {
        child.userData = {
          description: "AI is transforming education by developing personalized learning algorithms that tailor instruction to individual student needs, enhancing memory and learning outcomes. Adaptive learning platforms analyze student performance and adjust content in real time to optimize engagement and understanding.",
          imageURL: "Education_current.png",
          nameobject: "Current state of AI education",
          braindescript: "AI-driven personalized learning improves student retention and engagement by 20-30% compared to traditional methods.",
          braindescript1: "Leading AI platforms like Carnegie Learning and Century Tech power adaptive education in many schools worldwide.",
        };
      } else if (child.name === "Potential") {
        child.userData = {
          description: "Future AI education systems will offer hyper-personalized learning experiences that dynamically adapt to students' cognitive styles, emotional states, and progress. AI could predict learning challenges early and recommend customized interventions that maximize mastery and motivation.",
          imageURL: "Education_potential.jpeg",
          nameobject: "Potential benefits",
          braindescript: "AI may integrate emotion detection and learning style analysis to adjust teaching strategies on the fly.",
          braindescript1: "Personalized AI tutors and virtual learning environments will support lifelong learning across educational stages.",
        };
      } else if (child.name === "Ethical") {
        child.userData = {
          description: "AI in education raises important issues of student data privacy, algorithmic bias, and the balance between automation and human teaching. Establishing ethical guidelines and transparency is essential to protect students and maintain trust in AI-enabled learning.",
          imageURL: "Education_ethical.png",
          nameobject: "Ethical and social implications",
          braindescript: "Schools must safeguard sensitive student information and ensure AI systems are free from bias that may affect learning equity.",
          braindescript1: "Human oversight remains crucial to complement AI-driven recommendations and preserve the teacher-student relationship.",
        };
      } else if (child.name === "Case") {
        child.userData = {
          description: "AI applications in education include real-time assessment, intelligent tutoring systems, and AI-powered content delivery that enhance memory formation and skill acquisition. Projects like Alpha School demonstrate the effectiveness of AI in personalized, project-based education.",
          imageURL: "Education_case.png",
          nameobject: "Case studies and research",
          braindescript: "AI tutoring systems provide instant feedback and targeted practice, accelerating student progress.",
          braindescript1: "Personalized learning platforms reduce teacher workload by automating grading and lesson planning.",
        };
      } else if (child.name === "Conclusion") {
        child.userData = {
          description: "AI is revolutionizing education by creating highly personalized, effective learning environments that improve outcomes and teacher efficiency. Responsible AI integration will help maximize benefits while addressing ethical and practical challenges.",
          imageURL: "Education_conclusion.png",
          nameobject: "Conclusion",
          braindescript: "AI-enabled learning boosts both student achievement and teacher capacity for individualized attention.",
          braindescript1: "Collaboration between AI developers and educators is key to ethical, impactful educational innovation.",
        };
      } else if (child.name === "Developing_tech") {
        child.userData = {
          description: "Emerging AI technologies in education include adaptive content delivery, predictive learning analytics, and AI-driven mind mapping tools that organize knowledge visually to strengthen memory. These innovations aim to make education more engaging, accessible, and tailored.",
          imageURL: "Education_developing.png",
          nameobject: "Developing Technology",
          braindescript: "AI-powered mind mapping helps students visualize complex topics and enhance long-term retention.",
          braindescript1: "Real-time predictive analytics guide personalized learning paths and identify knowledge gaps early.",
        };
      }
    }
  });

  scene2.add(brain);
  animateBrain();
});

function animateBrain() {
  function animate() {
    composer.render();
    requestAnimationFrame(animate);
    if (brain) brain.rotation.y -= 0.0005;
    controls1.update();
  }
  animate();
}

// Load Logo (scene3)
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

// Animation loop for scenes 0 and 3, plus controls updates
function animate() {
  particles.position.z = 1.5;
  requestAnimationFrame(animate);
  renderer0.render(scene0, camera0);
  renderer3.render(scene3, camera3);
  controls.update();
  controls2.update();
}
animate();

// Interaction Handlers
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
    // Update model info elements from intersected object userData
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
    modelNameElement.textContent = "AI Education";
    modelDescElement.textContent =
      "The hippocampus is a crucial part of the human brain responsible for memory and learning. In AI education, the hippocampus can be linked to the development of personalized learning algorithms.";
    modelbrainDescElement.textContent =
      "learning systems can adapt to the individual student's pace and level of understanding, offering personalized feedback and support along the way. ";
    modelbrainDesc1Element.textContent =
      "With AI technology, students can study various courses and training programmes available around the world just by sitting at home. ";
    modelImageElement.src = "Education.png";
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
