const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable that is assigned to all elements with the fa-trash class
const item = document.querySelectorAll('.item span')//crates a variable that consists of all span tags inside a parent with a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable that consits of all spans with a class of completed inside a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{//taking all of our delete buttons, from our above variable selecting them, and creating an array of them, and then starting a loop iterating through them
    element.addEventListener('click', deleteItem)//adding on all those trash icons an event listener where on a click our deleteItem function will run
})//closes our for loop

Array.from(item).forEach((element)=>{//taking all of the things we selected with our item variable, all of our spans inside a parent with a class of 'item', and are turning them into an array and looping through them
    element.addEventListener('click', markComplete)//creating an event listener where on a click it'll run our markComplete function
})//closes our for loop

Array.from(itemCompleted).forEach((element)=>{//taking all of the things we selected with our itemCompleted variable, all of our spans with completed class inside an item class, and looping through them
    element.addEventListener('click', markUnComplete)//creating an event listener on them where on click it'll run our markUnComplete function
})//closes our for loop

async function deleteItem(){//declaring an asynchronous function. being asynchronous gives us more flexibility on when and how things run, allowing us to wait on other things
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the innerText within the list's span and sets that specific text as the value of itemText
    try{//starting a try block, code to attempt to do
        const response = await fetch('deleteItem', {//We're retrieving data from the result of deleteItem, waiting for it to be retrieved, and setting it to response
            method: 'delete',//sets the CRUD method we use for our route
            headers: {'Content-Type': 'application/json'},//We're specifying that the type of content expected to be received is json
            body: JSON.stringify({//declare the message content being passed, and stringifying that content
              'itemFromJS': itemText//setting the content of the body to the innerText of the list item as the value of an itemFromJS property
            })//closing the body
          })//closing the object
        const data = await response.json()//Waiting on JSON from the response to be converted and then setting that to data
        console.log(data)//logging the result to the console
        location.reload()//reloading the page to udpate what is displayed

    }catch(err){//starting a catch block: if the code in the try block doesn't work then do this
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function

async function markComplete(){//declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//selecting the text and setting itemText equal to it
    try{//starting a try block
        const response = await fetch('markComplete', {//declaring a response and awaiting a fetch from the markComplete route
            method: 'put',//setting up a put method to update something
            headers: {'Content-Type': 'application/json'},//telling it to expect it as json
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText//setting the content of the body to be the text we selected earlier
            })
          })
        const data = await response.json()//waiting on json from the response to be converted
        console.log(data)//log it to console
        location.reload()//refresh page

    }catch(err){//open block for if there's error
        console.log(err)//log the error
    }//close catch
}//close function
//^ **The only difference here is which route and which method we're using**

async function markUnComplete(){//same
    const itemText = this.parentNode.childNodes[1].innerText//same
    try{//same
        const response = await fetch('markUnComplete', {//Now we're sending data to the markUncomplete route
            method: 'put',//same as second, not first
            headers: {'Content-Type': 'application/json'},//same
            body: JSON.stringify({//same
                'itemFromJS': itemText//same
            })//same
          })//same
        const data = await response.json()//same
        console.log(data)//same
        location.reload()//same

    }catch(err){//same
        console.log(err)//same
    }//same
}//same

//small differences changing lots of things

//Our main.js file here is basically a launchpad that has event-listeners that sends off requests to the servers.