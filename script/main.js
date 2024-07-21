document.addEventListener("DOMContentLoaded", () => setUp());

/**
 * Number of holes on the board
 * @type {number}
 */
const NUM_HOLES = 6;

/**
 * This in an array of all of the holes on the board.
 * @type {Array<Hole>}
 * @see {@link NUM_HOLES} Array size is based this
 */
var holes = [];


/**
 * The current mole of the game, this will not often change
 * @type {Mole}
 */
var currentMole;

/**
 * Total Duration of the Game
 * @type {number} time in milliseconds 
 */
const GAME_LEN = 10000;

/**
 * Duration the mole is visible
 * @type {number} time in milliseconds 
 */
const MOLE_SPEED = 1000;
/**
 * How long the mole is hidden
 * @type {number} time in milliseconds 
 */
const HIDDEN_LEN = 250;


/**
 * If the game is currently running
 * @type {boolean}
 */
var gameRunning = false;

/**
 * Set up the game.
 * - Add hole objects to the {@link holes} array
 * - Add the start button event listener
 * 
 * @see {@link holes} - Holes array
 * @see {@link Hole} - Hole class used for objects
 */
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

/**
 * Begin the game.
 * @see {@link gameLoop} - Game loop function
 * @see {@link gameLen} - Game length promise
 * @see {@link gameRunning} - Game running boolean
 */
async function beginGame(){
    currentMole = new Mole();
    console.log("Begining Game");
    gameRunning = true;
    currentMole.moveMole();
    gameLoop();
    await gameLen();
    gameRunning = false;
    console.log("Game Over")
    
}

/**
 * Return a promise once the game has finished
 * @returns {Promise<void>} - Promise after {@link GAME_LEN}
 * @see {@link GAME_LEN} - Game length
 */
function gameLen(){
    return new Promise(resolve => {
        setTimeout(() => { 
            resolve()
        }, GAME_LEN)
    })
}
/**
 * Return a promise once the mole has finished moving
 * @returns {Promise<void>} - Promise after {@link MOLE_SPEED}
 */
function moleSpeed(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, MOLE_SPEED)
    })
}

/**
 * Return a promise once the mole has finished hiding
 * @returns {Promise<void>} - Promise after {@link HIDDEN_LEN}
 */
function hideLen(){
    return new Promise(resolve => {
        setTimeout(()=> {
            resolve();
        }, HIDDEN_LEN)
    })
}

/**
 * Game loop function.
 * @see {@link gameRunning} - Game running boolean
 * @see {@link currentMole} - Current mole object
 * @see {@link Mole.getAndMove} - Mole get and move function
 * @see {@link Mole.removeMole} - Mole remove mole function
 * @see {@link Mole.hideMole} - Mole hide mole function
 */
async function gameLoop(){
    await currentMole.getAndMove();
    while(gameRunning){
        await moleSpeed();
        if(!gameRunning) {
            await currentMole.hideMole();
        }
        console.log("Moving")
        await currentMole.getAndMove();
    }
    currentMole.removeMole();
}

class Hole{
    /**
     * @type {number} index of the hole
     */
    index;
    constructor(index){
        this.index = index;
    }
    /**
     * Create the element for the hole
     * - Add class list hole
     * - Add ID {@link Hole.getID}
     * - Add event listeners for mouseover, mouseleave, and click events
     * @returns {HTMLDivElement} - Element of the hole
     * @see {@link Hole.stopHover} - Stop hover function
     * @see {@link Hole.onClick} - On click function
     * @see {@link Hole.startHover} - Start hover function
     */
    makeElement(){
        let holeDiv = document.createElement("div");
        holeDiv.classList.add("hole");
        holeDiv.setAttribute("id", this.getID());
        holeDiv.addEventListener("mouseover", (e) => this.startHover(e));
        holeDiv.addEventListener("click", (e) => this.onClick(e));
        holeDiv.addEventListener("mouseleave", (e)=> this.stopHover(e))
        return holeDiv;
    }
    /**
     * Get the element of the hole based on the ID
     * @returns {?HTMLDivElement} - Element of the hole, will be null if it does not exist
     * @see {@link Hole.getID} - Get ID of the hole
     */
    getElement(){
        return document.getElementById(this.getID())
    }
    /**
     * Get the ID of the hole based on the index
     * @returns {string} - ID of the hole
     * @see {@link Hole.index}
     */
    getID(){
        return `hole-${this.index}`
    }
    /**
     * On hovering event
     * @param {MouseEvent} event 
     * @deprecated Not used
     */
    startHover(event){
        console.log("Hovering");
    }

    /**
     * On Click Event
     * @param {MouseEvent} event 
     * @deprecated Not used
     */
    onClick(event){
        console.log("Clicked")
    }
    /**
     * On Hover Event
     * @param {MouseEvent} event 
     * @deprecated Not Used
     */
    stopHover(event){
        console.log("Stopped Hovering")
    }
    /**
     * Load a mole using the mole element
     * - Will appened the mole element to the hole element
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
     * @type {number} - Length of the animation in milliseconds
     */
    aniLen = 1000;
    /**
     * @type {?Hole} - Current hole the mole is at, will be null if the mole is not at a hole
     */
    currentHole;
    /**
     * @type {string} - ID string for the mole
     */
    id = "MOLE";
    /**
     * Get the HTML mole element, if it does not exist, it will generate it
     * @returns {HTMLDivElement} - Element of the mole
     * @see {@link Mole.generateMoleElement} - Generation of the new mole element
     * @see {@link Mole.id} - ID of the mole
     */
    getElement(){
        let moleElement = document.getElementById(this.id);
        if(moleElement == null){
            return this.generateMoleElement();
        } else {
            return moleElement;
        }
    }
    /**
     * Begin the hiding animation
     * @returns {Promise<Void>} Promise of with the animation has finished
     * @see {@link Mole.getElement} - Get the mole element
     * @see {@link Mole.aniLen} - Length of the animation
     */
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
    /**
     * Begin the showing animation
     * @returns {Promise<void>} Promise of when the animation has finished
     * @see {@link Mole.getElement} - Get the mole element
     * @see {@link Mole.aniLen} - Length of the animation
     */
    showAnimation(){
        console.log("Showing Animation")
        this.getElement().style.animation = `showMole ${this.aniLen/1000}s`
        return new Promise(resolve => {
            setTimeout(()=>{
                console.log("Animation over")
                resolve();
            }, this.aniLen-10)
        })
    }
    /**
     * Begin hiding the mole
     * - Begins the hiding animation
     * - Once finished hide the element and remove the animation
     * @see {@link Mole.hideAnimation} - Hide animation
     * @see {@link Mole.getElement} - Get the mole element
     */
    async hideMole(){
        await this.hideAnimation();
        this.getElement().hidden = true;
        this.getElement().style.animation = ""
    }
    /**
     * Show the mole
     * - Unhides the mole element
     * @see {@link Mole.getElement} - Get the mole element
     */
    showMole(){
        this.getElement().hidden = false;
    }
    /**
     * Get the mole element and move it to a random hole, if it is not at a hole, it will hide the mole first
     * @returns {Promise<void>} Promise of when the mole has finished moving
     * @see {@link Mole.hideMole} - Hide the mole
     * @see {@link hideLen} - Length of the hiding animation
     * @see {@link Mole.getRandomHole} - Get a random hole
     * @see {@link Mole.moveMole} - Move the mole to the hole
     * @see {@link Mole.showMole} - Show the mole
     * @see {@link Mole.showAnimation} - Show the animation
     * @see {@link Mole.getElement} - Get the mole element
     */
    async getAndMove(){
        if(this.currentHole != null){
            await this.hideMole();
            await hideLen();
        }
        this.getRandomHole();
        this.moveMole();
        this.showMole();
        await this.showAnimation();
        this.getElement().style.animation = ""
        return;
  
    }
    /**
     * Move the mole to a hole
     * - Will load the mole element into the hole element if there is a hole
     * @see {@link Hole.loadMole} - Load the mole into the hole
     * @see {@link Mole.getElement} - Get the mole element
     */
    moveMole(){
        if(this.currentHole != null){
            this.currentHole.loadMole(this.getElement());
        }
    }
    /**
     * Get a random hole based on the aviaiable holes
     * @returns {Hole} - Returns {@link Mole.currentHole}
     * @see {@link holes} - Holes array
     */
    getRandomHole(){
        let index = Math.random()*(holes.length-1);
        index = Math.round(index);
        this.currentHole = holes[index];
        return this.currentHole;
    }
    /**
     * Generate a new hole element
     * - Add the class `mole-div`
     * - Add the ID attrubute of {@link Mole.id}
     * @returns {HTMLDivElement} - Generates a new mole element
     */
    generateMoleElement(){
        let element = document.createElement("div");
        element.classList.add("mole-div")
        element.setAttribute("id", this.id);
        return element;
    }
    /**
     * Remove the mole element
     * @see {@link Mole.getElement} - Get the mole element
     */
    removeMole(){
        this.getElement().remove();
    }
}