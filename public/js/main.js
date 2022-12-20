const deleteBtn = document.querySelectorAll('.fa-trash') //select all the delete buttons
const item = document.querySelectorAll('.item span') //select all the items
const itemCompleted = document.querySelectorAll('.item span.completed') //select all the completed items

Array.from(deleteBtn).forEach((element)=>{ //loop through all the delete buttons
    element.addEventListener('click', deleteItem) //add event listener to each button
}) //end loop

Array.from(item).forEach((element)=>{ //loop through all the items
    element.addEventListener('click', markComplete) //add event listener to each item
}) //end loop

Array.from(itemCompleted).forEach((element)=>{ //loop through all the completed items
    element.addEventListener('click', markUnComplete) //add event listener to each item
}) //end loop

async function deleteItem(){ //delete item function
    const itemText = this.parentNode.childNodes[1].innerText //get the text of the item to be deleted
    try{ //try to delete the item
        const response = await fetch('deleteItem', { //fetch deleteItem route
            method: 'delete', //set method to delete
            headers: {'Content-Type': 'application/json'}, //set headers
             body: JSON.stringify({ //set body
              'itemFromJS': itemText //set item to be deleted
            }) //end body
          })
        const data = await response.json() //get response
        console.log(data) //log response
        location.reload() //reload the page

    }catch(err){ //if error
        console.log(err) //log error
    } //end try catch
} //end deleteItem function

async function markComplete(){ //mark item complete function
    const itemText = this.parentNode.childNodes[1].innerText //get the text of the item to be marked complete
    try{ //try to mark item complete
        const response = await fetch('markComplete', { //fetch markComplete route
            method: 'put', //set method to put
            headers: {'Content-Type': 'application/json'}, //set headers
            body: JSON.stringify({ //set body
                'itemFromJS': itemText //set item to be marked complete
            }) //end body
          }) //end fetch
        const data = await response.json() //get response
        console.log(data) //log response
        location.reload() //reload the page

    }catch(err){ //if error
        console.log(err) //log error
    } //end try catch
} //end markComplete function

async function markUnComplete(){ //mark item uncomplete function
    const itemText = this.parentNode.childNodes[1].innerText //get the text of the item to be marked uncomplete
    try{ //try to mark item uncomplete
        const response = await fetch('markUnComplete', { //fetch markUnComplete route
            method: 'put', //set method to put
            headers: {'Content-Type': 'application/json'}, //set headers
            body: JSON.stringify({ //set body
                'itemFromJS': itemText //set item to be marked uncomplete
            }) //end body
          }) //end fetch
        const data = await response.json() //get response
        console.log(data) //log response
        location.reload() //reload the page

    }catch(err){ //if error
        console.log(err) //log error
    } //end try catch
} //end markUnComplete function