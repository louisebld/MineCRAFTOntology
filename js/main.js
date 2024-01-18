
const { createApp, ref, reactive, computed, onMounted } = Vue

createApp({
  setup() {
    console.log("hello world")
    const naturalMaterials = reactive([])
    const json = [
      {
        "name": "Acacia Boat",
        "id": "acacia_boat",
        "description": "A boat is both an item and a vehicle entity.",
        "image": "https://minecraft-api.vercel.app/images/items/acacia_boat.png",
        "stackSize": 1,
        "recipes": [
          {"name":"Plank","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Diamond","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Icon","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Stick","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true}
        ],
        "craft": [
          {"name":"Pig","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Horse","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Couc","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Couch","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true}
        ]
      },
      {
        "name": "Acacia Button",
        "id": "acacia_button",
        "description": "A button is a non-solid block that can provide temporary redstone power.",
        "image": "https://minecraft-api.vercel.app/images/items/acacia_button.png",
        "stackSize": 64,
        "recipes": [
          {"name":"Plank","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Diamond","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Icon","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Stick","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true}
        ],
        "craft": [
          {"name":"Pig","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Horse","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Couc","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Couch","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true}
        ]
      },
      {
        "name": "Acacia Door",
        "id": "acacia_door",
        "description": "A door is a block that can be used as a barrier that can be opened by hand or with redstone.",
        "image": "https://minecraft-api.vercel.app/images/items/acacia_door.png",
        "stackSize": 64,
        "recipes": [
          {"name":"Plank","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Diamond","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Icon","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Stick","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true}
        ],
        "craft": [
          {"name":"Pig","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Horse","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Couc","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true},
          {"name":"Couch","id":"stick","description":"A stick is an item used for crafting many tools and items.","image":"https://minecraft-api.vercel.app/images/items/stick.png","stackSize":64,"renewable":true}
        ]
      },
    ]
    
    const hello = "helloWorld"

    item = json[0]
    //-------------------------------------------Mounted
    onMounted(() => {
      const hello = "helloWorld"
      axios.get("/api/naturalMaterials").then((response) => {
        Object.assign(naturalMaterials, response.data)
        console.log(naturalMaterials)
      })
    })
    //-------------------------------------------> UI
    return {
      hello,
      item,
      naturalMaterials
    }
  }
}).mount('#app')
