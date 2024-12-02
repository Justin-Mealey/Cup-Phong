import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { setupStationaryObstacles } from './stationaryObstacles.js';
import { setupEventListeners, final_power, final_angle, isDragging, directionVector } from './mouse.js'
import { createBall } from './ball.js';
import { translationMatrix, didCollide, updateVelocity } from './math.js';
import { GAME_BALL_VELOCITY_SCALING_FACTOR, GAME_BOUND_X, TEXT_HAS_NOT_SHOT } from './constants.js';
import { createPlanes } from './plane.js'
import { planeData } from './game_box.js';
import { game_object, game_text } from './game_logic.js';
import { createCup, createCupPlane } from './cup.js'
import { checkCollision, getBounds } from './collisions.js'
import { createAimLine } from './aimIndicator.js';
import { createText, createLights, updateText, wait } from './text.js';
import { createBackground } from './background.js';
import { createPortals, getPortalBounds, checkTeleport } from './portals.js'
import { createFireParticleSystem } from './fire.js';


//TODO: need to show animation on score/collission
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(50, 0, 40)
camera.lookAt(50,0,0)

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

//Add background
const bg = createBackground()
scene.add(bg)
//Add background

// Place stationary obstacles
let obj = setupStationaryObstacles()
let stationaryObstacles = obj.usedStationaryObstacles
let floor = obj.floor
let ceiling = obj.ceiling

let x = [10, 18, 28, 48, 53, 63, 68, 73]
let y = [[5, -10, 1, 6, -7, 4, 12, 0], [0, 12, 4, -7, 6, 1, -10, 5], [-4, 8, -6, 6, -10, 10, -14, 0], [-10, -5, 0, 5, 10, 15, 10, 0]]
let yPicker = Math.floor(Math.random() * 4)
let z = [0, 2, -2, 0, 3, -1, 1, -1] //ADD LATER when moving to 3D
for (let i = 0; i < stationaryObstacles.length; i++){
    let box = stationaryObstacles[i]
    scene.add(box)
    box.position.set(x[i], y[yPicker][i], 0)
}
const bounds = getBounds(stationaryObstacles) //USE FOR COLLISION 

//PORTALS
let portals = createPortals()
let xLocations = [23, 42, 35, 58]
let yLocations = [[-12, 12, 2, 2], [-6, 6, 10, 0], [8, -2, 4, 10]]
let yPick = Math.floor(Math.random() * 3)
// for (let i = 0; i < portals.length; i++){
//     let portal = portals[i]
//     scene.add(portal)
//     portal.position.set(xLocations[i], yLocations[yPick][i], 0)
// }
const portalBounds = getPortalBounds(portals)
//PORTALS

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

const ballRadius = 1;
let ballPosition = new THREE.Vector3(0, 0, 0);
var ball = createBall(ballRadius, ballPosition);
scene.add(ball);

setupEventListeners();

// Camera event listener
game_object.cameraInTwoD = true
document.addEventListener('keyup', function(event) {
    if (event.key === 'c') {
        if(game_object.cameraInTwoD ) game_object.cameraInTwoD  = false;
        else game_object.cameraInTwoD  = true;
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

// Text
let gameText;
createText("Cup Phong").then((textMesh) => {
    gameText = textMesh;
    scene.add(textMesh);
});

// Game over
let gameOver = false;

let { directionalLight, ambientLight } = createLights();
scene.add(directionalLight);
scene.add(ambientLight);

game_text.info_text = TEXT_HAS_NOT_SHOT;

// Fire particles
const fireParticles = createFireParticleSystem();
// Move the entire fire particle system to a new position
fireParticles.particleSystem.position.set(10, 0, 0);
fireParticles.particleSystem.visible = false;
scene.add(fireParticles.particleSystem);

// Reset Round
export function resetRound(){
    console.log("reset")
    scene.remove(ball);
    game_object.shot_ball = false;
    game_object.cameraInTwoD = true;
    ball.position.x = 0;
    ball.position.y = 0;
    ball.position.z = 0;
    ballVelocity = new THREE.Vector3(0,0,0)
    ball = createBall(ballRadius, ballPosition);
    setBallVelocity = false;
    reflectX = false
    reflectY = false
    aimLine = null;
    game_object.rounds_left--;
    scene.add(ball);
    game_text.info_text = TEXT_HAS_NOT_SHOT;
    //TODO: generate new obstacles
    
}

function animate() {
    if(game_object.rounds_left == 0){
        gameOver = true;
        document.getElementById('game-end-popup').classList.add('show');
        //TODO: END GAME
    }
    //MARK: CAMERA ANIMATION
    if (game_object.shot_ball){
        ball.material.transparent = true; 
        ball.material.opacity = 0.5; 
        ball.material.needsUpdate = true;
    }
    if (game_object.cameraInTwoD ){
        let newPos = new THREE.Vector3(50, 0, 40);
        camera.position.lerp(newPos, .08)
        camera.lookAt(50,0,0)
    }
    else if (!game_object.cameraInTwoD  && !game_object.shot_ball){
        let newPos = new THREE.Vector3(-5, 0, 0);
        camera.position.lerp(newPos, .08)
        camera.lookAt(1,0,0)
    }
    else if (game_object.shot_ball && !gameOver && !game_object.cameraInTwoD ){
        let temp = new THREE.Vector3()
        temp.copy(ballVelocity)
        temp.normalize()
        let newX = ball.position.x - (4 * temp.x)
        let newY = ball.position.y - (4 * temp.y)
        let newZ = ball.position.z - (4 * temp.z)
        let newPos = new THREE.Vector3(newX, newY, newZ)
        camera.position.lerp(newPos, .05)
        camera.lookAt(ballVelocity.x + ball.position.x, ballVelocity.y + ball.position.y, ballVelocity.z + ball.position.z)
    }
    else if (gameOver){
        camera.position.set(50, 0, 40)
        camera.lookAt(50,0,0)
    }
    else{
        console.log("Error: no valid game states, can't set camera.")
    }
    //CAMERA

    // Aim indicator at the top of animate()
    if(isDragging) {
        if(!aimLine) {
            aimLine = createAimLine();
            const endPoint = new THREE.Vector3(directionVector.x, -directionVector.y, 0).multiplyScalar(9);
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

        checkTeleport(portalBounds, ball) //will teleport ball to other portal if appropriate

        var collisionCheck = checkCollision(bounds, ball)
        if (collisionCheck === 'x'){
            reflectX = !reflectX
            game_object.score++;
        }
        else if (collisionCheck === 'y'){
            reflectY = !reflectY
            game_object.score++;
        }
        // Collsion check
    
        if (reflectX){
            ballVelocity.x *= -1
            reflectX = !reflectX
        }
        else if (reflectY){
            ballVelocity.y *= -1
            reflectY = !reflectY
        }

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
        if (!gameOver && ball.position.x - ballRadius > cupOnePlanePosition.x && ball.position.y - ballRadius > cupOnePlanePosition.y - 3 && ball.position.y + ballRadius < cupOnePlanePosition.y + 3) {
            console.log("YOU WON");
            game_object.score+=5;
            updateText(gameText, "HIT :D")
            resetRound();
        }
        if(!gameOver && ball.position.x >= GAME_BOUND_X || ball.position.x < -10) {
            console.log("YOU LOST")
            updateText(gameText,  "MISSED :(");
            resetRound();
        }
        
    }

    // Fire
    fireParticles.animateFireParticles();
    
    renderer.render(scene, camera);
    controls.update();
}