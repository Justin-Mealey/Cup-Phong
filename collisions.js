import * as THREE from 'three';

export function checkCollision(bounds, ball) {
    //direction is in POV of the following behind the ball
    const ballFront = ball.position.x - ball.radius;
    const ballBack = ball.position.x + ball.radius;
    const ballBottom = ball.position.y - ball.radius;
    const ballTop = ball.position.y + ball.radius;
    const ballLeft = ball.position.z - ball.radius;
    const ballRight = ball.position.z + ball.radius;

    for (const bound of bounds) {
        const xMin = bound[0][0];
        const xMax = bound[0][1];
        const yMin = bound[1][0];
        const yMax = bound[1][1];
        const zMin = bound[2][0];
        const zMax = bound[2][1];

        if ( (ballBack >= xMin && ballFront <= xMax) && 
             (ballTop >= yMin && ballBottom <= yMax) && 
             (ballRight >= zMin && ballLeft <= zMax)) { //COLLISION DETECTED
            if (Math.abs(ballBack - xMin) <= 0.2) { // hit front wall of box
                ball.position.x -= 0.2; 
                return 'x';
            }
            else if (Math.abs(ballFront - xMax) <= 0.2) { // hit back wall of box
                ball.position.x += 0.2; 
                return 'x';
            }
            else if (Math.abs(ballBottom - yMax) <= 0.2) { // hit top wall of box
                ball.position.y += 0.2; 
                return 'y';
            }
            else if (Math.abs(ballTop - yMin) <= 0.2) { // hit bottom wall of box
                ball.position.y -= 0.2; 
                return 'y';
            }
            else if (Math.abs(ballRight - zMin) <= 0.2) { // hit right wall of box
                ball.position.z -= 0.2; 
                return 'z';
            }
            else if (Math.abs(ballLeft - zMax) <= 0.2) { // hit left wall of box
                ball.position.z += 0.2; 
                return 'z';
            }
            else{
                console.log("Error: detected collision but none found")
            }
        }
    }
    
    return 'no reflect needed';
}

// ret[0][0][1] is box 0's x bound, max
// ret[4][1][0] is box 4's y bound, min
// ret[6][2][0] is box 6's z bound, min
export function getBounds(boxes){ 
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
        ],
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
    boxes.forEach(box =>{
        const boxBounds = new THREE.Box3().setFromObject(box);
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