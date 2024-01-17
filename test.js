const N3 = require('n3');
const fs = require('fs');
const express = require("express")
const app = express()

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
                store.addQuad(quad);
        }
        else {
            store.match(null, prefixes.ex + 'requires', prefixes.ex + 'plank').forEach((quad) => {
                console.log('Found :', quad);
            });
        }
    }
)

// function readAndParseTurtleFile(filePath) {
//     return new Promise((resolve, reject) => {
//         const turtleFile = fs.readFileSync(filePath, 'utf8');
//         const prefixes = {
//             ex: 'http://example.org/'
//         };

//         const parser = new N3.Parser();
//         parser.parse(turtleFile, (error, quad) => {
//             if (error) {
//                 reject(error);
//             } else if (quad) {
//                 store.addQuad(quad);
//             } else {
//                 resolve(store);
//             }
//         });
//     });
// }

// function executeQuery(store) {
//     objects = []
//     return new Promise((resolve, reject) => {
//         console.log("resultat : ")
//         store.match(null, prefixes.ex + 'requires', prefixes.ex + 'plank').forEach((quad) => {
//             objects.push(quad)
//         });
//     });
// }

// Utilisation des promesses
// readAndParseTurtleFile('./minecraft.ttl')
//     .then((store) => {
//         console.log('Fichier Turtle traité avec succès.');
//         // Affiche tout le store si nécessaire
//         // printStore(store);

//         return executeQuery(store);
//     })
//     .then((results) => {
//         console.log('Requête exécutée avec succès.');
//         console.log('Résultats :', results);
//     })
//     .catch((error) => {
//         console.error('Une erreur s\'est produite :', error);
//     });


app.get("/", (req, res) => {
    objects = []
    string = ""
    res.send('yoyoyo')

})

app.get("/objects", (req, res) => {
    // res.send(objects)
})

app.listen(8080, () => {
    // readAndParseTurtleFile('./minecraft.ttl')


    // print le store
    store.forEach((quad) => {
        console.log(quad);
    });
})