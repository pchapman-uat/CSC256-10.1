document.addEventListener("DOMContentLoaded", () => setUp());

const holes = 6;

function setUp(){
    var board = document.getElementById("board");
    for(let i=0; i<holes;i++){
        let hole = document.createElement("div");
        hole.classList.add("hole");
        hole.setAttribute("id", `hole-${i}`);
        board.appendChild(hole);
        hole.addEventListener("mouseover", (e) => startHover(e));
        hole.addEventListener("click", (e) => onClick(e));
        hole.addEventListener("mouseleave", (e)=> stopHover(e))
    }
}

/**
 * 
 * @param {MouseEvent} event 
 */
function startHover(event){
    console.log("Hovering");
}

/**
 * 
 * @param {MouseEvent} event 
 */
function onClick(event){
    console.log("Clicked")
}
/**
 * 
 * @param {MouseEvent} event 
 */
function stopHover(event){
    console.log("Stopped Hovering")
}