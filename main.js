import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const gridhelper = new THREE.GridHelper(100, 100);
// scene.add(gridhelper);

let eye;
let eyebrows;
const loader = new GLTFLoader();
loader.load("/public/cartoonGirl.glb", function (gltf) {
  scene.add(gltf.scene);

  eye = gltf.scene.getObjectByName("Eye");
  eyebrows = gltf.scene.getObjectByName("Eyebrows");
});

const ambientLight = new THREE.AmbientLight(0xfffffff, 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xfffffff, 0.5);
spotLight.position.set(0, 3, 5);
spotLight.target.position.set(0, 3, 0);
scene.add(spotLight);
scene.add(spotLight.target);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

camera.position.z = 2;
camera.position.y = 1;

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 3, 0);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (eye) {
    eye.rotation.z = Math.sin(Date.now() / 1000) / 2;
  }

  renderer.render(scene, camera);
}
animate();
