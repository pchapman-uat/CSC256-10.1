document.addEventListener("DOMContentLoaded", () => setUp());

const NUM_HOLES = 6;

/**
 * @type {Array<Hole>}
 */
var holes = [];


/**
 * @type {Mole}
 */
var currentMole;

const GAME_LEN = 10000;
const MOLE_SPEED = 1000;

var gameRunning = false;
function setUp(){
    var board = document.getElementById("board");
    for(let i=0; i<NUM_HOLES;i++){
        let hole = new Hole(i);
        holes.push(hole)
        board.appendChild(hole.makeElement());
    }
    var startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => beginGame())
}

async function beginGame(){
    currentMole = new Mole();
    console.log("Begining Game");
    gameRunning = true;
    console.log(currentMole.getRandomHole())
    currentMole.moveMole();
    gameLoop();
    await gameLen();
    gameRunning = false;
    console.log("Game Over")
    
}
function gameLen(){
    return new Promise(resolve => {
        setTimeout(() => { 
            resolve()
        }, GAME_LEN)
    })
}
function moleSpeed(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, MOLE_SPEED)
    })
}
async function gameLoop(){
    currentMole.getAndMove();
    while(gameRunning){
        await moleSpeed();
        console.log("Moving")
        currentMole.getAndMove();
    }
}

class Hole{
    index;
    constructor(index){
        this.index = index;
    }
    makeElement(){
        let holeDiv = document.createElement("div");
        holeDiv.classList.add("hole");
        holeDiv.setAttribute("id", this.getID());
        holeDiv.addEventListener("mouseover", (e) => this.startHover(e));
        holeDiv.addEventListener("", (e) => this.onClick(e));
        holeDiv.addEventListener("mouseleave", (e)=> this.stopHover(e))
        return holeDiv;
    }
    getElement(){
        return document.getElementById(this.getID())
    }
    getID(){
        return `hole-${this.index}`
    }
    /**
     * 
     * @param {MouseEvent} event 
     */
    startHover(event){
        console.log("Hovering");
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    onClick(event){
        console.log("Clicked")
    }
    /**
     * 
     * @param {MouseEvent} event 
     */
    stopHover(event){
        console.log("Stopped Hovering")
    }
    /**
     * 
     * @param {HTMLDivElement} moleElement 
     */
    loadMole(moleElement){
        let holeElement = document.getElementById(this.getID());
        console.log(holeElement)
        holeElement.appendChild(moleElement);
    }
}


class Mole{
    /**
     * @type {Hole} 
     */
    currentHole;
    getId(){
        return "MOLE"
    }
    getElement(){
        let moleElement = document.getElementById(this.getId());
        if(moleElement == null){
            return this.generateMoleElement();
        } else {
            return moleElement;
        }
    }
    getAndMove(){
        this.getRandomHole();
        this.moveMole();
    }
    moveMole(){
        if(this.currentHole != null){
            this.currentHole.loadMole(this.getElement());
        }
    }
    getRandomHole(){
        let index = Math.random()*(holes.length-1);
        index = Math.round(index);
        this.currentHole = holes[index];
        return this.currentHole;
    }
    generateMoleElement(){
        let element = document.createElement("div");
        element.classList.add("mole-div")
        element.setAttribute("id", this.getId());
        return element;
    }
}