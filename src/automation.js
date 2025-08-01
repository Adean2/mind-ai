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

// Particle setup (blue particles)
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0x0000ff,
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
controls1.enablePan = false;

const controls2 = new OrbitControls(camera3, canvas3);
controls2.enableDamping = true;
controls2.autoRotate = true;
controls2.enableZoom = false;
controls2.enablePan = false;
controls2.dampingFactor = 0.05;

// Lighting setup for scene2
scene2.add(new THREE.AmbientLight(0xffffff, 5));


// Postprocessing composer and outlinePass for scene2
const composer = new EffectComposer(renderer1);
composer.addPass(new RenderPass(scene2, camera2));

const outlinePass = new OutlinePass(new THREE.Vector2(sizes.width, sizes.height), scene2, camera2);
outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 0.3;
outlinePass.visibleEdgeColor.set("#0000ff");
composer.addPass(outlinePass);

// Load brain model with userData
let brain;
const loader = new GLTFLoader();
loader.load("Automation_BasalGanglia.glb", (gltf) => {
  brain = gltf.scene;
  addOutlineObject(brain);
  brain.position.set(0, 0, 0);

  gsap.timeline({ defaults: { duration: 1 } })
    .fromTo(brain.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });

  brain.visible = true;

  brain.traverse((child) => {
    if (child.isMesh) {
      if (child.name === "Current") {
        child.userData = {
          description: "AI-driven automation is rapidly transforming industries by handling repetitive, rule-based tasks with high efficiency. Robotics and machine learning systems are increasingly deployed in manufacturing, logistics, and administrative processes.",
          imageURL: "Automation_current.png",
          nameobject: "Current state",
          braindescript: "Over 60% of manufacturing companies globally have adopted some form of AI-powered automation for assembly lines or quality control.",
          braindescript1: "Robotic Process Automation (RPA) is now widely used in sectors like finance and customer service to manage high-volume, routine transactions.",
        };
      } else if (child.name === "Potential") {
        child.userData = {
          description: "The evolution of AI automation could lead to fully autonomous systems capable of learning and adapting to new tasks over time, boosting productivity and reducing human error. This shift will allow businesses to focus employees' efforts on innovation and strategy.",
          imageURL: "Automation_potential.png",
          nameobject: "Potential benefits",
          braindescript: "Next-generation AI robots are being designed to self-optimize workflows and learn new procedures with minimal human input.",
          braindescript1: "Automation is projected to create new roles in system supervision and AI management, offsetting some decreased demand for repetitive labor.",
        };
      } else if (child.name === "Ethical") {
        child.userData = {
          description: "Widespread automation powered by AI prompts ethical concerns about workforce displacement, decision accountability, and societal impacts. Transparent reskilling initiatives and oversight are crucial to mitigating negative effects.",
          imageURL: "Automation_ethical.png",
          nameobject: "Ethical and social implications",
          braindescript: "Studies highlight the need for ethical frameworks addressing fair labor practices and human oversight in automated systems.",
          braindescript1: "Many organizations are investing in upskilling and reskilling programs to help workers transition into new job categories.",
        };
      } else if (child.name === "Case") {
        child.userData = {
          description: "Industries are leveraging AI automation for tasks like sorting packages, assembling components, and handling customer inquiries with chatbots. These deployments demonstrate clear gains in consistency and productivity.",
          imageURL: "Automation_case.png",
          nameobject: "Case studies and research",
          braindescript: "E-commerce giants use AI-powered robots to process and ship orders from large warehouses with speed and accuracy.",
          braindescript1: "Automated customer service solutions reduce wait times and improve satisfaction by resolving common queries instantly.",
        };
      } else if (child.name === "Conclusion") {
        child.userData = {
          description: "AI-powered automation is streamlining business operations and improving efficiency but also reshaping job markets and required skills. Balancing technological advancement with social responsibility is key to sustainable growth.",
          imageURL: "Automation_conclusion.png",
          nameobject: "Conclusion",
          braindescript: "Effective adoption of AI automation can reduce operational costs by up to 30% in some industries.",
          braindescript1: "The most successful organizations combine automation with human expertise for optimal results and innovation.",
        };
      } else if (child.name === "Developing_tech") {
        child.userData = {
          description: "Emerging automation technologies include collaborative robots (“cobots”), advanced machine vision for quality inspection, and AI-driven adaptive scheduling systems. These tools are making automation smarter, safer, and more flexible.",
          imageURL: "Automation_developing.png",
          nameobject: "Developing Technology",
          braindescript: "Cobots are designed to work safely alongside humans, learning from human behavior to refine their functions.",
          braindescript1: "AI-based quality control systems now use deep learning to identify defects in real time, reducing waste and improving product standards.",
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

// Load logo model in scene3
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
    modelNameElement.textContent = "AI Automation";
    modelDescElement.textContent = "The basal ganglia, a key part of the brain that controls movement and habits, relates to AI automation through robotics and autonomous systems. These AI technologies use machine learning to handle repetitive tasks precisely and efficiently, allowing humans to focus on more complex, creative work.";
    modelbrainDescElement.textContent = "The basal ganglia inspire AI models that control movement and decision-making, essential for robots to perform repetitive tasks precisely.";
    modelbrainDesc1Element.textContent ="AI uses reinforcement learning, like the basal ganglia, to improve automation by learning from trial and error.";   
    modelImageElement.src = "Automation.webp";
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
