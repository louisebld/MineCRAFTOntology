const N3 = require('n3');
const fs = require('fs');
const express = require("express")
const app = express()
const PORT = 8080

const prefixes = {
    ex: 'http://example.org/'
};

const turtleFile = fs.readFileSync('./minecraft.ttl', 'utf8');

const store = new N3.Store();

const parser = new N3.Parser();

parser.parse(turtleFile,
    (error, quad, prefixes) => {
        if (error) {
            console.error(error);
        } else if (quad) {
            if (quad)
                quad.id = "test"
            store.addQuad(quad);
        }
        else {
            console.log("Parsing terminé")
        }
    }
)

app.get("/", (req, res) => {
    res.send('Bienvenue')
})
// store.match(null, prefixes.ex + 'requires', prefixes.ex + 'plank').forEach((quad) => {
//     console.log('Found :', quad);
// });
app.get("/objects", (req, res) => {
    quads = []
    store.forEach((quad) => {
        quads.push(quad)
    });
    res.send(quads)
})

app.get("/objects/:material", async (req, res) => {
    try {
        const quads = await getQuads(req.params.material);
        console.log("Quads:", quads);
        res.send(quads);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        res.status(500).send("Une erreur s'est produite");
    }
});

function getQuads(material) {
    return new Promise((resolve, reject) => {
        let quads = [];
        store.match(null, prefixes.ex + 'requires', prefixes.ex + material).forEach((quad) => {
            quads.push(quad);
            console.log("quads", quads);
        });

        // Utiliser setImmediate pour rendre cela asynchrone
        setImmediate(() => {
            console.log("testtesttest");
            resolve(quads);
        });
    });
}



// // récupérer un objet fait d'un certain matériau
// app.get("/objects/:material", (req, res) => {
//     // res.send(store.match(null, prefixes.ex + 'requires', prefixes.ex + req.params.material))
//     let quads = []
//     store.match(null, prefixes.ex + 'requires', prefixes.ex + 'plank').forEach((quad) => {
//         quads.push(quad);
//         console.log("quads", quads)
//     });
//     console.log("testtesttest")

//     // store.match(null, prefixes.ex + 'requires', prefixes.ex + req.params.material).forEach((quad) => {
//     //     quads.push(quad);
//     // });
//     // console.log(quads)
//     res.send(quads)
// })


app.listen(PORT, () => {
    console.log("Serveur démarré sur le port PORT")
})