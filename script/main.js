document.addEventListener("DOMContentLoaded", () => setUp());

const NUM_HOLES = 6;

/**
 * @type {Array<Hole>}
 */
var holes = [];

var currentMole;

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

function beginGame(){
    currentMole = new Mole();
    console.log("Begining Game");
    console.log(currentMole.getRandomHole())
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
}


class Mole{
    currentHole;
    constructor(){
        
    }
    getRandomHole(){
        let index = Math.random()*(holes.length-1);
        index = Math.round(index);
        return holes[index];
    }
}