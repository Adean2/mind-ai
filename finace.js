import "./mindbg.css";
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { DragControls } from "three/examples/jsm/Addons.js";

//Constants and Cached DOM Elements
const scenes = [];
let objectsToOutline = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const backgroundBox = document.getElementById("object");
const modelNameElement = document.getElementById("modelName");
const modelDescElement = document.getElementById("modelDescription");
const modelbrainDescElement = document.getElementById("brainconnection");
const modelbrainDesc1Element = document.getElementById("brainconnection1");
const modelpageDescElement = document.getElementById("pageDescription");
const modelImageElement = document.getElementById("modelImage");

function addOutlineObject(object) {
  objectsToOutline = [object];
  outlinePass.selectedObjects = objectsToOutline;
}

//Scene and Camera Setup
const sizes = { width: window.innerWidth, height: window.innerHeight };

const scene0 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
scenes.push(scene0, scene2, scene3);

//Particles Setup
const counts = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(counts * 3);
for (let i = 0; i < counts * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xff0000,
  size: 0.02,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene0.add(particles);

//Cameras
const camera0 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera0.position.z = 5;
scene0.add(camera0);

const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 5000);
camera2.position.z = 2;
scene2.add(camera2);

const camera3 = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera3.position.z = 5;
scene3.add(camera3);

//Renderers
const canvas0 = document.querySelector(".webgl");
const renderer0 = new THREE.WebGLRenderer({ canvas: canvas0 });
renderer0.setSize(sizes.width, sizes.height);
renderer0.setPixelRatio(1);

const canvas1 = document.querySelector(".webgl1");
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1, alpha: true });
renderer1.setSize(sizes.width, sizes.height);
renderer1.setPixelRatio(1);

const canvas3 = document.querySelector(".webgl2");
const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3, alpha: true });
renderer3.setSize(300, 300);
renderer3.setPixelRatio(1);

//OrbitControls
const controls = new OrbitControls(camera0, canvas0);
controls.enableDamping = true;
controls.autoRotate = false; // disable auto-rotate for performance
controls.enableZoom = false;
controls.enablePan = false;

const controls1 = new OrbitControls(camera2, canvas1);
controls1.enableDamping = true;
controls1.enableZoom = false;
controls1.enablePan = false;// auto-rotate particles scene


const controls2 = new OrbitControls(camera3, canvas3);
controls2.enableDamping = true;
controls2.autoRotate = true; 
controls2.enableZoom = false;
controls2.enablePan = false;

//Lighting
scene2.add(new THREE.AmbientLight(0xffffff, 5));

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene2.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1.5);
spotLight.position.set(0, 10, 5);
spotLight.target.position.set(0, 0, 0);
scene2.add(spotLight);
scene2.add(spotLight.target);

//Environment Map Setup
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
  'environmentMaps/0/px.png',
  'environmentMaps/0/nx.png',
  'environmentMaps/0/py.png',
  'environmentMaps/0/ny.png',
  'environmentMaps/0/pz.png',
  'environmentMaps/0/nz.png'
]);
scene2.background = environmentMap;
scene2.environment = environmentMap;

//Postprocessing Composer for scene2
const composer = new EffectComposer(renderer1);
const renderPass = new RenderPass(scene2, camera2);
composer.addPass(renderPass);

const outlinePass = new OutlinePass(
  new THREE.Vector2(sizes.width, sizes.height),
  scene2,
  camera2
);
outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 0.2;
outlinePass.visibleEdgeColor.set("#ff0000");
composer.addPass(outlinePass);

//Loaders
let brain, edu;
const loader = new GLTFLoader();
const loader10 = new GLTFLoader();

//Load Brain Model (scene2)
loader.load("/Finance_Frontal.glb", (gltf) => {
  brain = gltf.scene;
  addOutlineObject(brain);
  brain.rotation.y = Math.PI / 2;
  brain.position.set(0, 0, 0);
  gsap.fromTo(brain.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1 });
  brain.visible = true;

  brain.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.roughness = 0.3;
      child.material.metalness = 0;
      child.material.emissive = new THREE.Color(0x222222);
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = 0;
      child.material.needsUpdate = true;
    }

    //Assign userData
    if (child.isMesh && child.name === "Current") {
      child.userData = {
        description: "AI in finance is revolutionizing decision making and risk management by leveraging advanced algorithms to analyze vast financial data for forecasting and fraud detection. Machine learning models optimize portfolio management and automate routine tasks, improving accuracy and efficiency.",
        imageURL: "Finance_current.png",
        nameobject: "Current state",
        braindescript: "By 2025, about 85% of financial institutions have integrated AI into their operations, enhancing predictive accuracy and operational efficiency.",
        braindescript1: "AI systems analyze thousands of earnings calls and reports daily, enabling near real-time risk assessment and market insight.",
      };
    }
    if (child.isMesh && child.name === "Potential") {
      child.userData = {
        description: "Future AI financial technologies will enable hyper-accurate, adaptive forecasting and dynamic risk management systems that continuously learn and respond to market changes. Personalized financial advice and scenario planning will become more sophisticated and accessible.",
        imageURL: "Finance_potential.jpeg",
        nameobject: "Potential benefits",
        braindescript: "AI-powered digital twins and scenario simulations let finance teams test strategies and prepare for diverse economic conditions.",
        braindescript1: "Advanced AI will integrate ESG factors into forecasting, guiding sustainable investment decisions toward 2030.",
      };
    }
    if (child.isMesh && child.name === "Ethical") {
      child.userData = {
        description: "AI use in finance raises important ethical issues, including data privacy, algorithmic bias, and transparency in automated decision making. Ensuring fairness and human oversight is critical to maintaining trust and complying with regulatory standards.",
        imageURL: "Finance_ethical.webp",
        nameobject: "Ethical and social implications",
        braindescript: "Regulatory frameworks increasingly mandate explainability and fairness in AI-driven financial decisions to protect consumers and markets.",
        braindescript1: "Ethical AI helps prevent discriminatory lending and ensures unbiased credit risk assessments.",
      };
    }
    if (child.isMesh && child.name === "Case") {
      child.userData = {
        description: "Currently, AI supports financial planning, fraud detection, automated compliance, and customer behavior prediction, delivering measurable gains in efficiency and accuracy. Financial firms use AI to tailor services and optimize portfolios.",
        imageURL: "Finance_case.png",
        nameobject: "Case studies and research",
        braindescript: "Leading firms like BlackRock use AI to analyze thousands of documents each quarter for enhanced investment decisions.",
        braindescript1: "AI fraud detection systems identify unusual transaction patterns to prevent financial losses in real time.",
      };
    }
    if (child.isMesh && child.name === "Conclusion") {
      child.userData = {
        description: "AI is reshaping finance by boosting forecasting precision, risk mitigation, and operational speed, but requires careful governance to balance innovation with ethical responsibility. Its strategic application offers competitive advantage and market resilience.",
        imageURL: "Finance_conclusion.png",
        nameobject: "Conclusion",
        braindescript: "AI enables faster, more informed financial decisions under volatile conditions, supporting growth and stability.",
        braindescript1: "Collaboration between AI technologies and financial experts is key to maximizing benefits while managing risks.",
      };
    }
    if (child.isMesh && child.name === "Developing_tech") {
      child.userData = {
        description:
          "Emerging AI finance technologies include real-time analytics platforms, explainable AI models, and integrated ESG evaluation tools. These innovations aim to enhance transparency, agility, and sustainable financial management.",
        imageURL: "Finance_developing.jpeg",
        nameobject: "Developing Technology",
        braindescript: "Explainable AI (XAI) is gaining traction to make AI-driven finance decisions clearer and more accountable.",
        braindescript1: "AI forecasting tools continuously ingest real-time data, enabling instant scenario analysis and adaptive planning.",
      };
    }
  });
  scene2.add(brain);
});

// Load Logo Model (scene3)
loader10.load("text.glb", (gltf) => {
  edu = gltf.scene;
  edu.position.y = 1.1;
  gsap.fromTo(edu.scale, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.5, z: 0.5, duration: 1 });
  edu.traverse((child) => {
    if (child.isMesh) child.material = new THREE.MeshNormalMaterial({});
  });
  scene3.add(edu);
});

// Renderer tone mapping and physically correct lighting
renderer1.physicallyCorrectLights = true;
renderer1.toneMapping = THREE.ACESFilmicToneMapping;
renderer1.toneMappingExposure = 1.2;

// --- Animation Loop ---
let animationActive = true;
function animate() {
  if (!animationActive) return;

  if (brain) brain.rotation.y -= 0.0002;
  if (particles) particles.position.z = 1.5;

  controls.update();
  controls1.update();
  controls2.update();

  renderer0.render(scene0, camera0);
  composer.render(); // renders scene2 (brain) with outline effect
  renderer3.render(scene3, camera3);

  requestAnimationFrame(animate);
}
animate();

//Pause animation when tab not visible
document.addEventListener("visibilitychange", () => {
  animationActive = !document.hidden;
  if (animationActive) animate();
});

//Interaction Handlers
function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera2);

  const intersects = raycaster.intersectObjects(scene2.children, true);
  if (intersects.length > 0) {
    const intersectObject = intersects[0].object;
    if (!objectsToOutline.includes(intersectObject)) addOutlineObject(intersectObject);

    modelNameElement.textContent = intersectObject.userData.nameobject || "";
    modelImageElement.src = intersectObject.userData.imageURL || "";
    modelDescElement.textContent = intersectObject.userData.description || "";
    modelbrainDescElement.textContent = intersectObject.userData.braindescript || "";
    modelbrainDesc1Element.textContent = intersectObject.userData.braindescript1 || "";
    modelpageDescElement.textContent = intersectObject.userData.page || "";
    backgroundBox.classList.remove("hidden");
  } else {
    objectsToOutline = [];
    outlinePass.selectedObjects = objectsToOutline;

    modelNameElement.textContent = "AI Finance";
    modelDescElement.textContent =
      "The frontal lobe, the part of the human brain responsible for decision making and problem solving. In AI finance, the frontal lobe can be linked to the development of financial forecasting and risk management technologies.";
    modelbrainDescElement.textContent =
      "Algorithms can analyze and predict market trends and investment opportunities.";
    modelbrainDesc1Element.textContent =
      "AI-powered finance systems can analyze enormous volumes of financial data, generate insights, and suggestions for investors and financial institutions.";
    modelImageElement.src = "Finance.jpeg";
    backgroundBox.classList.add("hidden");
  }
}
function onClick(event) {
  const rect = canvas3.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera3);
  const intersects = raycaster.intersectObject(edu, true);
  if (intersects.length > 0) window.location.href = "index.html";
}
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("click", onClick);

//Handle window resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera0.aspect = width / height;
  camera0.updateProjectionMatrix();

  camera2.aspect = width / height;
  camera2.updateProjectionMatrix();

  renderer0.setSize(width, height);
  renderer1.setSize(width, height);
  composer.setSize(width, height);
});
