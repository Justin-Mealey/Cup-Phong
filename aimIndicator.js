import * as THREE from 'three';
import { directionVector } from './mouse';

// Create a line for the aim indicator
let aimLine;
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // Bright yellow

export function createAimLine() {
    const startPoint = new THREE.Vector3(0, 0, 0);
    const endPoint = new THREE.Vector3(directionVector.x, directionVector.y, 0).multiplyScalar(5); // Length multiplier for visibility
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
    aimLine = new THREE.Line(lineGeometry, lineMaterial);
    return aimLine;
}