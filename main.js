import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createBall } from './ball.js';
import { createPlanes } from './plane.js';
import { translationMatrix, didCollide, updateVelocity } from './math.js';

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


const ballRadius = 1;
let ballPosition = new THREE.Vector3(0, 0, 0);
let ballVelocity = new THREE.Vector3(-1, -0.2, 0);
const ball = createBall(ballRadius, ballPosition);
scene.add(ball);

const planeData = [
    // Left face
    {
        position: { x: -50, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: false
    },

    // Right face
    {
        position: { x: 50, y: 0, z: 0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: false
    },

    // Top face
    {
        position: { x: 0, y: 50, z: 0 },
        rotation: { x: Math.PI / 2, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: true
    },

    // Bottom face
    {
        position: { x: 0, y: -50, z: 0 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: true
    },
];

const planes = createPlanes(planeData);
planes.forEach(plane => scene.add(plane));

function applyTranslation(ball, tx, ty, tz) {
    const translation = translationMatrix(tx, ty, tz);
    let model_transform = new THREE.Matrix4(); 
    model_transform.multiplyMatrices(model_transform, translation) 
    ball.matrix.copy(model_transform);
    ball.matrixAutoUpdate = false;
    ball.position.setFromMatrixPosition(ball.matrix);
}

function animate() {
    const tx = ball.position.x + ballVelocity.x;
    const ty = ball.position.y + ballVelocity.y;
    const tz = ball.position.z + ballVelocity.z;

    applyTranslation(ball, tx, ty, tz);

    planeData.forEach((plane, index) => {
        const hit_type = didCollide(ball, planeData[index]);
        if (hit_type !== null) {
            ballVelocity = updateVelocity(ball, ballRadius, ballVelocity, planeData[index], hit_type);
        }
    });

    // Render the scene
    renderer.render(scene, camera);
    controls.update();
}