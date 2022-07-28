const deleteBtn = document.querySelectorAll('.fa-trash') //setting the value of the variable to items with the class of fa-trash
const item = document.querySelectorAll('.item span') //setting the value of the variable to all spans within the parent class of item 
const itemCompleted = document.querySelectorAll('.item span.completed') //setting the value of the variable to all completed spans within the parent class of item

Array.from(deleteBtn).forEach((element)=>{ //creating an array from all items in deleteBtn and beginning a forEach loop to cycle through them
    element.addEventListener('click', deleteItem) // add an event listener that performs the deleteItem function on click
}) //closing the forEach loop

Array.from(item).forEach((element)=>{ //creating an array from all items in item and beginning a forEach loop to cycle through them
    element.addEventListener('click', markComplete) // add an event listener that performs the markComplete function on click
}) //closing the forEach loop
 
Array.from(itemCompleted).forEach((element)=>{ //creating an array from all items in itemCompleted and beginning a forEach loop to cycle through them
    element.addEventListener('click', markUnComplete) // add an event listener that performs the markUnComplete function on click
}) //closing the forEach loop

async function deleteItem(){ //declaring a new aync function named deleteItem that takes no parameters
    const itemText = this.parentNode.childNodes[1].innerText //Assigning the text of the 2nd element in the array of the item the method is called on to the variable
    try{ //beginning a try/catch statement, where the code in the try portion will be attempted
        const response = await fetch('deleteItem', { //Creating a variable that uses a fetch to retrieve data from deleteItem, { is starting an object declaration
            method: 'delete', //set the method for the route (delete)
            headers: {'Content-Type': 'application/json'}, //the response will be in JSON
            body: JSON.stringify({ //stringify converts the JSON into readable content, the body contains this content
              'itemFromJS': itemText //this is the innertext of the list item in itemText, setting this to the content of the body. then assigning the name itemFromJS to this content
            })//closing the body declaration
          })//object creation is complete
        const data = await response.json() //Await for response, read it into json and assign it to a variable
        console.log(data) //Log the previously read response into the console
        location.reload() //refresh the current page to reflect updates made

    }catch(err){ //if an error occurs during the try block, it will be caught here
        console.log(err) //Diplay the error message on the console
    } //closing the catch block
}// closing the deleteItem function

async function markComplete(){ //declaring a new aync function named markComplete that takes no parameters
    const itemText = this.parentNode.childNodes[1].innerText //Assigning the text of the 2nd element in the array of the item the method is called on to the variable
    try{//beginning a try/catch statement, where the code in the try portion will be attempted
        const response = await fetch('markComplete', { //Creating a variable that uses a fetch to retrieve data from markComplete, { is starting an object declaration
            method: 'put', //set the method for the route (update)
            headers: {'Content-Type': 'application/json'}, //the response will be in JSON
            body: JSON.stringify({ //stringify converts the JSON into readable content, the body contains this content
                'itemFromJS': itemText //this is the innertext of the list item in itemText, setting this to the content of the body. then assigning the name itemFromJS to this content
            }) //closing the body declaration
          }) //object creation is complete
        const data = await response.json() //Await for response, read it into json and assign it to a variable
        console.log(data) //Log the previously read response into the console
        location.reload()  //refresh the current page to reflect updates made

    }catch(err){ //if an error occurs during the try block, it will be caught here
        console.log(err) //Diplay the error message on the console
    } //closing the catch block
} // closing the deleteItem function

async function markUnComplete(){ //declaring a new aync function named markUnComplete that takes no parameters
    const itemText = this.parentNode.childNodes[1].innerText //Assigning the text of the 2nd element in the array of the item the method is called on to the variable
    try{ //beginning a try/catch statement, where the code in the try portion will be attempted
        const response = await fetch('markUnComplete', {//Creating a variable that uses a fetch to retrieve data from markUnComplete, { is starting an object declaration
            method: 'put', //set the method for the route (update)
            headers: {'Content-Type': 'application/json'}, //the response will be in JSON
            body: JSON.stringify({ //stringify converts the JSON into readable content, the body contains this content
                'itemFromJS': itemText//this is the innertext of the list item in itemText, setting this to the content of the body. then assigning the name itemFromJS to this content
            })//closing the body declaration
          }) //object creation is complete
        const data = await response.json() //Await for response, read it into json and assign it to a variable
        console.log(data) //Log the previously read response into the console
        location.reload() //refresh the current page to reflect updates made

    }catch(err){ //if an error occurs during the try block, it will be caught here
        console.log(err)//Diplay the error message on the console
    }//closing the catch block
} // closing the deleteItem function