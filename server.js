const N3 = require('n3');
const fs = require('fs');
const express = require("express")
const app = express()
const request = require('request');
const PORT = 8080

let json = null;
const prefixe = 'http://example.org/'
const turtleFile = fs.readFileSync('./minecraft.ttl', 'utf8');
const store = new N3.Store();
const parser = new N3.Parser();

// ------------------------------------ from test.js

function getTurtleFile() {
	parser.parse(turtleFile,
		(error, quad) => {
			if (error) {
				console.error(error);
			} else if (quad) {
				store.addQuad(quad);
			}
			else {
				console.log("Parsing terminé")
			}
		}
	)
}

function getJsonMinecraft() {
	request('https://minecraft-api.vercel.app/api/items', function (error, response, body) {
		json = JSON.parse(body);
		console.log("Import du json terminé");
	});
}

// --------------------------------------------------------------- Functions

function extractMaterialFromQuad(quads, left_or_right) {
	// Un set pour ne pas avoir de doublons
	const materialNamesSet = new Set();

	quads.forEach(quad => {
		// Soit on récupère le sujet, soit l'objet
		if (left_or_right == "right") {
			if (quad.subject && quad.subject.value) {
				materialNamesSet.add(getName(quad.subject.value));
			}
		}
		else {
			if (quad.object && quad.object.value) {
				materialNamesSet.add(getName(quad.object.value));
			}
		}
	});

	const materialNamesArray = [...materialNamesSet];
	return materialNamesArray
}

function getName(value) {
	return value.replace(prefixe, "");
}

function getQuad(subject, predicate, object) {
	return new Promise((resolve, reject) => {
		let quads = [];
		store.match(subject, predicate, object).forEach((quad) => {
			quads.push(quad);
		});

		// pour rendre cela asynchrone
		setImmediate(() => {
			resolve(quads);
		});
	});
}

function getCraft(material) {
	return new Promise((resolve, reject) => {
		let quads = [];
		console.log("subject" + prefixe + material)
		console.log("predicate" + prefixe + 'canCraft')
		console.log("object" + null)
		store.match(prefixe + material, prefixe + 'canCraft', null).forEach((quad) => {
			quads.push(quad);
		});

		// pour rendre cela asynchrone
		setImmediate(() => {
			resolve(quads);
		});
	});
}

function getRequireMaterialsForACraft(craft) {
	return new Promise((resolve, reject) => {
		let quads = [];
		store.match(null, prefixe + 'canCraft', prefixe + craft).forEach((quad) => {
			quads.push(quad);
		});

		// pour rendre cela asynchrone
		setImmediate(() => {
			resolve(quads);
		});
	});
}

function getNaturalMaterials() {
	return new Promise((resolve, reject) => {
		let quads = [];
		store.match(null, prefixe + 'isMaterial', null).forEach((quad) => {
			quads.push(quad);
		});

		// pour rendre cela asynchrone
		setImmediate(() => {
			resolve(quads);
		});
	});
}

function getInfoItem(itemName) {
	return json.find(item => item.namespacedId == itemName)
}

function fromTableTOJsonItem(table) {
	let itemInfos = []
	table.forEach(item => {
		itemInfos.push(getInfoItem(item));
	});
	return itemInfos;
}

function processQuads(quads, left_or_right) {
	materials = extractMaterialFromQuad(quads, left_or_right);
	// console.log(materials)
	return fromTableTOJsonItem(materials);
}

// --------------------------------------------------------------- Routes

app.get("/api", (req, res) => {
	res.send('Bienvenue')
})
// prefixe + material, prefixe + 'canCraft', null
app.get("/api/items/crafts/:material", async (req, res) => {
	// les crafts qui nécessitent le matériau
	try {
		const quads = await getQuad(prefixe + req.params.material, prefixe + 'canCraft', null);
		const process_quads = processQuads(quads, "left");
		res.send(process_quads);
	} catch (error) {
		console.error("Une erreur s'est produite :", error);
		res.status(500).send("Une erreur s'est produite");
	}
});

// les matériaux nécessaires pour un craft
app.get("/api/items/materials/:material", async (req, res) => {
	try {
		let quads = await getQuad(null, prefixe + 'canCraft', prefixe + req.params.material);
		const process_quads = processQuads(quads, "right");
		res.send({ process_quads });
	} catch (error) {
		console.error("Une erreur s'est produite :", error);
		res.status(500).send("Une erreur s'est produite");
	}
});

app.get("/api/items/:item", async (req, res) => {
	try {
		let item = getInfoItem(req.params.item);
		// récupère les crafts
		let crafts = await getQuad(prefixe + req.params.item, prefixe + 'canCraft', null);
		item.crafts = processQuads(crafts, "left");

		// // récupère les matériaux nécessaires
		let materials = await getQuad(null, prefixe + 'canCraft', prefixe + req.params.item);
		item.materials = processQuads(materials, "right")

		res.send(item);
	} catch (error) {
		console.error("Une erreur s'est produite :", error);
		res.status(500).send("Une erreur s'est produite");
	}
});

app.get("/api/naturalMaterials", async (req, res) => {
	try {
		let quads = await getQuad(null, prefixe + 'isMaterial', null);
		const process_quads = processQuads(quads, "right");
		res.send(process_quads);
	} catch (error) {
		console.error("Une erreur s'est produite :", error);
		res.status(500).send("Une erreur s'est produite");
	}
});




















// ------------------------------------ from test.js

const index = []

app.use("/css", express.static(__dirname + "/css"))
app.use("/js", express.static(__dirname + "/js"))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/html/index.html")
})

app.get("/item/:item_name", (req, res) => {
	console.log(req.params.item_name)
	res.sendFile(__dirname + "/html/item.html")
})

app.listen(PORT, () => {
	getTurtleFile();
	getJsonMinecraft();
	console.log("Serveur démarré sur le port PORT")
})
console.log(index)
