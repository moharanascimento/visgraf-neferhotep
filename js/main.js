//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'tomb';
let imagesList = ['statue.gltf', 'wall.gltf', 'wall2.gltf','wall5.gltf']
let i = 0;

document.getElementById("rightArrow").addEventListener("click", changeImgRight, false);
document.getElementById("leftArrow").addEventListener("click", changeImgLeft, false);

let imgToRender = imagesList[i];

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

callLoad();

function callLoad(){
      //Load the file
      loader.load(
        `models/${objToRender}/${imgToRender}`,
        function (gltf) {
          //If the file is loaded, add it to the scene
          scene.remove(object);
          controls.reset(); // reset the zoom when the object is changed
          object = gltf.scene;
          scene.add(object);
          camera.position.z=25;
          controls.saveState(); //save the first state of zoom
        },
        function (xhr) {
          //While it is loading, log the progress
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
          //If there is an error, log it
          console.error(error);
        }
      );
}

//Function to change image
function changeImgRight() {
  if (i < imagesList.length-1) {
    i++;
  }
  else{
    i=0;
  }
  imgToRender = imagesList[i];
  callLoad();
}

//Function to change image
function changeImgLeft() {
  if (i == 0) {
    i=imagesList.length-1;
  }
  else{
    i--;
  }
  imgToRender = imagesList[i];
  callLoad();
}

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "tomb" ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "tomb" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "tomb") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.saveState(); //save the first state of zoom 
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//Start the 3D rendering
animate();