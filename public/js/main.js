const deleteBtn = document.querySelectorAll('.fa-trash') //Create Variable equal to trash buttons in the EJS
const item = document.querySelectorAll('.item span')//Create Variable equal to the spans in the EJS
const itemCompleted = document.querySelectorAll('.item span.completed')//Create Variable equal to spans in the EJS that are classified as completed

Array.from(deleteBtn).forEach((element)=>{ //For all trashcan symbols...
    element.addEventListener('click', deleteItem) //Add an event listener that triggers deleteItem
})

Array.from(item).forEach((element)=>{ //For every item/span in the list
    element.addEventListener('click', markComplete) //Add an event listener that triggers markComplete
})

Array.from(itemCompleted).forEach((element)=>{//For every item/span in the list that's marked complete
    element.addEventListener('click', markUnComplete) //Add an event listener that triggers markUnComplete
})

async function deleteItem(){ //Asynchronous function that communicates with the server.js, executed by the event listener on the trashcan icon
    const itemText = this.parentNode.childNodes[1].innerText //Set variable ItemText equal to the inner text of the clicked item
    try{ //attempt the following actions
        const response = await fetch('deleteItem', {  //Set response, but wait until the Main.js communicates to the server.js with Function deleteItem
            method: 'delete', //Tell server.js to use the function of delete
            headers: {'Content-Type': 'application/json'}, //Tell the function to send the data as a JSON type
            body: JSON.stringify({ //From the body of the EJS, turn the corresponding data into a JSON
              'itemFromJS': itemText //in our request, set the "itemFromJS" variable as itemText
            })
          })
        const data = await response.json() //Set data equal to a response.json() from the server before setting
        console.log(data) //Print what we recieved back from the server.js
        location.reload() //Reload the webpage

    }catch(err){ //If it doesn't work and you get an error
        console.log(err) //Console log the errors
    }
}

async function markComplete(){ //Asynchronous function that communicates with the server.js, executed by the event listener on spans without the complete class
    const itemText = this.parentNode.childNodes[1].innerText //Set variable ItemText equal to the inner text of the clicked item
    try{ //attempt the following actions
        const response = await fetch('markComplete', { //Set response, but wait until the Main.js communicates to the server.js with Function markComplete
            method: 'put', //Use the updating method
            headers: {'Content-Type': 'application/json'}, //Tell the function to send the data as a JSON type
            body: JSON.stringify({  //From the body of the EJS, turn the corresponding data into a JSON
                'itemFromJS': itemText //in our request, set the "itemFromJS" variable as itemText
            })
          })
          const data = await response.json() //Set data equal to a response.json() from the server before setting
          console.log(data) //Print what we recieved back from the server.js
          location.reload() //Reload the webpage

    }catch(err){ //If it doesn't work and you get an error
        console.log(err)//Console log the errors
    }
}

async function markUnComplete(){ //Asynchronous function that communicates to the server.js called MarkUnComplete executed by the spans with the complete class
    const itemText = this.parentNode.childNodes[1].innerText //Set variable ItemText equal to the inner text of the clicked item
    try{ //attempt the following actions
        const response = await fetch('markUnComplete', { //Set response, but wait until the Main.js communicates to the server.js with Function markUnComplete
            method: 'put', //Use the updating method
            headers: {'Content-Type': 'application/json'}, //Tell the function to send the data as a JSON type
            body: JSON.stringify({ //From the body of the EJS, turn the corresponding data into a JSON
                'itemFromJS': itemText //in our request, set the "itemFromJS" variable as itemText
            })
          })
          const data = await response.json() //Set data equal to a response.json() from the server before setting
          console.log(data) //Print what we recieved back from the server.js
          location.reload() //Reload the webpage

    }catch(err){//If it doesn't work and you get an error
        console.log(err)//Console log the errors
    }
}
