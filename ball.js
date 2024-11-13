import * as THREE from 'three';

export function createBall(radius, position) {
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xFFFFFF) });
    const ball = new THREE.Mesh(geometry, material);
    ball.position.copy(position);
    ball.radius = radius
    return ball;
}