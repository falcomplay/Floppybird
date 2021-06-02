const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // retourne un contexte de canvas sur le dessin voir doc
const img = new Image();
img.src = './media/flappy-bird-set.png';

// general settings

let gamePlaying = false ;
const gravity = .5;
const speed = 6.2;
const size = [51, 36];  // taille de l'oiseau
const jump = -11.5;
const cTenth = (canvas.width / 10);   // le dixième de l'écran

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipes = [];

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}



const render = () => {
    index++;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * ( speed / 2 )) % canvas.width) + canvas.width, 0, canvas.width, canvas.height ); // position background

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * ( speed / 2 )) % canvas.width) , 0, canvas.width, canvas.height ); // 2éme background pour effect continue


    if (gamePlaying) {  // click to play
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity;   // donne la gravité
        flyHeight = Math.min(flyHeight + flight, canvas.height -size[1]);  // donne la hauteur de l'oiseau
    
    } else {   // jeu en mode attente

    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width /2) - size[0] / 2), flyHeight, ...size); // position de l'oiseau et son emplacement voir doc
    flyHeight = (canvas.height / 2) - (size[1] / 2);  // position oiseau

    ctx.fillText(`Best score : ${bestScore}`, 85, 245);  // ici ce n'est pas des '' 
    ctx.fillText('Click to play', 90, 535);              // ici oui
    ctx.font = "bold 30px courier";
    }

    // pipe display
    if (gamePlaying) {
        pipes.map(pipe =>{
            pipe[0] -= speed;


            // top pipe
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);

            // bottom pipe 
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            if(pipe[0] <= -pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);

                // remove pipe + generate new one 

                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
                
            }

            //game over    
            if([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe [1] + pipeGap < flyHeight + size[1]].every(elem => elem)){
                gamePlaying = false;
                setup();
            }
        })
}

document.getElementById('bestScore').innerHTML = `meilleur : ${bestScore} `;
document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

window.requestAnimationFrame(render);

}

setup();

img.onload = render;

document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;