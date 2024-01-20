# MineCRAFT Ontology
    Réalisé par Louise Bollard et Tom Thierry - M2 INFO 2024

## Modélisation 🐢
Nous avons choisi de modéliser notre réseau en Turtle car nous en avions pas manipuler énormement en cours. De plus, nous avons trouvé que c'était un format assez simple à comprendre et à manipuler, plus simple que du RDF par exemple.

![Alt text](./turtle/graph.png?raw=true "Title")

Les différentes relations que nous avons introduites :
- `canCraft` : Un objet peut être crafté à partir d'un autre objet
- `isMaterial` : Un objet peut être un matériau naturel
- `isObject` : Un objet peut être un objet
- `isSubclassOf` : Un objet peut être une sous-classe d'un concept plus général

Nous n'avons pas utilisé toutes les relations que nous avons définies, par manque de temps de réalisation.

## Requêtes ⚙️

Pour manipuler notre fichier Turtle 🐢, nous avons utilisé la librairie N3.js.

    `https://github.com/rdfjs/N3.js`

La bibliothèque nous permet de créer des "quads" à partir de notre fichier Turtle, et de les manipuler.

## Routes 🛣️

- `GET /api/items/crafts/:material` : Retourne les objets qui peuvent être craftés à partir d'un matériau
- `GET /api/items/materials/:material` : Retourne les items nécessaires pour crafter un objet
- `GET /api/items/:item` : Retourne les informations d'un objet
- `GET /api/naturalMaterials` : Retourne les matériaux naturels


Voici un exemple de retour de la route `/api/items/oak_planks` :
```json
{
    "name": "Oak Planks",
    "namespacedId": "oak_planks",
    "description": "Planks are common blocks used as building blocks and in crafting recipes. They are one of the first things that a player can craft in Survival and Adventure modes. Two categories of planks can be differentiated: flammable Overworld planks made from tree logs, and nonflammable Nether planks made from huge fungus stems.",
    "image": "https://minecraft-api.vercel.app/images/items/oak_planks.png",
    "stackSize": 64,
    "renewable": true,
    "crafts": [
    {
        "name": "Wooden Sword",
        "namespacedId": "wooden_sword",
        "description": "A sword is a melee weapon that is mainly used to damage entities and for cutting cobwebs or bamboo. A sword is made from one of six materials, in order of increasing quality and expense: wood, gold, stone, iron, diamond and netherite.",
        "image": "https://minecraft-api.vercel.app/images/items/wooden_sword.png",
        "stackSize": 1,
        "renewable": true,
        "crafts": [],
        "materials": []
    },
    {
        "name": "Stick",
        "namespacedId": "stick",
        "description": "A stick is an item used for crafting many tools and items.",
        "image": "https://minecraft-api.vercel.app/images/items/stick.png",
        "stackSize": 64,
        "renewable": true,
        "crafts": [],
        "materials": []
    },
],
"materials": [
    {
        "name": "Oak Wood",
        "namespacedId": "oak_wood",
        "description": "Wood or hyphae is a block that has the log's \"bark\" texture on all six sides. It comes in 8 types: oak, spruce, birch, jungle, acacia, dark oak, crimson, and warped.",
        "image": "https://minecraft-api.vercel.app/images/items/oak_wood.png",
        "stackSize": 64,
        "renewable": true,
        "materials": [],
        "crafts": []
    }
    ]
}
```



## Lancement du projet 🚀

Pour lancer le projet, il faut tout d'abord installer les dépendances :

    `npm install`

Puis lancer le serveur :
    
        `nodemon`

Nous avons utilisé la même structure de projet que pour l'ontologie sur les jeux vidéos. 
Après réflexion, nous aurions dû partir sur un framework complet (VueJS/Angular/React) pour la partie front car nous avons plusieurs pages. La partie logique pour chacune des pages est dans le fichier main.js mais n'est pas très propre, car commune à nos fichiers html.

Au lancement du projet, vous pouvez accéder à l'interface à l'adresse suivante :

    `http://localhost:8080/`

Au lancement du serveur, nous récupérons les données du fichier turtle et les sauvegardons dans une variable globale et nous importons le json pour avoir les informations sur les différents items.

    https://minecraft-api.vercel.app/api/items

## Fonctionnalités 🎮

- Affichage de la liste des items (matériaux naturels)
- Affichage des informations d'un item
- Affichage des crafts d'un item
- Affichage des matériaux nécessaires pour crafter un item
- Recherche d'un item par son id exact (oak_planks)
(Nous n'avons pas eu le temps de finaliser pour la recherche par nom, nous voulions mettre en place une regex)