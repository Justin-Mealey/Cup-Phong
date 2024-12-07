import * as THREE from 'three';

export function createBackground() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./bg/spacebackground.jpg');

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.NearestFilter;

    const animationUniforms = {
        uTexture: { value: texture },
        animation_time: { value: 0.0 }
    };

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform sampler2D uTexture;
        uniform float animation_time;
        varying vec2 vUv;

        void main() {
            const float PI = 3.14159265359;
            vec2 new_vUv = vUv;
            float randomFactor = sin(vUv.x * 10.0 + animation_time * 0.1) * 0.1;
            float angle = mod(animation_time * 0.05 + randomFactor, 2.0 * PI) * -1.0;
            new_vUv -= 0.5;
            vec2 rotatedUv;
            rotatedUv.x = new_vUv.x * cos(angle) - new_vUv.y * sin(angle);
            rotatedUv.y = new_vUv.x * sin(angle) + new_vUv.y * cos(angle);
            rotatedUv.x = mod(rotatedUv.x - animation_time * 0.02, 4.0);
            new_vUv = rotatedUv + 0.5;
            vec4 tex_color = texture2D(uTexture, new_vUv);
            gl_FragColor = tex_color;
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: animationUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide // Texture applied on the inner sides of the cube, because game is inside
    });

    const geometry = new THREE.BoxGeometry(256, 256, 256); // Big enough to surround game
    const cube = new THREE.Mesh(geometry, material);
    // Rotate as a function of time
    cube.tick = (delta) => {
        animationUniforms.animation_time.value += delta;
    };

    return cube;
}
