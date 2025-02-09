import * as THREE from 'three';

export function createPortals(){
    const p1g = new THREE.BoxGeometry(.5, 8, 2);
    const p1m = new THREE.MeshBasicMaterial({ color: 0xCC00CC, wireframe: false });
    const p1 = new THREE.Mesh(p1g, p1m);

    const p2g = new THREE.BoxGeometry(.5, 8, 2);
    const p2m = new THREE.MeshBasicMaterial({ color: 0xCC00CC, wireframe: false });
    const p2 = new THREE.Mesh(p2g, p2m);

    const p3g = new THREE.BoxGeometry(.5, 8, 2);
    const p3m = new THREE.MeshBasicMaterial({ color: 0xFF5F1F, wireframe: false });
    const p3 = new THREE.Mesh(p3g, p3m);

    const p4g = new THREE.BoxGeometry(.5, 8, 2);
    const p4m = new THREE.MeshBasicMaterial({ color: 0xFF5F1F, wireframe: false });
    const p4 = new THREE.Mesh(p4g, p4m);

    return [p1, p2, p3, p4]
}

export function checkTeleport(bounds, ball) {
    const ballLeft = ball.position.x - ball.radius;
    const ballRight = ball.position.x + ball.radius;
    const ballBottom = ball.position.y - ball.radius;
    const ballTop = ball.position.y + ball.radius;
    const ballZLeft = ball.position.z - ball.radius;
    const ballZRight = ball.position.z + ball.radius;

    // Magenta portals connected
    let portalA = bounds[0]
    let portalB = bounds[1]
    
    const xMinA = portalA[0][0];
    const xMaxA = portalA[0][1];
    const yMinA = portalA[1][0];
    const yMaxA = portalA[1][1];
    const zMinA = portalA[2][0];
    const zMaxA = portalA[2][1];
    if ( (ballRight >= xMinA && ballLeft <= xMaxA) && 
         (ballTop >= yMinA && ballBottom <= yMaxA) && 
         (ballZRight >= zMinA && ballZLeft <= zMaxA)) { 
        if (Math.abs(ballRight - xMinA) <= 0.2) { 
            ball.position.x = portalB[0][1]
            ball.position.y = (portalB[1][0] + portalB[1][1]) / 2
            ball.position.z = (portalB[2][0] + portalB[2][1]) / 2
            return
        }
    }


    const xMinB = portalB[0][0];
    const xMaxB = portalB[0][1];
    const yMinB = portalB[1][0];
    const yMaxB = portalB[1][1];
    const zMinB = portalB[2][0];
    const zMaxB = portalB[2][1];
    if ( (ballRight >= xMinB && ballLeft <= xMaxB) && 
         (ballTop >= yMinB && ballBottom <= yMaxB) && 
         (ballZRight >= zMinB && ballZLeft <= zMaxB)) { 
        if (Math.abs(ballRight - xMinB) <= 0.2) { 
            ball.position.x = portalA[0][1]
            ball.position.y = (portalA[1][0] + portalA[1][1]) / 2
            ball.position.z = (portalA[2][0] + portalA[2][1]) / 2
            return
        }
    }

    // Orange portals are connected
    let portalC = bounds[2]
    let portalD = bounds[3]
    
    const xMinC = portalC[0][0];
    const xMaxC = portalC[0][1];
    const yMinC = portalC[1][0];
    const yMaxC = portalC[1][1];
    const zMinC = portalC[2][0];
    const zMaxC = portalC[2][1];
    if ( (ballRight >= xMinC && ballLeft <= xMaxC) && 
         (ballTop >= yMinC && ballBottom <= yMaxC) && 
         (ballZRight >= zMinC && ballZLeft <= zMaxC)) { 
        if (Math.abs(ballRight - xMinC) <= 0.2) { 
            ball.position.x = portalD[0][1]
            ball.position.y = (portalD[1][0] + portalD[1][1]) / 2
            ball.position.z = (portalD[2][0] + portalD[2][1]) / 2
            return
        }
    }

    const xMinD = portalD[0][0];
    const xMaxD = portalD[0][1];
    const yMinD = portalD[1][0];
    const yMaxD = portalD[1][1];
    const zMinD = portalD[2][0];
    const zMaxD = portalD[2][1];
    if ( (ballRight >= xMinD && ballLeft <= xMaxD) && 
         (ballTop >= yMinD && ballBottom <= yMaxD) && 
         (ballZRight >= zMinD && ballZLeft <= zMaxD)) { 
        if (Math.abs(ballRight - xMinD) <= 0.2) { 
            ball.position.x = portalC[0][1]
            ball.position.y = (portalC[1][0] + portalC[1][1]) / 2
            ball.position.z = (portalC[2][0] + portalC[2][1]) / 2
            return
        }
    }
    
    return
}

export function getPortalBounds(portals){ 
    let ret = [
        [
            [[],[]],[[],[]],[[],[]]
        ],
        [
            [[],[]],[[],[]],[[],[]]
        ],
        [
            [[],[]],[[],[]],[[],[]]
        ],
        [
            [[],[]],[[],[]],[[],[]]
        ]
    ]
    
    let i = 0
    portals.forEach(portal =>{
        const boxBounds = new THREE.Box3().setFromObject(portal);
        ret[i][0][0] = boxBounds.min['x']
        ret[i][0][1] = boxBounds.max['x']

        ret[i][1][0] = boxBounds.min['y']
        ret[i][1][1] = boxBounds.max['y']
        
        ret[i][2][0] = boxBounds.min['z']
        ret[i][2][1] = boxBounds.max['z']

        i++
    })

    return ret
}