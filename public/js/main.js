const deleteBtn = document.querySelectorAll('.fa-trash') // grab all of the delete buttons from the DOM
const item = document.querySelectorAll('.item span') // grab all of the todo items from the DOM list
const itemCompleted = document.querySelectorAll('.item span.completed') // grab all of the completed todo items from the DOM list

Array.from(deleteBtn).forEach((element)=>{ // add event listener to every delete button in the DOM
    element.addEventListener('click', deleteItem) // on click, call deleteItem(). 
})

Array.from(item).forEach((element)=>{ // add mark complete event listener to every 'item' class span element.  
    element.addEventListener('click', markComplete) // on click, call markComplete(). 
})

Array.from(itemCompleted).forEach((element)=>{ // add mark uncomplete event listener to every 'itemCompleted' class span element. 
    element.addEventListener('click', markUnComplete) // on click, call markUnComplete().
})

async function deleteItem(){ // function to delete an item
    const itemText = this.parentNode.childNodes[1].innerText // grab descriptor text of todoitem
    try{ // use try because fetch might fail
        const response = await fetch('deleteItem', { // send request to delete item
            method: 'delete', // use the delete method
            headers: {'Content-Type': 'application/json'}, // tell server we are sending JSON
            body: JSON.stringify({   // \
              'itemFromJS': itemText //  } convert the item text to a JSON object
            })                       // /
          }) // closing brackets for the delete request
        const data = await response.json() // parse the servers response as json
        console.log(data) // log the parsed data to the console
        location.reload() // reload the page

    } catch(err){ //catch any errors...
        console.log(err) // and log them to the console
    }
}

async function markComplete(){ // async function...
    const itemText = this.parentNode.childNodes[1].innerText // grab descriptor text of todoitem
    try{ // use try because fetch might fail
        const response = await fetch('markComplete', { // send request to put item
            method: 'put', // use the put method
            headers: {'Content-Type': 'application/json'}, // tell server we are sending JSON
            body: JSON.stringify({   // \
              'itemFromJS': itemText //  } convert the item text to a JSON object
            })                       // /
          }) // closing brackets for the fetch request
        const data = await response.json() // parse the servers response as json
        console.log(data) // log the parsed data to the console
        location.reload() // reload the page

    }catch(err){ //catch any errors...
        console.log(err) // and log them to the console
    }
}

async function markUnComplete(){ // async function...
    const itemText = this.parentNode.childNodes[1].innerText // grab descriptor text of todoitem
    try{ // use try because fetch might fail
        const response = await fetch('markUnComplete', { // send request to put item
            method: 'put', // use the put method
            headers: {'Content-Type': 'application/json'}, // tell server we are sending JSON
            body: JSON.stringify({   // \
              'itemFromJS': itemText //  } convert the item text to a JSON object
            })                       // /
          })
        const data = await response.json() // parse the servers response as json
        console.log(data) // log the parsed data to the console
        location.reload() // reload the page

    }catch(err){ //catch any errors...
        console.log(err) // and log them to the console
    }
}