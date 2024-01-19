
const { createApp, ref, reactive, computed, onMounted } = Vue

createApp({
  setup() {
    console.log("hello world")
    const naturalMaterials = reactive([])
    const item = reactive({})
    // take the id from the url /item/:id
    const itemId = window.location.pathname.split("/")[2]
    /// /search?item=diamond
    const searchItem = window.location.search.split("=")[1]

    //-------------------------------------------Mounted
    onMounted(() => {
      axios.get("/api/naturalMaterials").then((response) => {
        Object.assign(naturalMaterials, response.data)
        console.log(naturalMaterials)
      })
      if (itemId) {
        axios.get("/api/items/" + itemId).then((response) => {
          Object.assign(item, response.data)
          console.log(item)
        })
      }
      if (searchItem) {
        axios.get("/api/search/" + searchItem).then((response) => {
          Object.assign(item, response.data)
          console.log(item)
        })
      }
    })
    //-------------------------------------------> UI
    return {
      item,
      naturalMaterials
    }
  }
}).mount('#app')
