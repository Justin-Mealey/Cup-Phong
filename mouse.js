import * as THREE from 'three';

// State variables
let isDragging = false;
let startX = 0;
let startY = 0;
let power = 0;
let directionVector = new THREE.Vector2(0, 0);

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
    power = 0;
}

function handleMouseMove(event) {
    if (!isDragging) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    // Calculate displacement
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const displacement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Update power (capped at 1.0)
    power = Math.min(displacement / thirdScreenHeight, 1.0);

    // Calculate direction vector (opposite to movement)
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (magnitude > 0) {
        directionVector = new THREE.Vector2(-deltaX / magnitude, -deltaY / magnitude);
    }

    // // Log values for debugging
    // console.log('Power:', power.toFixed(2));
    // console.log('Direction Vector:', {
    //     x: directionVector.x.toFixed(2),
    //     y: directionVector.y.toFixed(2)
    // });
}


function handleMouseUp() {
    isDragging = false;
}

// // Clean up function (call this when removing the functionality)
// function cleanupEventListeners() {
//     document.removeEventListener('mousedown', handleMouseDown);
//     document.removeEventListener('mousemove', handleMouseMove);
//     document.removeEventListener('mouseup', handleMouseUp);
// }