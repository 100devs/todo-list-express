const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable deleteBtn and selecting all the elements that have the class of .fa-trash
const item = document.querySelectorAll('.item span')//creates a variable that selects all of the span tags within a parent that have the class of .item
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of all the spans that have the class of completed within a parent that has the class of item

Array.from(deleteBtn).forEach((element)=>{//makes an array from all of the deletBtns found, the does a forEach loop for each and assigns each element to the temporary element variable
    element.addEventListener('click', deleteItem)//adds a click event listener to each element of the array and adds the deleteItem function to each click.
})//close our loop

Array.from(item).forEach((element)=>{//makes an array from each span found then funs a forEach loop with element as the temp variable for each item
    element.addEventListener('click', markComplete)//adds an event listener to each span for click and runs the markComplete function to each
})//close our loop

Array.from(itemCompleted).forEach((element)=>{//makes an array from each itemCompleted variable found. then runs a forEach loop.
    element.addEventListener('click', markUnComplete)//gets the current element and adds a click event listener to run the markUnComplete function each time its clicked
})//close our loop

async function deleteItem(){//create an async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //create a variable to hold the second item of the child node which is the text that is inside of the span.
    try{//starting a try block. if everything goes well, do this 
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to get data from the result of deleteItem
            method: 'delete',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content
              'itemFromJS': itemText//inside the body we declare that 'itemFromJS': is the itemText, which is the inner text of our list item
            })//close the body object
          })//close the await fetch
        const data = await response.json()//awaiting on the JSON from the response to be converted
        console.log(data)//console.log the result of the data 
        location.reload()//refresh the page to get the new info from the database, which would now contain one less item cause this whole function was to delete it.

    }catch(err){//if an error occurs, pass the error into the catch block.
        console.log(err)//log the error to the console.
    }//close the catch block
}//end the function

async function markComplete(){//make another async function this time called markComplete
    const itemText = this.parentNode.childNodes[1].innerText//selecting itemText from the span and getting the innerText from it
    try{//starting a try  block to do something
        const response = await fetch('markComplete', {//create a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText//inside the body we declare theat 'itemFromJS': id the itemText, which is the inner text of our list item
            })//close the body object
          })//close the await fetch
        const data = await response.json()//awaiting on the JSON from the response to be converted
        console.log(data)//console.log the result of the data
        location.reload()//refresh the page to get the new info from the database, which would now contain a marked item which was the point of this function

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console.
    }//close the catch block
}//end the function

async function markUnComplete(){//make another async function this time called markComplete
    const itemText = this.parentNode.childNodes[1].innerText//selecting itemText from the span and getting the innerText from it
    try{//starting a try  block to do something
        const response = await fetch('markUnComplete', {//create a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content
                'itemFromJS': itemText//inside the body we declare theat 'itemFromJS': id the itemText, which is the inner text of our list item
            })//close the body object
          })//close the await fetch
        const data = await response.json()//awaiting on the JSON from the response to be converted
        console.log(data)//console.log the result of the data
        location.reload()//refresh the page to get the new info from the database, which would now contain a marked item which was the point of this function

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//console.log the error to the console
    }//close the catch block
}//end the function