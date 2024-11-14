import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { setupStationaryObstacles } from './stationaryObstacles.js';
import { setupEventListeners, final_power, final_angle, isDragging, directionVector } from './mouse.js'
import { createBall } from './ball.js';
import { translationMatrix, didCollide, updateVelocity } from './math.js';
import { GAME_BALL_VELOCITY_SCALING_FACTOR, GAME_BOUND_X } from './constants.js';
import { createPlanes } from './plane.js'
import { planeData } from './game_box.js';
import { game_object } from './game_logic.js';
import { createCup, createCupPlane } from './cup.js'
import { checkCollision, getBounds } from './collisions.js'
import { createAimLine } from './aimIndicator.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,30)
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

// For development, remove later
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
// For development, remove later

// Place stationary obstacles
let obj = setupStationaryObstacles()
let stationaryObstacles = obj.usedStationaryObstacles
let floor = obj.floor
let ceiling = obj.ceiling

let x = [7, 8.5, 11, 13.5, 16, 18.5, 21, 23.5]
let y = [5, -4, 1, -2, 2, -4, 4, 0]
let z = [0, 2, -2, 0, 3, -1, 1, -1] //ADD LATER when moving to 3D
for (let i = 0; i < stationaryObstacles.length; i++){
    let box = stationaryObstacles[i]
    scene.add(box)
    box.position.set(x[i], y[i], 0)
}
const bounds = getBounds(stationaryObstacles) //USE FOR COLLISION 

const planes = createPlanes(planeData);
planes.forEach(plane => scene.add(plane));
// Place stationary obstacles

//setup floor, ceiling
//setup obstacles
//setup cups
//setup ball to be in start

function applyTranslation(ball, tx, ty, tz) {
    const translation = translationMatrix(tx, ty, tz);
    let model_transform = new THREE.Matrix4(); 
    model_transform.multiplyMatrices(model_transform, translation) 
    ball.matrix.copy(model_transform);
    ball.matrixAutoUpdate = false;
    ball.position.setFromMatrixPosition(ball.matrix);
}

const ballRadius = 1;
let ballPosition = new THREE.Vector3(0, 0, 0);
const ball = createBall(ballRadius, ballPosition);
scene.add(ball);

setupEventListeners();

// Camera event listener
let cameraInTwoD = true
document.addEventListener('keydown', function(event) {
    if (event.key === 'c') {
      cameraInTwoD = !cameraInTwoD
    }
});

const cupOnePosition = new THREE.Vector3(GAME_BOUND_X, 0, 0);
const cupOne = createCup(0.5, cupOnePosition);
scene.add(cupOne);
let cupOnePlanePosition = new THREE.Vector3(GAME_BOUND_X - 3, 0, 0);
let cupOnePlane = createCupPlane(0.5, cupOnePlanePosition);
scene.add(cupOnePlane);

// Camera event listener
let setBallVelocity = false;
let ballVelocity = new THREE.Vector3(0,0,0)
let reflectX = false
let reflectY = false

// Aim line
let aimLine = null;

function animate() {
    if (cameraInTwoD){
        let newPos = new THREE.Vector3(50, 0, 55);
        camera.position.lerp(newPos, .08)
        camera.lookAt(50,0,0)
    }
    else{
        let newPos = new THREE.Vector3(-5, 0, 0);
        camera.position.lerp(newPos, .08)
        camera.lookAt(1,0,0)
    }

        // Aim indicator at the top of animate()
    if(isDragging) {
        if(!aimLine) {
            aimLine = createAimLine();
            const endPoint = new THREE.Vector3(directionVector.x, -directionVector.y, 0).multiplyScalar(5);
            aimLine.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), endPoint]);
            scene.add(aimLine);
        } else {
            aimLine.geometry.dispose();
            aimLine.material.dispose();
            scene.remove(aimLine);
            aimLine = null;
        }
    }

    if(game_object.shot_ball == true && aimLine != null) {
        scene.remove(aimLine);
        aimLine = null;
    }
  
    controls.enabled = false;
    if(game_object.shot_ball == true && setBallVelocity == false){
        ballVelocity.set(GAME_BALL_VELOCITY_SCALING_FACTOR * final_power * Math.cos(final_angle), GAME_BALL_VELOCITY_SCALING_FACTOR * final_power * Math.sin(final_angle), 0);
        setBallVelocity = true;
    }
    else if(game_object.shot_ball == true && setBallVelocity == true){
        const tx = ball.position.x + ballVelocity.x;
        const ty = ball.position.y + ballVelocity.y;
        const tz = ball.position.z + ballVelocity.z;

        applyTranslation(ball, tx, ty, tz);

        var collisionCheck = checkCollision(bounds, ball)
        if (collisionCheck === 'x'){
            reflectX = !reflectX
        }
        else if (collisionCheck === 'y'){
            reflectY = !reflectY
        }
        // Collsion check
    
        if (reflectX){
            ballVelocity.x *= -1
        }
        else if (reflectY){
            ballVelocity.y *= -1
        }

        planeData.forEach((plane, index) => {
            const hit_type = didCollide(ball, planeData[index]);
            if (hit_type !== null) {
                ballVelocity = updateVelocity(ball, ballRadius, ballVelocity, planeData[index], hit_type);
            }
        });
        if (ball.position.x - ballRadius > cupOnePlanePosition.x && ball.position.y - ballRadius > cupOnePlanePosition.y - 3 && ball.position.y + ballRadius < cupOnePlanePosition.y + 3) {
            console.log("YOU WON");
            throw new Error("Game Over")
        }
        if(ball.position.x >= GAME_BOUND_X) {
            console.log("YOU LOST")
            throw new Error("Game Over")
        }
        
    }
    
    // Render the scene
    renderer.render(scene, camera);
    controls.update();
}