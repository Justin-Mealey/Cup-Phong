import * as THREE from 'three';
import { directionVector } from './mouse';
import { update_power } from './mouse';

// Create a line for the aim indicator
let aimLine;
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // Bright yellow

export function createAimLine() {
    const startPoint = new THREE.Vector3(0, 0, 0);
    const endPoint = new THREE.Vector3(directionVector.x, -directionVector.y, directionVector.z).multiplyScalar(9); // Length multiplier for visibility
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
    aimLine = new THREE.Line(lineGeometry, lineMaterial);
    aimLine.scale.set(update_power, update_power, update_power / 2);
    return aimLine;
}
