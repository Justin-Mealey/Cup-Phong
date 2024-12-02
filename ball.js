import * as THREE from 'three';

export function createBall(radius, position) {
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0xFFFFFF),
        specular: new THREE.Color(0xAAAAAA), // Adjust specular highlight color
        shininess: 100 // Adjust shininess level for highlights
      });
    const ball = new THREE.Mesh(geometry, material);
    ball.position.copy(position);
    ball.radius = radius
    return ball;
}