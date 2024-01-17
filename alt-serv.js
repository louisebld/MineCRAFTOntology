const N3 = require('n3');
const fs = require('fs');

// Définir les préfixes
const prefixes = {
    ex: 'http://tocardVille.org/'
};

// Initialiser le parseur N3
const parser = new N3.Parser({ format: 'application/turtle', prefixes });

// Les triples seront stockés dans ce tableau
const triples = [];

// Charger le fichier turtle
const turtleData = fs.readFileSync('./minecraft.ttl', 'utf8');

// Parseur N3
parser.parse(turtleData, (error, triple, prefixes) => {
    if (triple) {
        // Ajouter chaque triple au tableau
        triples.push(triple);
    } else {
        // La fin du parsing
        console.log('Triples:', triples);
        // Exemple d'utilisation pour l'épée en bois
        const woodenSwordRequirements = getRequirementsForItem(triples, 'http://example.org/woodenSword');
        console.log('Wooden Sword Requirements:', woodenSwordRequirements);
    }
});


// match n3 is used to match a triple pattern
// exemple : match n3 { ?s ?p ?o }s

// console.log('prefixes:', prefixes)
// console.log('triples:', triples)

function getRequirementsForItem(triples, itemURI) {
    const requirements = [];

    triples.forEach((quad) => {
        if (
            quad._subject.id === itemURI &&
            quad._predicate.id === 'http://example.org/requires'
        ) {
            requirements.push(quad);
        }
    });

    return requirements;
}

function printStore(store) {
    // Affiche tout le store
    store.forEach((quad) => {
        console.log(quad);
    });
}

async function loadFile(file, parser, prefixes) {
    const store = new N3.Store();
    parser.parse(file,
        (error, quad, prefixes) => {
            if (error) {
                console.log(error)
            } else {
                store.addQuad(quad);
            }
        })
    return store;
}

// main 
async function main() {
    const store = await loadFile(turtleData, parser, prefixes);
    printStore(store);
}

main();
