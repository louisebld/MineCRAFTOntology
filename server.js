const express = require("express")
const app = express()

const index = []

app.use("/css", express.static(__dirname + "/css"))
app.use("/js", express.static(__dirname + "/js"))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/html/index.html")
})

app.get("/item", (req, res) => {
	res.sendFile(__dirname + "/html/item.html")
})

app.listen(8080)

console.log(index)
