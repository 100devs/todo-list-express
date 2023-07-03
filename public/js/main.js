const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with class of the trash can
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assinging it to a selection of spans with the class of "completed" inside the parent that has class of "item"

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to current item that waits for a click and then calls function "deleteItem"
})//close our loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //add an event listener on current item that waits for a click then calls function "markComplete"
})//close or loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and staring a loop
    element.addEventListener('click', markUnComplete) //add an event listener to ONLY completed items 
})//close our loop

async function deleteItem(){ //declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data the result of the "deleteItem" route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expeted, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJs'
            })//closing the body
          })//closing our object
        const data = await response.json() //waiting on JSON form the response to be converted
        console.log(data) //log result to the console
        location.reload() //reloads the page to update what is being displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declaring and asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the "markComplete" route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //delcare the message content being passes, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner tet of the list item, and naming it "itemFromJs"
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch blcok
} //end the function

async function markUnComplete(){ //decaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span
    try{//starting a try block to do something
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to get data from the result of the "markUnComplete" route
            method: 'put',//setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({//delcare the message content being passes, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner tet of the list item, and naming it "itemFromJs"
            })//closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data)//log the result to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function