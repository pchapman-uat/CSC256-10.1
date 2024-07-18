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
const HIDDEN_LEN = 250;


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
function hideLen(){
    return new Promise(resolve => {
        setTimeout(()=> {
            resolve();
        }, HIDDEN_LEN)
    })
}
async function gameLoop(){
    await currentMole.getAndMove();
    while(gameRunning){
        await moleSpeed();
        if(!gameRunning) break;
        console.log("Moving")
        await currentMole.getAndMove();
    }
    currentMole.removeMole();
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
    aniLen = 1000;
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
    hideAnimation(){
        console.log("Hiding Animation")
        this.getElement().style.animation = `hideMole ${this.aniLen/1000}s`
        return new Promise(resolve => {
            setTimeout(() => {
                console.log("Animation Over")
                resolve();
            },  this.aniLen-5)
        })
    }
    showAnimation(){
        console.log("Showing Animation")
        this.getElement().style.animation = `showMole ${this.aniLen/1000}s`
        return new Promise(resolve => {
            setTimeout(()=>{
                console.log("Animation over")
                resolve();
            }, this.aniLen-5)
        })
    }
    hideMole(){
        this.getElement().hidden = true;
        this.getElement().style.animation = ""
    }
    showMole(){
        this.getElement().hidden = false;
    }
    async getAndMove(){
        await this.hideAnimation();
        this.hideMole();
        await hideLen();
        this.getRandomHole();
        this.moveMole();
        this.showMole();
        await this.showAnimation();
        this.getElement().style.animation = ""
        return;
  
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
    removeMole(){
        this.getElement().remove();
    }
}