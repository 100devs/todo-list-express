
//These are the trash cans
const deleteBtn = document.querySelectorAll('.fa-trash')//creating variable and assigning it to a selection of all elements with a class of the trash can
//our client side event listeners are the only thing that can hear
//us clicking on the items
const item = document.querySelectorAll('.item span') //Creating a variable and assigning it to a selection of span tags inside of a parent that has a class of 'item'
//This listens for a click on a span with the class completed 
//that is a child of an element with the class item
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans with a class of 'completed' inside of a parent with a class of 'item'

//this listens for a click on the trash cans and then runs deleteItem 
Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener to the current item that waits for a click and then calls a function called deleteitem
})//clase our loop

//when an item  element is clicked the function markUnComplete runs
Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click and then calls a function called markComplete
}) //close our loop

//when an itemCompleted element is clicked the function markUnComplete runs
Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listner to only completed items
}) //close our loop

async function deleteItem(){ // declare an asynchronous function
    //this refers to the trash can 
    // the parent node as the li
    //The childNodes[1] is the span  
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        //a fetch is sent to the server, the fetch has the route deleteItem
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deletItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            //the fetch sends the innertext of the span to the server
            //that is the itemText 
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemForJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        //when our client side reseives the response from the server side
        //it reloads the page
        location.reload() //roloads the page to update what is displayed

    }catch(err){//if an error occors, pass the error into the catch blocj
        console.log(err) //log the error to the console
    }//close the catch block
}//end the function

async function markComplete(){ //declare an asynchronous function
    //this selects the text from the span that was clicked
    //Child node one is actually the text in the span itself
    //0 is like bullet points and things that take up space
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{//starting a try block to do something
        //once the code hears the click we want to fetch 
        //with the fetch we can describe what type of method we want
        //it to be
        // markComplete is our route
        const response = await fetch('markComplete', {//creates a response variable that waits on a fetch to get data from the result of the MarkComplete route
            //the fetch is a put method
            method: 'put', //setting the CRUD variable to 'update' for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                //the item that was clicked will be refered to as itemFromJS 
                //in the server request 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          })//clasing the object
        const data = await response.json()//waiting on JSON from the response to be converted
        console.log(data) // log the result to the console
        //once marked complete is sent from the server the page is reloaded
        //triggering another get request which sees the changed 
        //document in the database and so changes it in the DOM
        location.reload()//relaods the page to update what is displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    }// close the catch block
}//end the function

async function markUnComplete(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span.
    try{//starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//clasing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data)// log the result to the console
        location.reload()//relaods the page to update what is displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }// close the catch block
}//end the function