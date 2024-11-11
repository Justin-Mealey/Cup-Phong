export const planeData = [
    // Left face
    {
        position: { x: -50, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: false
    },

    // Right face
    {
        position: { x: 50, y: 0, z: 0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: false
    },

    // Top face
    {
        position: { x: 0, y: 50, z: 0 },
        rotation: { x: Math.PI / 2, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: true
    },

    // Bottom face
    {
        position: { x: 0, y: -50, z: 0 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: true
    },
];
