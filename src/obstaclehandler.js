const obstacleBtn = document.getElementById("addObstacleBtn");
const obstacleInput = document.getElementById("obstacleInput");
const clearAllBtn = document.getElementById("clearAllBtn");
obstacleBtn.onclick = function(){
	parseInput();
}
clearAllBtn.onclick = function(){
	clearAll();
}
var obstacles = [];

function parseInput(){
	let str = obstacleInput.value;
	console.log(str);
	str = str.replace(/\(/g, "[").replace(/\)/g, "]");
	str = "[" + str + "]";
	console.log(str);
	try {
		let arr = eval(str);
		console.log("arr", arr)
		let res = []
		for(let i = 0; i < arr.length; i++){
			let cx = arr[i][0][0];
			let cy = arr[i][0][1];
			let r = arr[i][1];
			addCircleObstacle(cx, cy, r);
		}
	} catch {
		alert("Bad Input: Input obstacles in form ((3, 2), 1), ((4, 5), 3)");
	}
}

function addCircleObstacle(cx, cy, r){
	obstacles.push({type: "circle", cx, cy, r});
	let ctx = playground.getContext("2d");
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI*2);
	ctx.fill();
}

function clearAll(){
	playground.getContext("2d").clearRect(0, 0, playground.width, playground.height);
	buglayer.getContext("2d").clearRect(0, 0, buglayer.width, buglayer.height);
}