const deleteBtn = document.querySelectorAll('.fa-trash') // Creates a variable to address the trashcan fa icon. Looks on the page to find it and links the variable with the button, preparing it to respond to clicks.//
const item = document.querySelectorAll('.item span')  // Make a variable  "item", thst marks all of the "span" elements.
const itemCompleted = document.querySelectorAll('.item span.completed') // Sets up a variable that will be tied to an action that will change the staus or conditions of a //

Array.from(deleteBtn).forEach((element)=>{ // Make deleteBtn an array of elements, then iterate with "forEach" method.
    element.addEventListener('click', deleteItem) // Make an event listener for the delete button tht runs deleteItem
}) 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // Make item into an array, and iterate with forEach
})

Array.from(itemCompleted).forEach((element)=>{ // Make itemCompleeted an array, and iterate with forEach
    element.addEventListener('click', markUnComplete) // Add an event listener to every eleemnt, which runs markUncomplete when clicked.
})

async function deleteItem(){ // run the delete  method on the iteme selected in this span.
    const itemText = this.parentNode.childNodes[1].innerText
    try{ // fetch to the deleteItem path
        const response = await fetch('deleteItem', { // Use the delete method to delete this item
            method: 'delete',
            headers: {'Content-Type': 'application/json'}, // Make the header content type "json", so data is parsed correctly
            body: JSON.stringify({
              'itemFromJS': itemText
            }) // Load and parse the data as JSON, and assign it as data
          })
        const data = await response.json() // return the data as json
        console.log(data) // record the returned data in the console.
        location.reload() // reload here

    }catch(err){ 
        console.log(err)
    } // log any errors in teh consoole
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{ // fetch on the  markComplete path.
        const response = await fetch('markComplete', {
            method: 'put', // use the PUT method to update this item's status
            headers: {'Content-Type': 'application/json'},  // set content type header to applictaion/json
            body: JSON.stringify({
                'itemFromJS': itemText
            }) // send the itemfromJS object as json, and then turn it into a string.
          })
        const data = await response.json()
        console.log(data) // load and parse the data, return it as json, and log it in the console.
        location.reload() // reload here.

    }catch(err){
        console.log(err) // log any errors to the console. 
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{ // fetch on the markUnComplete path
        const response = await fetch('markUnComplete', {
            method: 'put', // use the put method to update this item's status
            headers: {'Content-Type': 'application/json'}, // set the content type header to app/json
            body: JSON.stringify({
                'itemFromJS': itemText
            }) // look at and send the item itemFromJS as json, adjusted for the markUnComplete functio.
          })
        const data = await response.json()
        console.log(data)
        location.reload() // return the item with adjusted status, log the data to the console, and reload here. 

    }catch(err){
        console.log(err)
    } // Show any errors that occur in the console.
}