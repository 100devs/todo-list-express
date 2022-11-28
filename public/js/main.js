const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of 'fa-trash'
const item = document.querySelectorAll('.item span.regular') //creating a variable and assigning it to a selection of span tags within a parent with the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of span tags with the class of "completed" within a parent with the class of "item"

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection of .fa-trash and starting a loop
    element.addEventListener('click', deleteItem) //adding an event listener to the current item that waits for a click and onclick, it calls a function called deleteItem
}) //close our loop

Array.from(item).forEach((element)=>{//creating an array from our variable item from above and starting a loop
    element.addEventListener('click', markComplete) //adding an event listener to the current item that waits for a click and onclick, it calls a function called markComplete
}) //close our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our itemCompleted selection and starts a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items, listens to a click, and then runs markUnComplete
}) //close our loop


async function deleteItem(){ //declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //grabs parent node of deleteBtn (the li), then the child node + second element (the spans) and then will grab the inner text
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { // creates a variable that waits on a fetch to get data from the result of the deleteItem route - also starts an object
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //this tells the browser the type of content to expect (JSON)
            body: JSON.stringify({ //declare the message content being passed and stringify that content 
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and making it 'itemFromJS'
            })// closes body
          }) //closing the object
        const data = await response.json() //creating a variable (data) and waiting to get the JSON back from server
        console.log(data) //displays data variable info received from server to the console
        location.reload() //tells the server to refresh the page

    }catch(err){ //if an error occurs, grab it and pass it through the catch block
        console.log(err) //displays the error to the console if error is thrown
    } //closes catch block
} //closes the deleteItem function

async function markComplete(){ //declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //grabs parent node of deleteBtn (the li), then the child node + second element (the spans) and then will grab the inner text
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { // creates a variable that waits on a fetch to get data from the result of the markComplete route - also starts an object
            method: 'put', //Sets the CRUd method for the route, which is update
            headers: {'Content-Type': 'application/json'}, //this tells the http JSON headers what type of content to expect
            body: JSON.stringify({ // takes the content from the body and stringifies it
                'itemFromJS': itemText //takes itemText which is the inner text of the list item and makes it 'itemFromJS'
            }) //closes body
          }) //closes the object
        const data = await response.json() //creates a variable that is waiting for a response from the server in JSON format
        console.log(data) //displays data variable info received from server to the console
        location.reload() //tells the server to refresh the page


    }catch(err){ //starts a catch block, tells us if there is an error, execute what is inside the catch block
        console.log(err) //displays the error to the console if error is thrown
    } //closes catch block
}//closes the markComplete function

async function markUnComplete(){ //declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //grabs parent node of li, then the child node + second element (the spans) and then will grab the inner text
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a variable that waits on a fetch to get data from the result of the markUnComplete route - also starts an object
            method: 'put', //Sets the CRUd method for the route, which is update
            headers: {'Content-Type': 'application/json'}, //this tells the http JSON headers what type of content to expect
            body: JSON.stringify({ // takes the content from the body and stringifies it
                'itemFromJS': itemText //takes itemText which is the inner text of the list item and makes it 'itemFromJS'
            })  //closes body
          }) //closes the object
        const data = await response.json() //creates a variable that is waiting for a response from the server in JSON format
        console.log(data) //displays data variable info received from server to the console
        location.reload() //tells the server to refresh the page

    }catch(err){ //starts a catch block, tells us if there is an error, execute what is inside the catch block
        console.log(err) //displays the error to the console if error is thrown
    }  //closes catch block
} //closes the markComplete function
