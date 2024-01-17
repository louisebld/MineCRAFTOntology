const N3 = require('n3');
const fs = require('fs');
const express = require("express")
const app = express()
const PORT = 8080

const request = require('request');

let json = null;

const prefixe = 'http://example.org/'

const turtleFile = fs.readFileSync('./minecraft.ttl', 'utf8');
const store = new N3.Store();
const parser = new N3.Parser();

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

function getCraft(material) {
    return new Promise((resolve, reject) => {
        let quads = [];
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
    return fromTableTOJsonItem(extractMaterialFromQuad(quads, left_or_right));
}

// --------------------------------------------------------------- Routes

app.get("/", (req, res) => {
    res.send('Bienvenue')
})

app.get("/objects/crafts/:material", async (req, res) => {
    // les crafts qui nécessitent le matériau
    try {
        const quads = await getCraft(req.params.material);
        const process_quads = processQuads(quads);
        res.send(process_quads);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        res.status(500).send("Une erreur s'est produite");
    }
});

// les matériaux nécessaires pour un craft
app.get("/objects/materials/:material", async (req, res) => {
    try {
        let quads = await getRequireMaterialsForACraft(req.params.material);
        const process_quads = processQuads(quads);
        res.send(process_quads);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        res.status(500).send("Une erreur s'est produite");
    }
});

app.get("/items/:item", async (req, res) => {
    try {
        console.log(req.params.item)
        let item = getInfoItem(req.params.item);
        // récupère les crafts
        let crafts = await getCraft(req.params.item);
        item.crafts = processQuads(crafts, "left");

        // récupère les matériaux nécessaires
        let materials = await getRequireMaterialsForACraft(req.params.item);
        item.materials = processQuads(materials, "right")

        res.send(item);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        res.status(500).send("Une erreur s'est produite");
    }
});

app.get("/naturalMaterials", (req, res) => {
})

app.listen(PORT, () => {
    getTurtleFile();
    getJsonMinecraft();
    console.log("Serveur démarré sur le port PORT")
})