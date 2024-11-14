import * as THREE from 'three';
import { GAME_PROXIMITY_THRESHOLD } from './constants';

export function translationMatrix(tx, ty, tz) {
    return new THREE.Matrix4().set(
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    );
}

export function rotationMatrixX(theta) {
    return new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, Math.cos(theta), -Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

export function rotationMatrixY(theta) {
    return new THREE.Matrix4().set(
        Math.cos(theta), 0, Math.sin(theta), 0,
        0, 1, 0, 0,
        -Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

export function rotationMatrixZ(theta) {
    return new THREE.Matrix4().set(
        Math.cos(theta), -Math.sin(theta), 0, 0,
        Math.sin(theta), Math.cos(theta), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}
export function didCollide(ball, plane) {
    let PROXIMITY_THRESHOLD = GAME_PROXIMITY_THRESHOLD;
    if ((Math.abs(ball.position.y - plane.position.y) < PROXIMITY_THRESHOLD && plane.horizontal) || (Math.abs(ball.position.x - plane.position.x) < PROXIMITY_THRESHOLD && plane.horizontal == false)) {
        return plane.horizontal;
    }

    return null;  // No collision
}

export function updateVelocity(ball, ballRadius, ballVelocity, plane, horizontal) {
    if (horizontal == true && ball.position.y - ballRadius <= plane.position.y) {
        // console.log('Ball hit top');
        ballVelocity.y = -Math.abs(ballVelocity.y); 
    }
    else if (horizontal == true && ball.position.y + ballRadius >= plane.position.y) {
        // console.log('Ball hit bottom');
        ballVelocity.y = Math.abs(ballVelocity.y);
    }
    else if (horizontal == false && ball.position.x + ballRadius <= plane.position.x) {
        // console.log('Ball hit right');
        ballVelocity.x = -Math.abs(ballVelocity.x);
    }
    else if (horizontal == false && ball.position.x - ballRadius >= plane.position.x) {
        // console.log('Ball hit left');
        ballVelocity.x = Math.abs(ballVelocity.x);
    }
    return ballVelocity;
}