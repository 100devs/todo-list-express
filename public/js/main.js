const deleteBtn = document.querySelectorAll('.fa-trash') // a variable that refers to the delete buttons (with the font-awesome trash can)
const item = document.querySelectorAll('.item span') // a variable that refers to all the spans in the DOM that have the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // all the spans that are also completed

Array.from(deleteBtn).forEach((element)=>{ // take the collection of delete button HTML elements, make it an array, and then for each one...
    element.addEventListener('click', deleteItem) // make the delete button do the deleting when clicked on
})

Array.from(item).forEach((element)=>{ // make an array from the items in the collection, and for each...
    element.addEventListener('click', markComplete) // let the user mark them complete by clicking on them
})

Array.from(itemCompleted).forEach((element)=>{ // make an array from the ones already marked complete,
    element.addEventListener('click', markUnComplete) // and let the user click to mark them uncomplete
})

async function deleteItem(){ // an asynchronous function to delete an item
    const itemText = this.parentNode.childNodes[1].innerText // the name of the item
    try{ // setting up a try block
        const response = await fetch('deleteItem', { // take the response from a fetch that works as follows:
            method: 'delete', // it is a DELETE type Pokemon
            headers: {'Content-Type': 'application/json'}, // the request will be formatted as JSON
            body: JSON.stringify({ // here's JSONny
              'itemFromJS': itemText // tell the server the name of the item to delete
            })
          })
        const data = await response.json() // here's the JSON of the received response
        console.log(data) // console.log that JSON
        location.reload() // reload the page so the user can see the updated list

    }catch(err){ // if something went fucky
        console.log(err) // tell me what went fucky
    }
}

async function markComplete(){ // an asynchronous function to mark an item as complete
    const itemText = this.parentNode.childNodes[1].innerText // the name of the item
    try{ //set up the tryhard block
        const response = await fetch('markComplete', { // take the response from the fetch aaand....
            method: 'put', //it's a put type Pokemon
            headers: {'Content-Type': 'application/json'}, // format it as JSON
            body: JSON.stringify({ // take the object and make it JSON
                'itemFromJS': itemText //tell the server which item you're marking complete
            })
          })
        const data = await response.json() // the JSON of the received response
        console.log(data) //console log the JSON
        location.reload() //reload the page

    }catch(err){ //catch me an error
        console.log(err) //tell me about it
    }
}

async function markUnComplete(){ // make an asynch function that marks shit not done
    const itemText = this.parentNode.childNodes[1].innerText //name it, name your unfinished task
    try{ //give it a tryyyyyyy
        const response = await fetch('markUnComplete', { //take the response from the fetch aaaaand...
            method: 'put', //you put it....
            headers: {'Content-Type': 'application/json'}, //in the JSON format...
            body: JSON.stringify({ //make it JSON *captain picard voice*
                'itemFromJS': itemText // tell the server which one ain't done
            })
          })
        const data = await response.json() //the JSON of the received response
        console.log(data) //console log that
        location.reload() //reload the page

    }catch(err){ //lmk
        console.log(err) //you good?
    }
}
