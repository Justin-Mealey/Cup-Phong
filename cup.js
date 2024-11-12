import * as THREE from 'three';
import { rotationMatrixZ, rotationMatrixY, translationMatrix } from './math';

export function createCup(size, position) {
    const geometry = new THREE.CylinderGeometry( 5*size, 3*size, 10*size, 30 , 1, false); 
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
    const cylinder = new THREE.Mesh( geometry, material ); 
    
    // Rotate cup around z axis by 90 degrees
    cylinder.matrixAutoUpdate = false;
    const model_transform = new THREE.Matrix4;
    model_transform.multiplyMatrices(rotationMatrixZ(Math.PI / 2), model_transform);
    cylinder.matrix.multiplyMatrices(model_transform, cylinder.matrix);
    
    // Translate cup to position
    cylinder.matrix.multiplyMatrices(translationMatrix(position.x, position.y, position.z), cylinder.matrix);
    
    return cylinder;
}

export function createCupPlane(size, position) {
    const geometry = new THREE.RingGeometry(1 * size, 5 * size, 30, 8, 0, Math.PI * 2);
    const material = new THREE.MeshBasicMaterial( {color: 0x50C878 } );
    const cupPlane = new THREE.Mesh(geometry, material);

    // Rotate around z axis by 90 degrees
    cupPlane.matrixAutoUpdate = false;
    const model_transform = new THREE.Matrix4;
    model_transform.multiplyMatrices(rotationMatrixY(-Math.PI / 2), model_transform);
    cupPlane.matrix.multiplyMatrices(model_transform, cupPlane.matrix);

    // Translate to position
    cupPlane.matrix.multiplyMatrices(translationMatrix(position.x, position.y, position.z), cupPlane.matrix);
    cupPlane.visible = false;
    return cupPlane;
}

