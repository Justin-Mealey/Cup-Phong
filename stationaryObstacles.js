import * as THREE from 'three';

export function setupStationaryObstacles(){
    const b1g = new THREE.BoxGeometry(4, 0.5, 2);
    const b1m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b1 = new THREE.Mesh(b1g, b1m);

    const b2g = new THREE.BoxGeometry(3.5, 0.5, 2);
    const b2m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b2 = new THREE.Mesh(b2g, b2m);

    const b3g = new THREE.BoxGeometry(3, 0.5, 2);
    const b3m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b3 = new THREE.Mesh(b3g, b3m);

    const b4g = new THREE.BoxGeometry(2.5, 0.5, 2);
    const b4m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b4 = new THREE.Mesh(b4g, b4m);

    const b5g = new THREE.BoxGeometry(2, 0.5, 2);
    const b5m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b5 = new THREE.Mesh(b5g, b5m);

    const b6g = new THREE.BoxGeometry(1.5, 0.5, 2);
    const b6m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b6 = new THREE.Mesh(b6g, b6m);

    const b7g = new THREE.BoxGeometry(1, 0.5, 2);
    const b7m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b7 = new THREE.Mesh(b7g, b7m);

    const b8g = new THREE.BoxGeometry(2.25, 0.5, 2);
    const b8m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b8 = new THREE.Mesh(b8g, b8m);

    const b9g = new THREE.BoxGeometry(3.25, 0.5, 2);
    const b9m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b9 = new THREE.Mesh(b9g, b9m);

    const b10g = new THREE.BoxGeometry(1.25, 0.5, 2);
    const b10m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b10 = new THREE.Mesh(b10g, b10m);

    const b11g = new THREE.BoxGeometry(1.75, 0.5, 2);
    const b11m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b11 = new THREE.Mesh(b11g, b11m);

    const b12g = new THREE.BoxGeometry(3.75, 0.5, 2);
    const b12m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b12 = new THREE.Mesh(b12g, b12m);

    const b13g = new THREE.BoxGeometry(4.5, 0.5, 2);
    const b13m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b13 = new THREE.Mesh(b13g, b13m);

    const b14g = new THREE.BoxGeometry(5, 0.5, 2);
    const b14m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b14 = new THREE.Mesh(b14g, b14m);

    const b15g = new THREE.BoxGeometry(2.75, 0.5, 2);
    const b15m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b15 = new THREE.Mesh(b15g, b15m);

    const b16g = new THREE.BoxGeometry(3.25, 0.5, 2);
    const b16m = new THREE.MeshBasicMaterial({ color: 0x0096FF, wireframe: false });
    const b16 = new THREE.Mesh(b16g, b16m);

    const stationaryObstacles = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16]
    let include = [true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false]
    //randomize what indeces hold true
    for (let i = include.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [include[i], include[j]] = [include[j], include[i]];
    }
    //add 8 boxes to the list we actually use
    const usedStationaryObstacles = stationaryObstacles.filter((_, index) => include[index]);

    const cg = new THREE.BoxGeometry(30, 2, 10);
    const cm = new THREE.MeshBasicMaterial({ color: 0xaaccb8, wireframe: false });
    const ceiling = new THREE.Mesh(cg, cm);
    
    const fg = new THREE.BoxGeometry(30, 2, 10);
    const fm = new THREE.MeshBasicMaterial({ color: 0xaaccb8, wireframe: false });
    const floor = new THREE.Mesh(fg, fm);

    return {usedStationaryObstacles, floor, ceiling}
}