
//declaring button 
const deleteBtn = document.querySelectorAll('.fa-trash') //creates a variable that selects all the font awesome trash can icons 
const item = document.querySelectorAll('.item span') //selecting span tag
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a calss of "completed" insdei of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)
}) //anytime a user clicks on an item with .fa-trash then it runs the deleteItem function

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //adding an event listener to current items that waits for a click and calls a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selecting and starting a loop
    element.addEventListener('click', markUnComplete) ////adds event listener to ONLY completed items
}) //close our loop

async function deleteItem(){ //declaring asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //selects the innerText of the current item and assignts it to itemText variable
    try{ //declaring a try block
        const response = await fetch('deleteItem', { //creating a variable that waits on fetch statement that draws from the function down at the bottom, retrieving data from the result of a delete item
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify the content 
              'itemFromJS': itemText //setting the contetn fo the body to the inner text of the list item, and naming it itemFromJS
            }) //closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted 
        console.log(data) //console log
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ //catch block to handle any errors in the event an error is thrown 
        console.log(err) //log error to console
    }
}

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something 
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route 
            method: 'put', //sets the CRUD method for the route 
            headers: {'Content-Type': 'application/json'}, //specifying
            body: JSON.stringify({ //declare the message content being passed and stringify the content 
                'itemFromJS': itemText
            })//closing body 
          })//closing the object 
        const data = await response.json() //waiting on JSON fom the response to be converted. 
        console.log(data) //logs data to console 
        location.reload() //reloads the page to update what is displayed

    }catch(err){
      //catch block to handle any errors in the event an error is thrown
      console.log(err);//logs error to console
    }
}

async function markUnComplete(){ //declares asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //
    try{
      const response = await fetch("markUnComplete", {
        method: "put", //sets the CRUD method for the route
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ //declare the message content being passed and stringify the content 
          itemFromJS: itemText,
        }),
      });
      const data = await response.json(); //waiting on JSON from the response to be converted 
      console.log(data); //logs data to console
      location.reload(); //reloads the page to udpate what is displayed
    }catch(err){
        console.log(err) //logs error to console
    }
}