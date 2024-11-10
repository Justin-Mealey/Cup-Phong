import * as THREE from 'three';

export function createPlane(transformation) {
    const { position, rotation, scale, horizontal } = transformation;
    const { x: x_pos, y: y_pos, z: z_pos } = position;
    const { x: x_rot, y: y_rot, z: z_rot } = rotation;
    const { x: x_scale, y: y_scale, z: z_scale} = scale;

    const geometry = new THREE.PlaneGeometry(100, 100)
    const material = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
    });

    const plane = new THREE.Mesh(geometry, material);

    plane.position.set(x_pos, y_pos, z_pos);
    plane.rotation.set(x_rot, y_rot, z_rot);
    plane.scale.set(x_scale, y_scale, z_scale);  

    return plane;
}

export function createPlanes(transformations) {
    return transformations.map(createPlane);
}