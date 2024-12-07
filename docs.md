# Files
- main.js - animation loop, setting up objects
- math.js - math functions for physics and transformations
- game_box.js - data structure for planes
- plane.js - plane initialization code
- ball.js - ball initialization code
- constants.js - fine-tune the gameplay
- cup.js - cup initialization code
- mouse.js - mouse event listener for click and drag interaction
- game_logic.js - keeps track of game variables
- text.js - text initialization code

## Ball Creation
Since we are in a zero-gravity environment, the ball needs to start with a velocity
```javascript
const ballRadius = 1;
let ballPosition = new THREE.Vector3(0, 0, 0);
let ballVelocity = new THREE.Vector3(-1, -0.2, 0);
const ball = createBall(ballRadius, ballPosition);
scene.add(ball);
```

## Game Box Creation
```javascript
const planes = createPlanes(planeData);
planes.forEach(plane => scene.add(plane));
```

### Data Structure for the planes
Located in obstacles.js
```javascript
{ //Left Face Example
        position: { x: -50, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        horizontal: false
    }
```

## Apply Translations
Just a shortcut for applying translations
If there's a faster way of doing this feel free to change it
```javascript
function applyTranslation(ball, tx, ty, tz) {
    const translation = translationMatrix(tx, ty, tz);
    let model_transform = new THREE.Matrix4(); 
    model_transform.multiplyMatrices(model_transform, translation) 
    ball.matrix.copy(model_transform);
    ball.matrixAutoUpdate = false;
    ball.position.setFromMatrixPosition(ball.matrix);
}
```

## Ball Physics
I did this by first detecting a collision
If there was a collision, then I'd update the velocity of the ball
The new translation applied is NEW POS = CURR POS + VELOCITY
This should be put in the animation loo
```javascript
    const tx = ball.position.x + ballVelocity.x;
    const ty = ball.position.y + ballVelocity.y;
    const tz = ball.position.z + ballVelocity.z;

    applyTranslation(ball, tx, ty, tz);

    planeData.forEach((plane, index) => {
        const hit_type = didCollide(ball, planeData[index]);
        if (hit_type !== null) {
            ballVelocity = updateVelocity(ball, ballRadius, ballVelocity, planeData[index], hit_type);
        }
    });
```

## Cup creation
Define the position of the cup. 
```javascript
const cupOnePosition = new THREE.Vector3(5, 0, 0);
const cupOne = createCup(cupOnePosition);
scene.add(cupOne);
```

## Cup plane creation
A RingGeometry placed at the left (larger radius) end of the cup. Used for collision detection. 
X-position of plane is x-position of cup -1.5
* x-position of cup - 1.5 is the exact end of cup, - 1.6 is to avoid visual glitches
```javascript
let cupOnePlanePosition = new THREE.Vector3(3.4, 0, 0);
let cupOnePlane = createCupPlane(0.3, cupOnePlanePosition);
scene.add(cupOnePlane);
```

## Mouse movement event listeners
The position and power can be displayed through console.log statements, although they are currently commented out. 
Add event listeners:
```javascript
setupEventListeners();
```

Later, if you want to remove the event listeners:
```javascript
cleanupEventListeners();
```

## Text creation
Currently, the font, size, and position of the text are hard-coded. However, they can easily be changed to arguments in createText(). 
You can also get directionalLight and ambientLight from createLights(), which makes the text look much better. 
```javascript
createText("Cup Phong").then((textMesh) => {
    scene.add(textMesh);
});

let { directionalLight, ambientLight } = createLights();
scene.add(directionalLight);
scene.add(ambientLight);
```