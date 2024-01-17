const N3 = require('n3');
const fs = require('fs');

const turtleFile = fs.readFileSync('./minecraft.ttl', 'utf8');

const store = new N3.Store();

const prefixes = {
    ex: 'http://.org/'
};

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

function printStore(store) {
    // Affiche tout le store
    store.forEach((quad) => {
        console.log(quad);
    });
}

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

printStore(store);
