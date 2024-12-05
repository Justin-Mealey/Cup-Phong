import { GAME_BOUND_X } from "./constants";

export const planeData = [
    // Left face
    {
        position: { x: 50, y: 0, z: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: GAME_BOUND_X, y: 32, z: 1 },
        horizontal: false
    },

    // Right face
    {
        position: { x: 50, y: 0, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: GAME_BOUND_X, y: 32, z: 1 },
        horizontal: false
    },

    // Top face
    {
        position: { x: 50, y: 16, z: 0 },
        rotation: { x: Math.PI / 2, y: 0, z: 0 },
        scale: { x: GAME_BOUND_X, y: 20, z: 1 },
        horizontal: true
    },

    // Bottom face
    {
        position: { x: 50, y: -16, z: 0 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        scale: { x: GAME_BOUND_X, y: 20, z: 1 },
        horizontal: true
    },
];
