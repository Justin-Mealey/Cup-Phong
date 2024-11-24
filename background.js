import * as THREE from 'three';

export function createBackground(){
    const loader = new THREE.TextureLoader();
    const textures = [
    loader.load('./bg/spacebackground.jpg'),
    loader.load('./bg/spacebackground.jpg'),
    loader.load('./bg/spacebackground.jpg'),
    loader.load('./bg/spacebackground.jpg'),
    loader.load('./bg/spacebackground.jpg'),
    loader.load('./bg/spacebackground.jpg')
    ];

    // Create materials for each face with textures applied to the inside of the cube
    const materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }));

    // Create a box geometry and mesh
    const geometry = new THREE.BoxGeometry(256, 256, 256); // Adjust size as needed
    const cube = new THREE.Mesh(geometry, materials);
    return cube
}