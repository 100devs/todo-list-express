const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable, creating a nodelist with all elements with a class of trashcan
const item = document.querySelectorAll('.item span') // creating a variable and creating a nodelist where any spans that are within elements of a class of .item (li)
//aka any spans within a parent that has a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it a nodelist of spans with a completed class, instead of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{// since deleteBtn is a nodelist, we need to turn it into an array. foreach has us loop through each item 
    element.addEventListener('click', deleteItem) // add an event listener to the current item and when it is clicked on, run the deleteItem function
}) //close our loop

/* adding smurfs to icons */
Array.from(item).forEach((element)=>{ // since item is a nodelist, we need to turn it into an array. foreach has us loop through each item 
    element.addEventListener('click', markComplete)  // add an event listener to the current item and when it is clicked on, run the markComplete function
})  //close our loop

Array.from(itemCompleted).forEach((element)=>{ // since itemCompleted is a nodelist, we need to turn it into an array. foreach has us loop through each item 
    element.addEventListener('click', markUnComplete) // add an event listener to the current item and when it is clicked on, run the markUnComplete function
    //logically this must only effect items that are completed, so this is why it has the more specific selection of itemCompleted rather than item

})  //close our loop

async function deleteItem(){  /*delcare an asyc function
 wait on some info to come in before running this async function; force it to wait*/
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item (li), element 0 would be the indent so we select 1 instead, extract the text value (innertext)
    //comments may be ruining this parentNode childnode relationship

/* group thought maybe its a reference at mongodb since it probably uses nodes, innerText what user has entered beforehand. for exampleon Facebook we delete a comment to a post without deleting the parent post*/
    try{ /* starting a try block to do something
    attempt to get this thing, and if you don't manage to then run the next thing, which in this case is catch*/
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //this is a delete request, sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //states the content will be a json string, what type of content to expect
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText //will be passed inside the body, itemText variable was declared earlier // setting the content of thebody to the inner tet of the list item, and namin it 'itemFromJS'
            })                   //closing the body
          }) //closing the object
        const data = await response.json() //waiting on the server to respond with json and storing it in the data variable
        //waiting on the JSOn from the responseto be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

/* if it can't be deleted since its alreadly deleted ect, it will return an error */
    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} // end the function

async function markComplete(){ //ONLY THING DIFFERENT IS A DIFFERENT ROUTE AND DIFFERENT METHOD
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item (li), element 0 would be the indent so we select 1 instead, extract the text value (innertext)
    try{/* starting a try block to do something */
        const response = await fetch('markComplete', {  //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //this is a put/update request, sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //states the content will be a json string, what type of content to expect
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //will be passed inside the body, itemText variable was declared earlier // setting the content of thebody to the inner tet of the list item, and namin it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on the server to respond with json and storing it in the data variable
        //waiting on the JSOn from the responseto be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err)  //log the error to the console
    }  //close the catch block
}// end the function


//next function is the SAME as above, just a different route
async function markUnComplete(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item (li), element 0 would be the indent so we select 1 instead, extract the text value (innertext)
    try{ /* starting a try block to do something */
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //this is a put/update request, sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //states the content will be a json string, what type of content to expect
            body: JSON.stringify({  //declare the message content being passed and stringify that content
                'itemFromJS': itemText //will be passed inside the body, itemText variable was declared earlier // setting the content of thebody to the inner tet of the list item, and namin it 'itemFromJS'

            })  //closing the body
          }) //closing the object
        const data = await response.json()  //waiting on the server to respond with json and storing it in the data variable
        //waiting on the JSOn from the responseto be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
}// end the function


//combination of our css styling and EJS results in completed things being crossed out and grey instead of this javascript document
//this main.js is basically just a launchpad to send requests to the server
//ejs isn't violating seperation of concerns because EJS is literally embedded javascript, it is its own language. 3 JavaScript kids in an HTML trenchcoat