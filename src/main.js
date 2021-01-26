const playground = document.getElementById("playground");
const buglayer = document.getElementById("buglayer");
const statusBar = document.getElementById("statusBar");
const canvasFrame = document.getElementById("canvasFrame");
const options = document.getElementById("options");
const findPathBtn = document.getElementById("findPathBtn");
const getSnapshotBtn = document.getElementById("getSnapshotBtn");
const startX = document.getElementById("startx");
const startY = document.getElementById("starty");
const goalX = document.getElementById("goalx");
const goalY = document.getElementById("goaly");
/**
 * 
 * @param {number} width 
 * @param {number} height 
 */
function setPlaygroundSize(width, height) {
	playground.width = width;
	playground.height = height;
	playground.style.width = width + "px";
	playground.style.height = height + "px";
	playground.style.border = "1px solid black";
	statusBar.style.width = width + "px";
	options.style.width = width + "px";
	buglayer.style.top = playground.getBoundingClientRect().y + "px";
	buglayer.style.left = playground.getBoundingClientRect().x + "px";
	buglayer.width = width;
	buglayer.height = height;
	buglayer.style.width = width + "px";
	buglayer.style.height = height + "px";
	// buglayer.getContext("2d").setTransform(1,0,0,-1,0,buglayer.height);
	// drawPoint(buglayer, new Point(10, 10), 5, "red");
}

/**
 * @returns {Promise<void>}
 */
function setupPlayground() {
	return new Promise((res, rej) => {
		let ctx = playground.getContext("2d");
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
function setStatusRight(str) {
	let rightStatusBar = statusBar.getElementsByClassName("rightStatus")[0];
	rightStatusBar.innerHTML = str;
}

function setStatusLeft(str) {
	let leftStatusBar = statusBar.getElementsByClassName("leftStatus")[0];
	leftStatusBar.innerHTML = str;
}

buglayer.onmousemove = (event) => {
	let x = event.pageX - playground.getBoundingClientRect().left;
	let y = event.pageY + playground.getBoundingClientRect().top;
	setStatusRight(x + ", " + y);
}

buglayer.onmouseleave = () => {
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
 * @property {number} m
 * @property {number} c
 */
class Line {
	m;
	c;
	x_constant;
	/**
	 * 
	 * @param {number} m 
	 * @param {number} c 
	 */
	constructor(m , c, x_constant){
		this.m = m;
		this.c = c;
		this.x_constant = x_constant;
	}
}

/**
 * 
 * @param {Point} p
 * @param {number} r
 * @param {string} color
 */
function drawPoint(canvas, p, r, color) {
	let ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

setupPlayground().then(() => {
	// initial values for quick testing
	startX.value = 50;
	startY.value = 100;
	goalX.value = 500;
	goalY.value = 65;
	findPathBtn.onclick = () => {
		setupPlayground().then(() => {
			drawPoint(buglayer, new Point(startX.value, startY.value), 2, "green");
			drawPoint(buglayer, new Point(goalX.value, goalY.value), 2, "red");
			let bug = new Bug(new Bug1Strategy());
			let sensor = new TactileSensor(bug, 1);
			bug.mount(sensor);
			bug.set(new Point(parseInt(startX.value), -1*parseInt(startY.value)));
			bug.find(new Point(parseInt(goalX.value), -1*parseInt(goalY.value)));
		});
	}
	getSnapshotBtn.onclick = () => {
		let bug = new Bug(new Bug1Strategy());
		bug.set(new Point(parseInt(startX.value), parseInt(startY.value)));
		let sensor = new Sensor(bug, 100);
		bug.mount(sensor);
		let imgData = sensor.getSnapshot();
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');
		canvas.width = sensor.radius * 2;
		canvas.height = sensor.radius * 2;
		console.log(imgData);
		ctx.putImageData(imgData, 0, 0);
		var dataUri = canvas.toDataURL();
		let img = document.createElement("img");
		img.onload = () => {
			document.body.appendChild(img);
		}
		img.style.height = canvas.height + "px";
		img.style.width = canvas.width + "px";
		img.src = dataUri;
	}
});

class Bug {
	/**
 * @property {BugStrategy} strategy
 * @property {number} x
 * @property {number} y
 * @property {Sensor} sensor
 * @property {Point[]} trajectory
 */
	strategy;
	trajectory;
	trajectory_arr;
	constructor(strategy) {
		this.strategy = strategy;
		this.trajectory = {};
		this.trajectory_arr = []
;	}
	/**
	 * 
	 * @param {number} x 
	 */
	setX(x) {
		this.x = x;
	}
	/**
	 * 
	 * @param {number} y 
	 */
	setY(y) {
		this.y = y;
	}
	/**
	 * 
	 * @param {Point} p
	 */
	set(p) {
		this.setX(p.x);
		this.setY(p.y);
		if(this.trajectory[p.x]){
			this.trajectory[p.x].push(p.y);
		} else {
			this.trajectory[p.x] = [p.y];
		}
		this.trajectory_arr.push(p);
	}
	/**
	 * 
	 * @param {Point} p
	 */
	setMove(p) {
		this.set(p);
		// clearBuglayer();
		connectPoints(this.trajectory_arr);
	}
	/**
	 * 
	 * @param {Point} p 
	 */
	repeatBackUntilPoint(p){
		for(let i = this.trajectory_arr.length - 2; i >= 0; --i){
			this.set(new Point(this.trajectory_arr[i].x, this.trajectory_arr[i].y));
			if(this.trajectory_arr[i].x == p.x && this.trajectory_arr[i].y == p.y){
				break;
			}
		}
	}
	/**
	 * 
	 * @param {Sensor} sensor 
	 */
	mount(sensor) {
		this.sensor = sensor;
	}
	/**
	 * 
	 * @param {Point} p 
	 */
	find(p) {
		this.strategy.find(this, p);
	}
}

class BugStrategy {
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP) {

	}
}

class Bug1Strategy extends BugStrategy {
	constructor() {
		super();
	}
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP) {
		let num = 0;
		let line = getLineFromPoints(new Point(bug.x, bug.y), gP)
		let step = bug.x - gP.x <= 0 ? 1 : -1;
		while (num < 1000) {
			let point = this.findBoxOnShortestPath(bug, line, step);
			if (point.x == gP.x && point.y == gP.y) {
				bug.setMove(point);
				console.log("found goal");
				break;
			}
			if(num == 999){
				console.log("reached limit of iteration", bug.trajectory)
				break;
			}
			if(isCollision(point)){
				let min_point = this.circumnavigate(bug, point, gP);
				bug.repeatBackUntilPoint(min_point);
				console.log(bug, min_point);
				line = getLineFromPoints(new Point(bug.x, bug.y), gP);
				step = bug.x - gP.x <= 0 ? 1 : -1;
				console.log(line, step)
			} else {
				bug.setMove(point);
			}
			++num;
		}
	}
	/**
	 * 
	 * @param {Bug} bug 
	 * @param {Point} hit_point
	 * @param {Point} gP
	 * @returns {Point} 
	 */
	circumnavigate(bug, hit_point, gP){
		let point = new Point(hit_point.x, hit_point.y);
		let init_point = new Point(bug.x, bug.y);
		let dir;
		let checks = 0;
		let min_dist = -1;
		let min_point;
		// find initial dir and second point
		while(isCollision(point)){
			let obj = this.findBoxOnRight(bug, point);
			point = obj.point;
			dir = obj.dir;
			++checks;
			if(checks == 8){
				console.log("surrounded, cant find right point")
			}
		}
		bug.setMove(point);
		min_dist = getDistance(point, gP);
		// loop until we reach back at the init_point
		while(point.x != init_point.x || point.y != init_point.y){
			point = this.findBoxInDir(bug, dir);
			if(isCollision(point)){
				let checks = 0;
				while(isCollision(point)){
					let obj = this.findBoxOnRight(bug, point);
					point = obj.point;
					dir = obj.dir;
					++checks;
					if(checks == 8){
						console.log("surrounded, cant find right point")
					}
				}
			} else {
				let obj = this.findClosestToPerimeter(bug, dir);
				point = obj.point;
				dir = obj.dir;
			}
			bug.setMove(point);
			if(min_dist > getDistance(point, gP)){
				min_dist = getDistance(point, gP);
				min_point = point;
			}
		}
		return min_point;
	}

	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point} 
	 */
	findBoxOnShortestPath(bug, line, step) {
		let x = bug.x, y = bug.y;
		let sensor = bug.sensor;
		let imgData = sensor.getSnapshot();
		let height = imgData.height, width = imgData.width;
		let min_dist = -1;
		let min_point;
		let r = Math.floor(width/2);
		for (; r < width && r >= 0; r = r + step) {
			for (let c = 0; c < height; c++) {
				if(r  == sensor.radius && c == sensor.radius){
					continue;
				}
				if(bug.trajectory[x - sensor.radius + r] && bug.trajectory[x - sensor.radius + r].includes(y + sensor.radius - c)){
					continue;
				}
				let actual_p = new Point(x - sensor.radius + r, y + sensor.radius - c);
				let dist = linePointDistance(line, actual_p);
				if ((min_dist == -1) || (dist < min_dist)) {
					min_dist = dist;
					min_point = actual_p;

				}
			}
		}
		return min_point;
	}
	/**
	 * 
	 * @param {Bug} bug 
	 * @param {Point} new_point
	 * @returns {{point: Point, dir: number}}
	 */
	findBoxOnRight(bug, new_point){
		if(bug.x - 1 == new_point.x && bug.y + 1 == new_point.y){
			return {point: new Point(bug.x, bug.y + 1), dir: 1};
		}
		if(bug.x == new_point.x && bug.y + 1 == new_point.y){
			return {point: new Point(bug.x + 1, bug.y + 1), dir: 2};
		}
		if(bug.x + 1 == new_point.x && bug.y + 1 == new_point.y){
			return {point: new Point(bug.x + 1, bug.y), dir: 3};
		}
		if(bug.x + 1 == new_point.x && bug.y == new_point.y){
			return {point: new Point(bug.x + 1, bug.y - 1), dir: 4};
		}
		if(bug.x + 1 == new_point.x && bug.y - 1 == new_point.y){
			return {point: new Point(bug.x, bug.y - 1), dir: 5};
		}
		if(bug.x == new_point.x && bug.y - 1 == new_point.y){
			return {point: new Point(bug.x - 1, bug.y - 1), dir: 6};
		}
		if(bug.x - 1 == new_point.x && bug.y - 1 == new_point.y){
			return {point: new Point(bug.x - 1, bug.y), dir: 7};
		}
		if(bug.x - 1 == new_point.x && bug.y == new_point.y){
			return {point: new Point(bug.x - 1, bug.y + 1), dir: 0};
		}
	}
	/**
	 * 
	 * @param {Bug} bug 
	 * @param {number} curr_dir
	 * @returns {{point: Point, dir: number}}
	 */
	findBoxOnRightByDir(bug, curr_dir){
		if(curr_dir == 0){
			return {point: new Point(bug.x, bug.y + 1), dir: 1};
		}
		if(curr_dir == 1){
			return {point: new Point(bug.x + 1, bug.y + 1), dir: 2};
		}
		if(curr_dir == 2){
			return {point: new Point(bug.x + 1, bug.y), dir: 3};
		}
		if(curr_dir == 3){
			return {point: new Point(bug.x + 1, bug.y - 1), dir: 4};
		}
		if(curr_dir == 4){
			return {point: new Point(bug.x, bug.y - 1), dir: 5};
		}
		if(curr_dir == 5){
			return {point: new Point(bug.x - 1, bug.y - 1), dir: 6};
		}
		if(curr_dir == 6){
			return {point: new Point(bug.x - 1, bug.y), dir: 7};
		}
		if(curr_dir == 7){
			return {point: new Point(bug.x - 1, bug.y + 1), dir: 0};
		}
	}
	/**
	 * 
	 * @param {Bug} bug 
	 * @param {number} curr_dir 
	 */
	findBoxInDir(bug, curr_dir){
		if(curr_dir == 0){
			return new Point(bug.x - 1, bug.y + 1);
		}
		if(curr_dir == 1){
			return new Point(bug.x, bug.y + 1);
		}
		if(curr_dir == 2){
			return new Point(bug.x + 1, bug.y + 1);
		}
		if(curr_dir == 3){
			return new Point(bug.x + 1, bug.y)
		}
		if(curr_dir == 4){
			return new Point(bug.x + 1, bug.y - 1)
		}
		if(curr_dir == 5){
			return new Point(bug.x, bug.y - 1)
		}
		if(curr_dir == 6){
			return new Point(bug.x - 1, bug.y - 1)
		}
		if(curr_dir == 7){
			return new Point(bug.x - 1, bug.y)
		}
	}
	/**
	 * 
	 * @param {Bug} bug 
	 * @param {Point} point
	 * @returns {{point: Point, dir: number}} 
	 */
	findClosestToPerimeter(bug, dir){
		let checks = 0;
		while(checks < 8){
			let obj = this.findBoxOnLeft(bug, dir);
			let point = obj.point;
			if(isCollision(point)){
				return {point: this.findBoxInDir(bug, dir), dir};
			}
			dir = obj.dir;
			++checks;
		}
		console.log("something went wrong");
	}
	/**
	 * 
	 * @param {Point} point 
	 * @param {number} curr_dir
	 * @returns {{point: Point, dir: number}}
	 */
	findBoxOnLeft(bug, curr_dir){
		if(curr_dir == 0){
			return {point: new Point(bug.x - 1, bug.y), dir: 7};
		}
		if(curr_dir == 1){
			return {point: new Point(bug.x - 1, bug.y + 1), dir: 0};
		}
		if(curr_dir == 2){
			return {point: new Point(bug.x, bug.y + 1), dir: 1};
		}
		if(curr_dir == 3){
			return {point: new Point(bug.x + 1, bug.y + 1), dir: 2};
		}
		if(curr_dir == 4){
			return {point: new Point(bug.x + 1, bug.y), dir: 3};
		}
		if(curr_dir == 5){
			return {point: new Point(bug.x + 1, bug.y - 1), dir: 4};
		}
		if(curr_dir == 6){
			return {point: new Point(bug.x, bug.y - 1), dir: 5};
		}
		if(curr_dir == 7){
			return {point: new Point(bug.x - 1, bug.y - 1), dir: 6};
		}
	}
}

/**
 * @param {Point} sp
 * @param {Point} gp
 */
function getDistance(sp, gp) {
	return Math.sqrt((sp.x - gp.x) ** 2 + (sp.y - gp.y) ** 2);
}

/**
 * 
 * @param {Line} l 
 * @param {Point} p
 * @returns {number} 
 */
function linePointDistance(l, p){
	if(l.x_constant){
		return Math.abs(l.x_constant - p.x);
	}
	return Math.abs(l.m*p.x + l.c - p.y)/Math.sqrt(1 + l.m**2);
}

/**
 * 
 * @param {Point} p1 
 * @param {Point} p2
 * @returns {Line} 
 */
function getLineFromPoints(p1, p2){
	let m, c, x_constant;
	if(p1.x - p2.x != 0){
		m = (p1.y - p2.y) / (p1.x - p2.x);
		c = p1.y - m*p1.x;
	} else {
		x_constant = p1.x;
	}
	return new Line(m, c, x_constant);
}
function clearBuglayer(){
	let ctx = buglayer.getContext("2d");
	ctx.clearRect(0, 0, buglayer.width, buglayer.height);
}
/**
 * 
 * @param {Point[]} points 
 */
function connectPoints(points){
	if(points.length < 1){
		return;
	}
	let ctx = buglayer.getContext("2d");
	ctx.beginPath();
	for(let i = 1; i < points.length; i++){
		ctx.moveTo(points[i - 1].x, -1*points[i - 1].y);
		ctx.lineTo(points[i].x, -1*points[i].y);
	}
	ctx.strokeStyle = "orange";
	ctx.stroke();
}

/**
 * 
 * @param {Point} p
 * @returns {boolean} 
 */
function isCollision(p){
	let data = playground.getContext("2d").getImageData(p.x, -1*p.y, 1, 1).data;
	// opacity greater than 0 implies presence of some object
	if(data[3] > 0){
		return true;
	}
	return false;
}

class Bug2Strategy extends BugStrategy {
	constructor() {
		super();
	}
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP) {

	}
}

class TangentBugStrategy extends BugStrategy {
	constructor() {
		super();
	}
	/**
	 * @param {Bug} bug
	 * @param {Point} gP 
	 * @returns {Point[]} 
	 */
	find(bug, gP) {

	}
}
/**
 * @property {number} radius
 * @property {Bug} bug
 */
class Sensor {
	radius;
	bug;
	constructor(bug, radius) {
		this.bug = bug;
		this.radius = radius;
	}
	/**
	 * 
	 * @returns {CanvasImageData} 
	 */
	getSnapshot() {
		let x = this.bug.x, y = this.bug.y;
		let width = this.radius * 2 + 1;
		let height = this.radius * 2 + 1;

		let imgData = playground.getContext("2d").getImageData(x - this.radius, y - this.radius, width, height);
		for (let r = 0; r < width; r++) {
			for (let c = 0; c < height; c++) {
				if (Math.sqrt(Math.pow(this.radius - r, 2) + Math.pow(this.radius - c, 2)) > this.radius) {
					// console.log("yup")
					let ind = (width * r + c) * 4;
					imgData.data[ind] = 128;
					imgData.data[ind + 1] = 128;
					imgData.data[ind + 2] = 128;
					imgData.data[ind + 3] = 255;
				}
			}
		}
		return imgData;
	}
	setRadius(radius) {
		this.radius = radius;
	}
}
/**
 * @property {number} radius
 * @property {Bug} bug
 */
class TactileSensor extends Sensor {
	constructor(bug, radius) {
		super(bug, radius);
	}
	/**
	 * @returns {CanvasImageData}
	 */
	getSnapshot() {
		let x = this.bug.x, y = this.bug.y;
		let width = this.radius * 2 + 1, height = this.radius * 2 + 1;
		let imgData = playground.getContext("2d").getImageData(x - this.radius, -1*y - this.radius, width, height);
		return imgData;
	}
}