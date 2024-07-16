document.addEventListener("DOMContentLoaded", () => setUp());

const holes = 6;

function setUp(){
    var board = document.getElementById("board");
    for(let i=0; i<holes;i++){
        let hole = document.createElement("div");
        hole.classList.add("hole");
        hole.setAttribute("id", `hole-${i}`);
        board.appendChild(hole);
    }
}