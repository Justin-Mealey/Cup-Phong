import * as THREE from 'three';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'; 

const loader = new FontLoader();
const fontPath = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json';
let textMesh1;

export function createText(inputText) {
    return new Promise((resolve) => {
        loader.load(fontPath, function (font) {
            const textGeo = new TextGeometry(inputText, {
                font: font,
                size: 5,
                depth: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelOffset: 0,
                bevelSegments: 5
            });
    
            textGeo.computeBoundingBox();
    
            // const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    
            // Create a material for the text (e.g., basic, phong, etc.)
            // Change material to MeshPhongMaterial for better lighting effects
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xADD8E6,
                specular: 0x555555,  
                shininess: 90       
            });
    
            textMesh1 = new THREE.Mesh(textGeo, material);
    
            textMesh1.position.x = 30;
            textMesh1.position.y = 20; 
            textMesh1.position.z = -1;
    
            resolve(textMesh1);
        });
    });

}

export function updateText(textMesh, newText) {
    return new Promise((resolve) => {
        loader.load(fontPath, function (font) {
            // Create a new TextGeometry with the updated text
            const newTextGeo = new TextGeometry(newText, {
                font: font,
                size: 5,
                depth: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelOffset: 0,
                bevelSegments: 5
            });

            newTextGeo.computeBoundingBox();

            // Dispose of the old geometry
            textMesh.geometry.dispose();

            // Assign the new geometry to the existing textMesh
            textMesh.geometry = newTextGeo;

            resolve(textMesh);
        });
    });
}

export function createLights() {
    // Add lights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);  // Light from top-right

    // Add ambient light to soften shadows
    const ambientLight = new THREE.AmbientLight(0x404040);  // Soft white light

    return { directionalLight, ambientLight };
}

export function wait(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}