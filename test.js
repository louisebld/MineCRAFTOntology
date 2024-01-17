const N3 = require('n3');
const fs = require('fs');
const express = require("express")
const app = express()
const PORT = 8080

const request = require('request');

let json = null;

const prefixes = {
    ex: 'http://example.org/'
};

const turtleFile = fs.readFileSync('./minecraft.ttl', 'utf8');
const store = new N3.Store();
const parser = new N3.Parser();

function getTurtleFile() {
    parser.parse(turtleFile,
        (error, quad, prefixes) => {
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
    const materialNamesSet = new Set();

    quads.forEach(quad => {

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
    return value.replace(prefixes.ex, "");
}

function getCraft(material) {
    return new Promise((resolve, reject) => {
        let quads = [];
        store.match(prefixes.ex + material, prefixes.ex + 'canCraft', null).forEach((quad) => {
            quads.push(quad);
            console.log("quads", quads);
        });

        // Utiliser setImmediate pour rendre cela asynchrone
        setImmediate(() => {
            resolve(quads);
        });
    });
}

function getRequireMaterialsForACraft(craft) {
    return new Promise((resolve, reject) => {
        let quads = [];
        store.match(null, prefixes.ex + 'canCraft', prefixes.ex + craft).forEach((quad) => {
            quads.push(quad);
            console.log("quads", quads);
        });

        // Utiliser setImmediate pour rendre cela asynchrone
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


// --------------------------------------------------------------- Routes

app.get("/", (req, res) => {
    res.send('Bienvenue')
})

app.get("/objects/crafts/:material", async (req, res) => {
    // les crafts qui nécessitent le matériau
    try {
        let quads = await getCraft(req.params.material);
        quads = extractMaterialFromQuad(quads);
        console.log("Quads:", quads);
        quads = fromTableTOJsonItem(quads);
        res.send(quads);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        res.status(500).send("Une erreur s'est produite");
    }
});

// les matériaux nécessaires pour un craft
app.get("/objects/materials/:material", async (req, res) => {
    try {
        let quads = await getRequireMaterialsForACraft(req.params.material);
        quads = extractMaterialFromQuad(quads, "right");
        quads = fromTableTOJsonItem(quads);
        console.log("Quads:", quads);
        res.send(quads);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        res.status(500).send("Une erreur s'est produite");
    }
});

app.listen(PORT, () => {
    getTurtleFile();
    getJsonMinecraft();
    console.log("Serveur démarré sur le port PORT")
})