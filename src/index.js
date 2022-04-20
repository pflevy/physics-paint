import "./styles.css";
import Matter from "matter-js";

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
export const render = Render.create({
  element: document.getElementById("gameCanvas"),
  engine: engine
});
render.options.wireframes = false;

var ground = Bodies.rectangle(800 / 2, 500 + 51, 800, 100, {
  isStatic: true
});
var leftWall = Bodies.rectangle(-51, 500 / 2, 100, 500, {
  isStatic: true
});
var rightWall = Bodies.rectangle(800 + 51, 500 / 2, 100, 500, {
  isStatic: true
});
// add all of the bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall]);

// run the renderer
Render.run(render);
// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

/// --

// Set the view to fullscreen
const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 800;
canvas.height = 500;
canvas.setAttribute("width", 800);
canvas.setAttribute("height", 500);

let cursorX, cursorY;
var element = document.getElementById("some-id");

function getCursorPosition(e) {
  var position = canvas.getBoundingClientRect();
  var x = position.left;
  var y = position.top;
  if (
    e.type == "touchstart" ||
    e.type == "touchmove" ||
    e.type == "touchend" ||
    e.type == "touchcancel"
  ) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    cursorX = touch.pageX;
    cursorY = touch.pageY;
  } else if (
    e.type == "mousedown" ||
    e.type == "mouseup" ||
    e.type == "mousemove" ||
    e.type == "mouseover" ||
    e.type == "mouseout" ||
    e.type == "mouseenter" ||
    e.type == "mouseleave"
  ) {
    cursorX = e.clientX - x;
    cursorY = e.clientY - y;
  }
}

let isDrawing = false;
document.addEventListener("mousedown", (e) => {
  isDrawing = true;
  handleDraw(e);
});

document.addEventListener("mouseup", (e) => {
  isDrawing = false;
});

const numOfDots = document.getElementById("numOfDots");
function updateNumOfDots() {
  numOfDots.innerHTML =
    "Dots: " + Matter.Composite.allBodies(engine.world).length;
}

//const currCursorPosition = document.getElementById("currCursorPosition");
document.addEventListener("mousemove", (e) => {
  // currCursorPosition.innerHTML = "x: " + e.clientX + "; y: " + e.clientY; // display on span
  if (isDrawing) {
    handleDraw(e);
  }
});

document.addEventListener("touchmove", (e) => {
  // currCursorPosition.innerHTML = "x: " + e.clientX + "; y: " + e.clientY; // display on span
  if (isDrawing) {
    handleDraw(e);
  }
});

let selectedSize = 3;
const sizeSlider = document.getElementById("sizeSlider");
function handleChangeSize(e) {
  selectedSize = e.target.value;
}
sizeSlider.addEventListener("change", (e) => handleChangeSize(e));

let selectedColor = "#0038E5";
function handleChangeColor(e) {
  selectedColor = e.target.value;
}
const selectColor = document.getElementById("selectColor");
selectColor.addEventListener("change", (e) => handleChangeColor(e));

function handleDraw(e) {
  updateNumOfDots();
  getCursorPosition(e);
  //draw
  let circle = Matter.Bodies.circle(cursorX, cursorY, selectedSize, {
    // mass: 0,
    // density: 0.5,
    // density: 0.004,
    // frictionAir: 0.01,
    restitution: 0.8,
    // friction: 0.3,
    label: "userCircle",
    // friction: 1,
    render: { fillStyle: selectedColor },
    isStatic: isStatic
    // frictionAir: 1
  }); // create two boxes and a ground
  // add all of the bodies to the world
  Composite.add(engine.world, [circle]);
}

const physicsValue = document.getElementById("physicsValue");
const getContainer = document.getElementById("container");
physicsValue.innerHTML = "Physics OFF";
let isStatic = true;
document.addEventListener("keyup", (e) => {
  const bodies = Matter.Composite.allBodies(engine.world).filter(
    (obj) => obj.label === "userCircle"
  );
  if (e.code === "Space") {
    if (isStatic) {
      physicsValue.innerHTML = "Physics ON";
      getContainer.classList.add("physicsOn");
      bodies.forEach((body) => Matter.Body.setStatic(body, false));
      //engine.world.gravity.y = 1;
    } else {
      physicsValue.innerHTML = "Physics OFF";
      getContainer.classList.remove("physicsOn");
      bodies.forEach((body) => Matter.Body.setStatic(body, true));
      //engine.world.gravity.y = 0;
    }
    isStatic = !isStatic;
  }
});

// const physicsSwitch = document.getElementById("physicsSwitch");
// console.log(physicsSwitch);
// physicsSwitch.addEventListener("change", function () {
//   const bodies = Matter.Composite.allBodies(engine.world).filter(
//     (obj) => obj.label === "userCircle",
//   );
//   if (this.checked) {
//     // physicsValue.innerHTML = "Physics ON";
//     getContainer.classList.add("physicsOn");
//     bodies.forEach((body) => Matter.Body.setStatic(body, false));
//   } else {
//     // physicsValue.innerHTML = "Physics OFF";
//     getContainer.classList.remove("physicsOn");
//     bodies.forEach((body) => Matter.Body.setStatic(body, true));
//   }
// });

const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", (e) => {
  Matter.Composite.allBodies(engine.world).forEach((obj) => {
    if (obj.label === "userCircle") Matter.World.remove(engine.world, obj);
  });
  updateNumOfDots();
});
