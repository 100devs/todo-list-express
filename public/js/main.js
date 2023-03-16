const deleteBtn = document.querySelectorAll('.fa-trash') //creates a constant variable and assigning it to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') //creates a constant variable and assigfning it to a selection of span tags inside of a parent with the class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creates a constant variable and assigning it to a selection of span tags with the 'completed' tags inside the of a parent with the class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection(deleteBin) and starting a loop
    element.addEventListener('click', deleteItem) //add an eventlistener to the current item that waits for a click and then call a function called deleteItem
}) // close our loop

Array.from(item).forEach((element)=>{ //creating an array from our selection(item) and starting a loop
    element.addEventListener('click', markComplete) //add an eventlistener to the current item that waits for a click and then call a function called markComplete
}) //close our loop

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection(itemCompelted) and starting a loop
    element.addEventListener('click', markUnComplete)//add an eventlistener to ONLY completed items
})//close our loop

async function deleteItem(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //declares a constant variable that looks inside the list item and grabs only the inner text within the list span
    try{ //decalres a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from thre result of deleteItem route
            method: 'delete', //set the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifiying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it 'itemFromJS' 
            })//close the body 
          })//closing the object (fetch)
        const data = await response.json() // waiting on JSOn from the response to be converted
        console.log(data) //log the data to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // closes try block, if an error occurs, pass the error into the catch block
        console.log(err) //console.log the error
    } // closes the catch block
} // end the function

async function markComplete(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //declares a constant variable that looks inside the list item and grabs only the inner text within the list span
    try{ //decalres a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', //set the CRUD method "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifiying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it 'itemFromJS' 
            }) //close the body 
          }) //closing the object (fetch)
        const data = await response.json() // waiting on JSOn from the response to be converted
        console.log(data) //log the data tp the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // closes try block, if an error occurs, pass the error into the catch block
        console.log(err) //console.log the error
    }// closes the catch block
}// end the function

async function markUnComplete(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //declares a constant variable that looks inside the list item and grabs only the inner text within the list span
    try{ //decalres a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', //set the CRUD method "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifiying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it 'itemFromJS' 
            }) //close the body 
          }) //closing the object (fetch)
        const data = await response.json() // waiting on JSOn from the response to be converted
        console.log(data) //log the data tp the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // closes try block, if an error occurs, pass the error into the catch block
        console.log(err) //console.log the error
    }// closes the catch block
}// end the function