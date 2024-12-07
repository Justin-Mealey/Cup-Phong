import * as THREE from 'three';
export function createFireParticleSystem() {
    
    const particleGroup = new THREE.Group();
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
  
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    const alphaArray = new Float32Array(particlesCount);
  
    for (let i = 0; i < particlesCount; i++) {
      // Random initial position around a central point
      posArray[i * 3] = (Math.random() - 0.5) * 0.5;     // randx
      posArray[i * 3 + 1] = Math.random() * 2;           // randy
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.5; // randz
  
      // Initial velocity
      velocityArray[i * 3] = (Math.random() - 0.5) * 0.02;     // x velo
      velocityArray[i * 3 + 1] = Math.random() * 0.1 + 0.05;   // y velo
      velocityArray[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // z velo
  
      // Initial scale and alpha
      scaleArray[i] = Math.random() * 0.2 + 0.1;
      alphaArray[i] = Math.random();
    }
  
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    particlesGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphaArray, 1));
  
    const textureLoader = new THREE.TextureLoader();
    const fireTexture = textureLoader.load('./bg/fire_particle_texture.png');
  
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.3,
      map: fireTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  
    function animateFireParticles() {
      const positions = particlesGeometry.getAttribute('position');
      const velocities = particlesGeometry.getAttribute('velocity');
      const scales = particlesGeometry.getAttribute('scale');
      const alphas = particlesGeometry.getAttribute('alpha');
  
      for (let i = 0; i < particlesCount; i++) {
        // Update position
        positions.array[i * 3 + 1] += velocities.array[i * 3 + 1];
        positions.array[i * 3] += velocities.array[i * 3];
        positions.array[i * 3 + 2] += velocities.array[i * 3 + 2];
  
        if (positions.array[i * 3 + 1] > 2) {
          // Reset particle to bottom
          positions.array[i * 3 + 1] = 0;
          positions.array[i * 3] = (Math.random() - 0.5) * 0.5;
          positions.array[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  
          // Randomize velocity
          velocities.array[i * 3] = (Math.random() - 0.5) * 0.02;
          velocities.array[i * 3 + 1] = Math.random() * 0.1 + 0.05;
          velocities.array[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }
  
        // Fade and scale particles
        scales.array[i] *= 0.99;
        alphas.array[i] *= 0.98;
  
        if (scales.array[i] < 0.01) {
          scales.array[i] = Math.random() * 0.2 + 0.1;
          alphas.array[i] = Math.random();
        }
      }
  
      positions.needsUpdate = true;
      velocities.needsUpdate = true;
      scales.needsUpdate = true;
      alphas.needsUpdate = true;
    }
  
    return {
      particleSystem,
      animateFireParticles
    };
}
  
  