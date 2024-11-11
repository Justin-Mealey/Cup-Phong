import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { setupStationaryObstacles } from './stationaryObstacles.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,20)
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

function createAxisLine(color, start, end) {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
}
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 20, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 20)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);
//For development, remove later

let obj = setupStationaryObstacles()
let stationaryObstacles = obj.usedStationaryObstacles
let floor = obj.floor
let ceiling = obj.ceiling
console.log(floor)

let x = [7, 8.5, 11, 13.5, 16, 18.5, 21, 23.5]
let y = [5, -4, 1, -2, 2, -4, 4, 0]
let z = [0, 1, -1, 0, 2, 1, 0, -1]
for (let i = 0; i < stationaryObstacles.length; i++){
    let box = stationaryObstacles[i]
    scene.add(box)
    box.position.set(x[i], y[i], z[i])
}

scene.add(ceiling)
ceiling.position.set(15, 8, 0)

scene.add(floor)
floor.position.set(15, -8, 0)

//setup floor, ceiling
//setup obstacles
//setup cups
//setup ball to be in start

setupEventListeners();

function animate() {


    // Render the scene
    renderer.render(scene, camera);
    controls.update();
}