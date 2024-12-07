import * as THREE from 'three';

// Colors of lights
const lightColors = [
    0xff0000,   // Red
    0x00ff00,   // Green
    0x0000ff,   // Blue
    0xffff00,   // Yellow
    0xff00ff,   // Magenta
    0x00ffff    // Cyan
];

let lights;
let lightRadius; 

export function createDiscoLights(scene, {
    colors = lightColors,
    radius = 15,
    intensity = 30.0,
    distance = 30
} = {}) {
    lightRadius = radius; 
    lights = colors.map((color, index) => {
        const light = new THREE.PointLight(color, intensity, distance); 
        const angle = (index / colors.length) * Math.PI * 2;
        light.position.set(
            Math.cos(angle) * radius * 5 + 40,
            Math.cos(angle) * radius / 5 + 35,
            Math.sin(angle) + 3
        );
        scene.add(light);
        return light; 
    });
}

//disco effect, lights move around title
export function animateLights(time) { 
    lights.forEach((light, index) => {
        const angle = time + (index / lights.length) * Math.PI * 2;
        light.position.x = Math.cos(angle) * lightRadius * 5 + 30;
        light.position.y = Math.sin(angle) * lightRadius / 5 + 25;
        light.position.z = 3;
    });
}
