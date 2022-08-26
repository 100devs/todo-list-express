const deleteBtn = document.querySelectorAll('.fa-trash') //creates a constant variable event listener for delete button using the font awesome trashcan icon
const item = document.querySelectorAll('.item span') //creates a constant variable for each span element with the class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a constant variable for each span element with both classes of item and completed

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) //creates an array using a forEach loop iterating over each item and listens for a click on the deleteBtn, when the click is heard that item will execute the callback function deleteItem

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) //creates an array using a forEach loop iterating over each item and listens for a click, when the click is heard that item will execute the callback function markComplete

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) //creates an array using a forEach loop iterating over each item in the collection listening for a click event, upon click will execute the callback function markUnComplete

async function deleteItem(){ //declares asynchrous funtion called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //declares constant variable representing the innerText property value of the specified list item
    try{ //opening tag for a try block
        const response = await fetch('deleteItem', { //declaration of constant variable that waits on a fetch to return data from the API
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifies the content type will be JSON
            body: JSON.stringify({ 
              'itemFromJS': itemText
            }) //takes the content from the body and stringifies it, setting the content as the inner text of the list item and naming it 'itemFromJS'
          })
        const data = await response.json() //declaration of constant variable that will wait for the JSON response
        console.log(data) //logs the response to the console
        location.reload() //refreshes the page

    }catch(err){ //catch block responds if the try block encounters an error, reports the error
        console.log(err) //if error is received, log to console 
    }
}

async function markComplete(){ //declares an asynch function
    const itemText = this.parentNode.childNodes[1].innerText //constant variable that holds the value of the innerText property within the specified list item
    try{ //opening of a try block
        const response = await fetch('markComplete', { //declares a variable to hold the response data that results from the fetch using the markComplete route
            method: 'put', //specifies CRUD method - Update
            headers: {'Content-Type': 'application/json'}, //specifies content type as JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            }) //sets content of the body to the value of the innerText property in the list item, naming it itemFromJS
          })
        const data = await response.json() //declares variable to hold value of the response received in JSON format
        console.log(data) //logs the response to console
        location.reload() //reloads the page to show updated info

    }catch(err){ //catch block for if the try block encounters an error
        console.log(err) //logs the error (if applicable) to the console
    }
}

async function markUnComplete(){ //declares asynch function
    const itemText = this.parentNode.childNodes[1].innerText //constant variable that holds the value of the innerText property within the specified list item
    try{ //opens a try block
        const response = await fetch('markUnComplete', { ////declares a variable to hold the response data that results from the fetch using the markUncomplete route
            method: 'put', //specifies CRUD method - Update
            headers: { 'Content-Type': 'application/json' }, //specifies content type as JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })//sets content of the body to the value of the innerText property in the list item, naming it itemFromJS
          })
        const data = await response.json() //declares variable to hold value of the response received in JSON format
        console.log(data) //logs the response to console
        location.reload()//reloads the page to show updated info

    } catch (err) { //catch block for if the try block encounters an error
        console.log(err) //logs the error (if applicable) to the console
    }
}