const playround = document.getElementById("playground");
const buglayer = document.getElementById("buglayer");
const statusBar = document.getElementById("statusBar");
const canvasFrame = document.getElementById("canvasFrame");
const options = document.getElementById("options");
const findPathBtn = document.getElementById("findPathBtn");
const startX = document.getElementById("startx");
const startY = document.getElementById("starty");
const goalX = document.getElementById("goalx");
const goalY = document.getElementById("goaly");
/**
 * 
 * @param {number} width 
 * @param {number} height 
 */
function setPlaygroundSize(width, height){
	playround.width = width;
	playround.height = height;
	playround.style.width = width + "px";
	playround.style.height = height + "px";
	playround.style.border = "1px solid black";
	statusBar.style.width = width + "px";
	options.style.width = width + "px";
	buglayer.style.top = playround.getBoundingClientRect().y + "px";
	buglayer.style.left = playround.getBoundingClientRect().x + "px";
	buglayer.width = width;
	buglayer.height = height;
	buglayer.style.width = width + "px";
	buglayer.style.height = height + "px";
}

/**
 * @returns {Promise<void>}
 */
function setupPlayground() {
	return new Promise((res, rej) => {
		let ctx = playround.getContext("2d");
		let img = new Image();
		img.onload = () => {
			setPlaygroundSize(img.width, img.height);
			ctx.drawImage(img, 0, 0);
			res();
		}
		img.src = "./assets/robotics_hw1_part2.png";
	});
}

/**
 * 
 * @param {string} str 
 */
function setStatusRight(str){
	let rightStatusBar = statusBar.getElementsByClassName("rightStatus")[0];
	rightStatusBar.innerHTML = str;
}

function setStatusLeft(str){
	let leftStatusBar = statusBar.getElementsByClassName("leftStatus")[0];
	leftStatusBar.innerHTML = str;
}

buglayer.onmousemove = (event)=>{
	let x = event.pageX - playround.getBoundingClientRect().left;
	let y = event.pageY - playround.getBoundingClientRect().top;
	setStatusRight(x + ", " + y);
}

buglayer.onmouseleave = ()=>{
	setStatusRight("");
	setStatusLeft("");
}

/**
 * @property {number} x
 * @property {number} y
 */
class Point {
	x;
	y;
	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

/**
 * 
 * @param {Point} p
 * @param {number} r
 * @param {string} color
 */
function drawPoint(p, r, color) {
	let ctx = playround.getContext("2d");
	ctx.beginPath();
	ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

setupPlayground().then(() => {
	// initial values for quick testing
	startX.value = 50;
	startY.value = 100;
	goalX.value = 497;
	goalY.value = 67;
	findPathBtn.onclick = ()=>{
		setupPlayground().then(()=>{
			drawPoint(new Point(startX.value, startY.value), 2, "green");
			drawPoint(new Point(goalX.value, goalY.value), 2, "red");
		});
	}
});

/**
 * @property {BugStrategy} strategy
 * @property {number} x
 * @property {number} y
 * @property {Sensor} sensor
 */
class Bug {
	strategy;
	constructor(strategy){
		this.strategy = strategy;
	}
	/**
	 * 
	 * @param {number} x 
	 */
	setX(x){
		this.x = x;
	}
	/**
	 * 
	 * @param {number} y 
	 */
	setY(y){
		this.y = y;
	}
	/**
	 * 
	 * @param {Point} p
	 */
	set(p){
		this.setX(p.x);
		this.setY(p.y);
	}
	/**
	 * 
	 * @param {Sensor} sensor 
	 */
	mount(sensor){
		this.sensor = sensor;
	}
	/**
	 * 
	 * @param {Point} p 
	 */
	find(p){
		this.strategy.find(this, p);
	}
}

class BugStrategy {
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP){

	}
}

class Bug1Strategy extends BugStrategy {
	constructor(){
		super();
	}
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP){

	}
}

class Bug2Strategy extends BugStrategy {
	constructor(){
		super();
	}
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP){

	}
}

class TangentBugStrategy extends BugStrategy {
	constructor(){
		super();
	}
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP){

	}
}

class Sensor {
	/**
	 * 
	 * @param {Bug} bug 
	 */
	getSnapshot(bug){
		let x = bug.x, y = bug.y;
		
	}
}