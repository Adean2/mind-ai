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

// Particle setup (magenta particles)
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xff00ff,
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
camera2.position.z = 2;
scene2.add(camera2);

const camera3 = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera3.position.z = 5;
scene3.add(camera3);

// Renderers with capped pixel ratio for performance
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

// OrbitControls setup for all cameras and canvases
const controls = new OrbitControls(camera0, canvas0);
controls.enableDamping = true;
controls.autoRotate = true;
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
scene2.add(new THREE.AmbientLight(0xffffff, 4));


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
outlinePass.visibleEdgeColor.set("#ff00ff");
composer.addPass(outlinePass);

// Load brain model with userData assignment
let brain;
const loader = new GLTFLoader();
loader.load("Security_Parietal.glb", (gltf) => {
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
          description: "Future AI systems will offer deeper insights into employee motivation and engagement, enabling predictive talent acquisition and personalized management. This can foster higher satisfaction and retention while proactively addressing workforce risks.",
          imageURL: "Security_current.png",
          nameobject: "Current state",
          braindescript: "Predictive analytics may forecast employee turnover and identify high-potential candidates more accurately.",
          braindescript1: "Advanced AI could tailor employee development programs dynamically, enhancing motivation and productivity.",

        };
      } else if (child.name === "Potential") {
        child.userData = {
          description: "Future AI systems will offer deeper insights into employee motivation and engagement, enabling predictive talent acquisition and personalized management. This can foster higher satisfaction and retention while proactively addressing workforce risks.",
          imageURL: "Security_potential.jpeg",
          nameobject: "Potential benefits",
          braindescript: "Predictive analytics may forecast employee turnover and identify high-potential candidates more accurately.",
          braindescript1: "Advanced AI could tailor employee development programs dynamically, enhancing motivation and productivity.",
        };
      } else if (child.name === "Ethical") {
        child.userData = {
          description: "AI in employment security raises important concerns about privacy, surveillance, and fairness. Ensuring transparent use, data protection, and unbiased algorithms is essential to maintain trust and protect employee rights.",
          imageURL: "Security_ethical.png",
          nameobject: "Ethical and social implications",
          braindescript: "Regulations increasingly require organizations to disclose AI usage in employee monitoring and secure consent.",
          braindescript1: "Ethical frameworks emphasize avoiding discrimination and ensuring equitable treatment in AI-driven hiring and evaluation.",

        };
      } else if (child.name === "Case") {
        child.userData = {
          description: "AI applications in security include automated background checks, behavioral risk assessment, and smart scheduling to reduce workplace stress. These have shown benefits in improving organizational safety and employee well-being.",
          imageURL: "Security_case.jpeg",
          nameobject: "Case studies and research",
          braindescript: "Some companies use AI to analyze communication patterns and detect signs of workplace harassment or dissatisfaction early.",
          braindescript1: "AI-driven scheduling tools optimize workloads to improve work-life balance and reduce burnout.",
        };
      } else if (child.name === "Conclusion") {
        child.userData = {
          description: "AI technologies linked to workforce security are transforming talent management by enhancing safety, effectiveness, and employee engagement. Responsible implementation is vital to balance organizational goals with employee rights.",
          imageURL: "Security_conclusion.png",
          nameobject: "Conclusion",
          braindescript: "Secure, AI-powered systems contribute to healthier workplace environments and more adaptive human resource strategies.",
          braindescript1: "Transparent policies and human oversight ensure AI tools support rather than undermine employee trust.",
        };
      } else if (child.name === "Developing_tech") {
        child.userData = {
          description: "Innovations include emotion recognition software, AI-powered talent matching platforms, and real-time workforce performance monitoring. These advances aim to make workforce management more responsive and human-centered.",
          imageURL: "Security_developing.png",
          nameobject: "Developing Technology",
          braindescript: "Emotion AI tools analyze facial expressions and voice tones to provide insights into employee morale in real time.",
          braindescript1: "AI-based platforms increasingly automate talent sourcing and candidate screening with higher accuracy and fairness.",
        };
      }
    }
  });

  scene2.add(brain);

  function animateBrain() {
    function animate() {
      composer.render();
      requestAnimationFrame(animate);
      if (brain) brain.rotation.y -= 0.0005;
      controls1.update();
    }
    animate();
  }
  animateBrain();
});

// Load Logo model (scene3)
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
    modelNameElement.textContent = "AI Security";
    modelDescElement.textContent = "The limbic system, which regulates emotions, motivation, and reward, relates to AI in employment through advanced workforce management and talent acquisition tools. These AI technologies analyze and predict employee behavior to improve satisfaction and organizational performance.";
    modelbrainDescElement.textContent = "AI tools inspired by the limbic system analyze employee emotions and engagement to enhance workforce productivity.";
    modelbrainDesc1Element.textContent = "Predictive analytics help companies identify high-potential talent and reduce turnover by understanding motivation patterns.";
    modelImageElement.src = "Security.png";
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
