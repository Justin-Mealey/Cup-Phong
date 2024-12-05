export var game_object = {
    set_xy_shot: false,
    shot_ball: false,
    cameraInTwoD: true,
    score: 0,
    rounds_left: 5,
    game_started: false,
};

export var game_text = {
    info_text: "Good Luck\n!!!"
}

export function updateOverlayText() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.textContent = game_text.info_text + "\nScore: " + game_object.score + "\nRounds Left: " + game_object.rounds_left;
    }
}

export function getScore() {
    const scoreText = document.getElementById('game-end-score-text');
    if(scoreText) scoreText.textContent = "Your Final Score: " + game_object.score;
    const overlay = document.getElementById('overlay');
    if(game_object.rounds_left <= 0) if(overlay) overlay.textContent = ":D"
}