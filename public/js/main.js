const deleteBtn = document.querySelectorAll('.fa-trash') //declare a varible deleteBtn and assign all the elements with the class .fa-trash
const item = document.querySelectorAll('.item span') //declare a variable item and assigning it to a selection of span tags inside of a parent with a class of item.
const itemCompleted = document.querySelectorAll('.item span.completed') //declare a variable call itemCompleted and assigning it all elements of the class item AND span with the class completed. 

Array.from(deleteBtn).forEach((element)=>{ //Taking the delete buttons and creating an array. Apply the code block to each item of the array. Baseically a loop. Array.from is an array menthod to create a new array from an array-like or any iterable object. invoking the Array.from method on the variable deleteBtn. chaining methods and invoking an arrow function by using the forEach method to execute a block of code on every element of the array that Array.from creates. 
    element.addEventListener('click', deleteItem) //on each iteration, this function will add an eventlistener to each element. on each "click", this function will execute a call back, invoking deleteItem.
}) //closing the loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //add an event listener to each element. on click, run this function and execute a call back, invoking markComplete
}) //closing the loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //add an event listener to each element. on click, run this function and execute a call back, invoking markUnComplete. adds an event listener to ONLY completed items.
}) //closing the loop

async function deleteItem(){ //invoking an async function called deleteItem. calling an async function will help with the flow of execution.
    const itemText = this.parentNode.childNodes[1].innerText //declare a const variable call itemText and assign the value of innerText, which is the value of looking into the 2nd child of the list item.
    //basically grabs the innerText within the list span. 
    try{ //declaring a try block, it run something. 
        const response = await fetch('deleteItem', { //declare a response variable that waits on a fetch to get data from the result of the deleteItem. starting an object.
            method: 'delete', //declaring the method as delete. setting the CRUD method for the route.
            headers: {'Content-Type': 'application/json'}, //declaring the return content type is a json object?
            body: JSON.stringify({ //declare the message content being pass, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS.
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console.
        location.reload() //reloads the page to update what is displayed.

    }catch(err){ //catch block will handle the error. passing in the error message.
        console.log(err) //log the error
    }//close the catch block
} //close the function

async function markComplete(){ //invoke an async function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //declare a const variable call itemText and assign the value of innerText, which is the value of looking into the 2nd child of the list item.
    try{ //declaring a try block
        const response = await fetch('markComplete', { //declaring a response and await a fetch to get data from the result of markComplete. starting an object.
            method: 'put', //setting the CRUD method to update for the route.
            headers: {'Content-Type': 'application/json'}, //jSON again
            body: JSON.stringify({ //declare the message content being pass, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS.
            }) //closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console.
        location.reload() //reloads the page to update what is displayed.

    }catch(err){//catch block will handle the error. passing in the error message.
        console.log(err)//log the error
    }
}

async function markUnComplete(){//declaring an asynch function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something.
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route.
            method: 'put', //setting the CRUD method to update for the route.
            headers: {'Content-Type': 'application/json'}, //jSON again
            body: JSON.stringify({ //declare the message content being pass, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS.
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on JSON from the response to be converted
        console.log(data)//log the result to the console.
        location.reload()//reloads the page to update what is displayed.

    }catch(err){//catch block will handle the error. passing in the error message.
        console.log(err)//log the error
    }
}