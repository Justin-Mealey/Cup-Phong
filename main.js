import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,20)
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

const ballGeometry = new THREE.SphereGeometry(1, 64, 64)
const ballMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xFFFFFF),
})
const ball = new THREE.Mesh( ballGeometry, ballMaterial );
scene.add( ball );

//For development, remove later
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

const b1g = new THREE.BoxGeometry(4, 0.5, 2); // width = 4, height = 1, depth = 2
const b1m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
const b1 = new THREE.Mesh(b1g, b1m);

scene.add(b1)
b1.position.set(2, 0, 0)


function animate() {
	renderer.render( scene, camera );
    controls.update(); 
}