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
import { createDiscoLights, animateLights } from './discoLights.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(50, 0, 40)
camera.lookAt(50,0,0)

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

//Add background
const background = createBackground();
scene.add(background);
//Add background

// Place stationary obstacles
let obj = setupStationaryObstacles()
let stationaryObstacles = obj.usedStationaryObstacles

let x = [14, 26, 34, 46, 54, 66, 72, 80]
let y = [[-8, 0, 8, 12, 8, 0, -8, -12], [-8, 8, 8, -4, -4, 4, 4, 0], [-8, -7, -2, 1, 2, 6, 7, 11], [-10, 3, -4, 0, 3, -7, 10, -2]]
let z = [[-5, -7.5, -5, 0, 5, 7.5, 5, 0], [8, 8, -6, -6, 4, 4, -2, -2], [-4, 3, -8, 8, -6, 5, -4, 5], [-8, 2, -3, 8, 2, 0, 8, -5]] 
let levelPicker = Math.floor(Math.random() * 4)
for (let i = 0; i < stationaryObstacles.length; i++){
    let box = stationaryObstacles[i]
    scene.add(box)
    box.position.set(x[i], y[levelPicker][i], z[levelPicker][i])
}
let bounds = getBounds(stationaryObstacles) //USE FOR COLLISION 

//PORTALS
let portals = createPortals()
let xLocations = [20, 60, 40, 40]
let yLocations = [[-12, 12, 2, 2], [-6, 6, 10, 10], [8, -2, 0, 0]]
let yPick = Math.floor(Math.random() * 3)
let zLocations = [-5, 5, -8, 8]
for (let i = 0; i < portals.length; i++){
    let portal = portals[i]
    scene.add(portal)
    portal.position.set(xLocations[i], yLocations[yPick][i], zLocations[i])
}
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

// For mouse 
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
let cupOnePlane = createCupPlane(0.5, cupOnePlanePosition, "left");
scene.add(cupOnePlane);

const cupTwoPosition = new THREE.Vector3(GAME_BOUND_X, 10, -2);
const cupTwo = createCup(0.5, cupTwoPosition);
scene.add(cupTwo);
let cupTwoPlanePosition = new THREE.Vector3(GAME_BOUND_X-3, 10, -2);
let cupTwoPlane = createCupPlane(0.5, cupTwoPlanePosition, "left");
scene.add(cupTwoPlane);

const cupThreePosition = new THREE.Vector3(GAME_BOUND_X, -10, 2);
const cupThree = createCup(0.5, cupThreePosition);
scene.add(cupThree);
let cupThreePlanePosition = new THREE.Vector3(GAME_BOUND_X-3, -10, 2);
let cupThreePlane = createCupPlane(0.5, cupThreePlanePosition, "left");
scene.add(cupThreePlane);

// Camera event listener
let setBallVelocity = false;
let ballVelocity = new THREE.Vector3(0,0,0)
let reflectX = false
let reflectY = false
let reflectZ = false

// Aim line
let aimLine = null;

// Text
let gameText;
createText("Cup Phong").then((textMesh) => {
    gameText = textMesh;
    scene.add(textMesh);
});

// Disco lights
createDiscoLights(scene);

// Game over
let gameOver = false;

let { directionalLight, ambientLight } = createLights();
scene.add(directionalLight);
scene.add(ambientLight);
const l3 = new THREE.DirectionalLight(0xffffff, 1);
l3.position.set(0, 10, 10);
l3.target.position.set(50, 0, 0);
scene.add(l3.target); 

scene.add(l3)

game_text.info_text = TEXT_HAS_NOT_SHOT;

// Fire particles
const fireParticles = createFireParticleSystem(ball);
fireParticles.particleSystem.position.set(GAME_BOUND_X - 3, 0, 0);
fireParticles.particleSystem.scale.set(10, 5, 5);
fireParticles.particleSystem.rotateZ(Math.PI/2);
fireParticles.particleSystem.visible = false;
scene.add(fireParticles.particleSystem);
let fireVisibleStartTime = null;

// Reset Round
export function resetRound(){
    console.log("reset")
    scene.remove(ball);
    game_object.shot_ball = false;
    game_object.cameraInTwoD = true;
    game_object.set_xy_shot = false;
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
}

function resetRoundWithNewObstacles(){
    scene.remove(ball);
    game_object.shot_ball = false;
    game_object.cameraInTwoD = true;
    game_object.set_xy_shot = false;
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

    //GET NEW OBSTACLES
    for (let i = 0; i < stationaryObstacles.length; i++){ //remove old obstacles
        let box = stationaryObstacles[i]
        scene.remove(box)
    }

    let obj = setupStationaryObstacles()
    let newstationaryObstacles = obj.usedStationaryObstacles

    let x = [14, 26, 34, 46, 54, 66, 72, 80]
    let y = [[-8, 0, 8, 12, 8, 0, -8, -12], [-8, 8, 8, -4, -4, 4, 4, 0], [-8, -7, -2, 1, 2, 6, 7, 11], [-10, 3, -4, 0, 3, -7, 10, -2]]
    let z = [[-5, -7.5, -5, 0, 5, 7.5, 5, 0], [8, 8, -6, -6, 4, 4, -2, -2], [-4, 3, -9, 8, -6, 5, -4, 5], [-8, 2, -3, 8, 2, 0, 8, -5]] 
    let levelPicker = Math.floor(Math.random() * 4)
    for (let i = 0; i < newstationaryObstacles.length; i++){
        let box = newstationaryObstacles[i]
        scene.add(box)
        box.position.set(x[i], y[levelPicker][i], z[levelPicker][i])
    }
    let bounds = getBounds(newstationaryObstacles) //USE FOR COLLISION
    return {bounds, newstationaryObstacles}
}

const clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();

    // Update background rotation
    if (background.tick) background.tick(delta);
    if(game_object.rounds_left == 0){
        gameOver = true;
        document.getElementById('game-end-popup').classList.add('show');
    }
    //MARK: CAMERA ANIMATION
    if ((game_object.shot_ball || game_object.set_xy_shot) && !game_object.cameraInTwoD){
        ball.material.transparent = true; 
        ball.material.opacity = 0.3; 
        ball.material.needsUpdate = true;
    }
    else{
        ball.material.opacity = 1.0; 
    }
    if (game_object.cameraInTwoD ){
        let newPos = new THREE.Vector3(50, 0, 40);
        camera.position.lerp(newPos, .08);
        camera.lookAt(50,0,0);
    }
    else if (!game_object.cameraInTwoD  && !game_object.shot_ball){
        let newPos = new THREE.Vector3(-3, 0, 0);
        camera.position.lerp(newPos, .08);
        camera.lookAt(1,0,0);
        ball.material.transparent = true; 
        ball.material.opacity = 0.3; 
        ball.material.needsUpdate = true;
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
    planes.forEach(plane => {
        if (!plane.horizontal && !game_object.cameraInTwoD) {
            plane.material.opacity = 0.6;
        }
        if (!plane.horizontal && game_object.cameraInTwoD) {
            plane.material.opacity = 0.2;
        }
    });
    //CAMERA

    // Aim indicator at the top of animate()
    if(isDragging) {
        if(!aimLine) {
            aimLine = createAimLine();
            const endPoint = new THREE.Vector3(directionVector.x, -directionVector.y, directionVector.z).multiplyScalar(9);
            aimLine.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), endPoint]);
            scene.add(aimLine);
        } else {
            aimLine.geometry.dispose();
            aimLine.material.dispose();
            scene.remove(aimLine);
            aimLine = null;
        }
    }

    // Disco lights
    animateLights(Date.now() * 0.0005);

    if(game_object.shot_ball == true && aimLine != null) {
        scene.remove(aimLine);
        aimLine = null;
    }
  
    controls.enabled = false;
    if(game_object.shot_ball == true && setBallVelocity == false){
        ballVelocity.set(GAME_BALL_VELOCITY_SCALING_FACTOR * final_power * Math.cos(final_angle), GAME_BALL_VELOCITY_SCALING_FACTOR * final_power * Math.sin(final_angle), GAME_BALL_VELOCITY_SCALING_FACTOR * final_power * directionVector.z);
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
        else if (collisionCheck === 'z'){
            reflectZ = !reflectZ
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
        else if (reflectZ){
            ballVelocity.z *= -1
            reflectZ = !reflectZ
        }

        const tx = ball.position.x + ballVelocity.x;
        const ty = ball.position.y + ballVelocity.y;
        const tz = ball.position.z + ballVelocity.z;

        applyTranslation(ball, tx, ty, tz);

        planeData.forEach((plane, index) => {
            const hit_type = didCollide(ball, planeData[index]);
            if (hit_type !== null) {
                ballVelocity = updateVelocity(ball, ballRadius, ballVelocity, planeData[index], hit_type);
                const renderedPlane = planes[index];
                renderedPlane.material.color.set(0x00FF00);
                setTimeout(() => {
                    renderedPlane.material.color.set(0xFFFFFF);
                }, 500);
            }
        });
        if (!gameOver) {
            let hitFirstCup = ball.position.x - ballRadius > cupOnePlanePosition.x && ball.position.y - ballRadius > cupOnePlanePosition.y - 3 && ball.position.y + ballRadius < cupOnePlanePosition.y + 3;
            let hitSecondCup = ball.position.x - ballRadius > cupTwoPlanePosition.x && ball.position.y - ballRadius > cupTwoPlanePosition.y - 3 && ball.position.y + ballRadius < cupTwoPlanePosition.y + 3;
            let hitThirdCup = ball.position.x - ballRadius > cupThreePlanePosition.x && ball.position.y - ballRadius > cupThreePlanePosition.y - 3 && ball.position.y + ballRadius < cupThreePlanePosition.y + 3;
            if(hitFirstCup || hitSecondCup || hitThirdCup) {
                if(hitFirstCup) {
                    fireParticles.particleSystem.position.y = 0;
                    fireParticles.particleSystem.position.z = 0;
                } else if (hitSecondCup) {
                    fireParticles.particleSystem.position.y = 10;
                    fireParticles.particleSystem.position.z = -2;
                } else {
                    fireParticles.particleSystem.position.y = -10;
                    fireParticles.particleSystem.position.z = 2;
                }
                fireParticles.particleSystem.visible = true;

                console.log("YOU WON");
                game_object.score+=5;
                updateText(gameText, "HIT :D")
                let obj = resetRoundWithNewObstacles();
                bounds = obj.bounds
                stationaryObstacles = obj.newstationaryObstacles
            }
        }
        if(!gameOver && ball.position.x >= GAME_BOUND_X || ball.position.x < -10) {
            console.log("YOU LOST")
            updateText(gameText,  "MISSED :(");
            let obj = resetRoundWithNewObstacles();
            bounds = obj.bounds
            stationaryObstacles = obj.newstationaryObstacles
        }
    }
    
    if (fireParticles.particleSystem.visible) {
        if (!fireVisibleStartTime) {
            fireVisibleStartTime = performance.now(); // Record the start time
        }

        const elapsedTime = performance.now() - fireVisibleStartTime;

        if (elapsedTime > 3000) { // 1000 ms = 1 second
            fireParticles.particleSystem.visible = false;
            fireVisibleStartTime = null; // Reset the timer
        }
    }

    fireParticles.animateFireParticles();

    renderer.render(scene, camera);
    controls.update();
}