import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const narratorUrl = new URL("../assets/model.glb", import.meta.url);
const canvasContainer = document.getElementById("threeCanvasContainer");

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
canvasContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 6, 9);
camera.lookAt(0, 0, 0);
// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();

const light = new THREE.SpotLight(0xffffff);
scene.add(light);
light.position.set(100, 100, -100);
light.castShadow = true;
light.angle = 0.2;

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

scene.fog = new THREE.FogExp2(0xffffff, 0.01);

const assetLoader = new GLTFLoader();

assetLoader.load(
  narratorUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-3, 4, 9);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    camera.lookAt(center);

    const mesh = gltf.scene.children[0];
    console.log(gltf.scene);
    const shapeKeys = mesh.morphTargetInfluences; // Access the shape keys/morph targets
    console.log(shapeKeys);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const mousePosition = new THREE.Vector2();

// window.addEventListener("mousemove", function (e) {
//   mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
//   mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
// });

// const rayCaster = new THREE.Raycaster();

function animate() {
  //   rayCaster.setFromCamera(mousePosition, camera);
  //   const intersects = rayCaster.intersectObjects(scene.children);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
});
