import * as THREE from 'three';

export function createGameBox(size) {
    // Create box game environment
    const boxSize = size;
    const gameBoxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    // Invert faces by reversing geometry's vertex normals
    gameBoxGeometry.scale(-1, 1, 1);
    const gameBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x0096FF, side: THREE.BackSide, wireframe: true });
    const gameBox = new THREE.Mesh(gameBoxGeometry, gameBoxMaterial);
    return gameBox;
}