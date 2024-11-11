import * as THREE from 'three';

export function createCup(position) {
    // Define cup profile
    const points = [
        new THREE.Vector2(0, 0),        
        new THREE.Vector2(3, 0),       
        new THREE.Vector2(3.6, 1.5),    
        new THREE.Vector2(3, 4.5),      
        new THREE.Vector2(2.4, 6),      
        new THREE.Vector2(1.8, 6.6)    
    ];

    // Create LatheGeometry by rotating profile
    const cupGeometry = new THREE.LatheGeometry(points, 32);
    const cupMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.copy(position);
    return cup;
}