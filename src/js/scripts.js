import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const narratorUrl = new URL("../assets/avatar.glb", import.meta.url);
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

let model;

assetLoader.load(
  narratorUrl.href,
  function (gltf) {
    model = gltf.scene;

    // Set morphTargets to true for all materials in the model
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.morphTargets = true;
      }

      //   // Check if the child has the CRAZYKEY morph target
      //   if (child.morphTargetDictionary?.CRAZYKEY !== undefined) {
      //     // Toggle CRAZYKEY between 0 and 1
      //     console.log(child.morphTargetDictionary.CRAZYKEY);
      //     child.morphTargetDictionary.CRAZYKEY =
      //       child.morphTargetDictionary.CRAZYKEY === 0 ? 1 : 0;
      //   }
    });

    scene.add(model);

    model.position.set(-3, 4, 9);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    camera.lookAt(center);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const mousePosition = new THREE.Vector2();

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

let startTime = Date.now();

// Animation duration in milliseconds (2 seconds)
const animationDuration = 5000;

function animate2() {
  console.log("calling animate2");
  if (!model) {
    setTimeout(animate2, 1000);
    return;
  }
  const currentTime = Date.now();
  const elapsed = currentTime - startTime;

  model.traverse((child) => {
    if (child.isMesh && child.morphTargetDictionary?.CRAZYKEY !== undefined) {
      console.log(child.morphTargetDictionary.CRAZYKEY);
      child.morphTargetDictionary.CRAZYKEY =
        child.morphTargetDictionary.CRAZYKEY === 0 ? 1 : 0;
    }
  });

  setTimeout(animate2, animationDuration);
}

animate2();

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {});
