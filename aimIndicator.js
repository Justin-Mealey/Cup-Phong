import * as THREE from 'three';
import { directionVector } from './mouse';
import { update_power } from './mouse';
import { game_object } from './game_logic';

let aimLine;
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); //yellow lighting

export function createAimLine() {
    const startPoint = new THREE.Vector3(0, 0, 0);
    let endPoint = new THREE.Vector3(directionVector.x, -directionVector.y, directionVector.z); 
    // For picking z-direction: 
    if(!game_object.cameraInTwoD) {
        endPoint = new THREE.Vector3(0, 0, directionVector.z);
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
    aimLine = new THREE.Line(lineGeometry, lineMaterial);
    aimLine.scale.set(update_power, update_power, update_power / 2);
    return aimLine;
}
