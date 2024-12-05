import * as THREE from 'three';
import { game_object, game_text } from './game_logic.js';
import { GAME_MIN_AIM_POWER } from './constants.js';

// State variables
export let isDragging = false;
let startX = 0;
let startY = 0;
let power = 0;
export var final_power = 0;
export var final_angle = 0;
export var update_power = 0;
export let directionVector = new THREE.Vector3(0, 0, 0);

// Get window dimensions
const thirdScreenHeight = window.innerHeight / 3;

// Add event listeners
export function setupEventListeners() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseDown(event) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    if(!game_object.set_xy_shot) power = 0;
}

function handleMouseMove(event) {
    if (!isDragging || !game_object.game_started) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    // Calculate displacement
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const displacement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    var magnitude = 0;
    if(game_object.set_xy_shot){
        magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (magnitude > 0) directionVector.z = -deltaX / magnitude;
    }
    else{
        power = Math.min(displacement / thirdScreenHeight, 1.0);
        update_power = power;
        if(game_object.cameraInTwoD && deltaX > 0){ //DONT ALLOW SHOOTING BACKWARDS
            return;
        }
    
        // Calculate direction vector (opposite to movement)
        magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (magnitude > 0) {
            directionVector = new THREE.Vector3(-deltaX / magnitude, -deltaY / magnitude, 0);
        }
    }

    // // Log values for debugging
    // console.log('Power:', power.toFixed(2));
    // console.log('Direction Vector:', {
    //     x: directionVector.x.toFixed(2),
    //     y: directionVector.y.toFixed(2),
    //     z: directionVector.z.toFixed(2),
    //     deltaY: -deltaY / magnitude,
    //     cameraState: game_object.cameraInTwoD
    // });
}


function handleMouseUp() {
    if(power > GAME_MIN_AIM_POWER){
        console.log(game_object.set_xy_shot)
        if(!game_object.set_xy_shot){
            game_object.set_xy_shot = true;
            isDragging = false;
            final_power = power;
            final_angle = Math.atan(-directionVector.y.toFixed(2) / directionVector.x.toFixed(2))
            game_object.cameraInTwoD = false;
            game_text.info_text = `
            Power: ${Math.round(final_power * 100, 2) / 100}
            XY Angle: ${Math.round(final_angle * 100 * (180 / Math.PI), 2) / 100}`;
        }
        else if(game_object.set_xy_shot){
            game_text.info_text = `
            Power: ${Math.round(final_power * 100, 2) / 100}
            XY-Angle: ${Math.round(final_angle * 100 * (180 / Math.PI), 2) / 100}
            XZ-Angle: ${Math.round(directionVector.z * 100 * 45, 2) / 100}`;
            game_object.shot_ball = true;
        }
    } else {
        isDragging = false;
    }
}

// // Clean up function (call this when removing the functionality)
// function cleanupEventListeners() {
//     document.removeEventListener('mousedown', handleMouseDown);
//     document.removeEventListener('mousemove', handleMouseMove);
//     document.removeEventListener('mouseup', handleMouseUp);
// }