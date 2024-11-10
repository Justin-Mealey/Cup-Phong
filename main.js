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

// Create box game environment
const boxSize = 50;
const gameBoxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
// Invert faces by reversing geometry's vertex normals
gameBoxGeometry.scale(-1, 1, 1);
const gameBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x0096FF, side: THREE.BackSide, wireframe: true });
const gameBox = new THREE.Mesh(gameBoxGeometry, gameBoxMaterial);
scene.add(gameBox);

// Define cup profile
const points = [
    new THREE.Vector2(0, 0),        
    new THREE.Vector2(3, 0),       
    new THREE.Vector2(3.6, 1.5),    
    new THREE.Vector2(3, 4.5),      
    new THREE.Vector2(2.4, 6),      
    new THREE.Vector2(1.8, 6.6)    
];

// Create LatheGeometry by rotating profile
const cupGeometry = new THREE.LatheGeometry(points, 32);
const cupMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
const cup = new THREE.Mesh(cupGeometry, cupMaterial);
scene.add(cup);
cup.position.set(0, 3, 0);


function animate() {
	renderer.render( scene, camera );
    controls.update(); 
}