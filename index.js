const express = require("express");
const app = express();
app.use(express.static("src"));
app.get("/", (req, res)=>{
	res.sendFile("./src/index.html");
});
const port = parseInt(process.env.PORT) || 5000;
app.listen(port, ()=>{
	console.log("program started on port", port);
});