const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and asgning it to a selction of all elements with a class of the trash can  
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //Creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent of "item"

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to thr current item that waits for a click and then calls a function called deleteItem
}) //close or loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and then calls a function called markComplete
}) //close or loop

Array.from(itemCompleted).forEach((element)=>{ //create an array from our selection and start loop
    element.addEventListener('click', markUnComplete) //adds a event listener to Only completed items
})

async function deleteItem(){ //declares an asycronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the kist item to extract the text value ONLY of the specified list item
    try{ //Stating a try block do something
        const response = await fetch('deleteItem', { //creates a respose variable that waits on a fetch deleteItem route
            method: 'delete', //Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into catch block
        console.log(err) // log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declares an asyncronous fuction
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //Starting a try block to do something
        const response = await fetch('markComplete', { //creates a repsonse variable thhat waits on a fetch to get data from the result of the markComplete route
            method: 'put', //Setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content 
                'itemFromJS': itemText //Setting the content of the boby to the inner text of the list item, and naming it "itemFromJS"
            }) //closing the body
          }) //closing the object
        const data = await response.json()//waiting on JSON from the reponse to be converted
        console.log(data)//log the result to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into catch block
        console.log(err) //log error the error to the console
    }// close the catch block
}//end the function

async function markUnComplete(){//declare an asyncrunous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{//Starting a try block to do something
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to get data from the result of the markUncomplete route
            method: 'put',//setting the CRUD to "update" route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expecting
            body: JSON.stringify({ //Declared the message content being passed,and stringify that content
                'itemFromJS': itemText //Setting the content of the boby to the inner text of the list item, and naming it "itemFromJS"
            })//Closing the body
          })//closing the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed


    }catch(err){ //if an error occurs, pass the error into catch block
        console.log(err) //log error the error to the console
    } // close the catch block
}//end the function