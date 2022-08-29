const deleteBtn = document.querySelectorAll('.fa-trash') // variable creation for all elements with a class of .fa-trash
const item = document.querySelectorAll('.item span') // variable creation for all spans with a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // variable creation for all completed spans with a class of item

Array.from(deleteBtn).forEach((element)=>{ // create an array from the deleteBtn variable that loops through all the elements applicable to that variable
    element.addEventListener('click', deleteItem) // on each deleteBtn element, add an event listener that listens for a click and when that is executed, calls function deleteItem
})

Array.from(item).forEach((element)=>{ // create an array from the item variable that loops through all the elements applicable to that variable
    element.addEventListener('click', markComplete) // on each item element, add an event listener that listens for a click and once executed, calls function markUnComplete 
})

Array.from(itemCompleted).forEach((element)=>{ // create an array from itemCompleted variable and loop through all the elements applciable to that variable
    element.addEventListener('click', markUnComplete) // on each itemCompleted element, add an event listener for a click that, once executed, calls function markUnComplete 
})

async function deleteItem(){ // declaring an deleteItem as an async function
    const itemText = this.parentNode.childNodes[1].innerText // with user click, look at parent node, go to child node that was clicked and get text the text inside
    try{ // first try what follows 
        const response = await fetch('deleteItem', { // create a response variable that awaits the fetch request to get the data from 'deleteItem'
            method: 'delete', // CRUD method in html
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected (JSON)
            body: JSON.stringify({ // take the JSON object that is within the body and convert it into a string
              'itemFromJS': itemText // setting the content from the body to the inner text of the list item and naming it 'itemFromJS'
            })
          })
        const data = await response.json() // wait for the JSON response from the server and then assign it into a variable named data
        console.log(data) // console log the data 
        location.reload() // reload the page

    }catch(err){ // if promise (try) does not work
        console.log(err) // console log the error
    }
}

async function markComplete(){ // declare an async function named markComplete
    const itemText = this.parentNode.childNodes[1].innerText // with user click, look at the parent node, go the child node and retrieve text inside
    try{ // first try what follows
        const response = await fetch('markComplete', { // create a response variable that awaits the fetch request to get the data from 'markComplete'
            method: 'put', // CRUD method in html
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected (JSON)
            body: JSON.stringify({ // take the JSON object that is within the body and convert it into a string
                'itemFromJS': itemText // setting the content from the body to the inner text of the item of the list and naming it 'itemFromJS'
            })
          })
        const data = await response.json() // wait for the JSON response from the server and then assign it into a variable named data
        console.log(data) // console log the data
        location.reload() // reload the page

    }catch(err){ // if promise (try) does not work
        console.log(err) // console log the error
    }
}

async function markUnComplete(){ // declare an async function named markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // with user click, look at parent node, go to child node and retrieve text inside
    try{ // first try what follows
        const response = await fetch('markUnComplete', { // create a response variable that awaits the fetch request to get the data from 'markUnComplete'
            method: 'put', // CRUD method in html
            headers: {'Content-Type': 'application/json'}, // setting the content from the body to the inner text of the item of the list and naming it 'itemFromJS'
            body: JSON.stringify({ // take the JSON object that is within the body and convert it into a string
                'itemFromJS': itemText // setting the content from the body to the inner text of hte item of the list and naming it 'itemFromJS'
            })
          })
        const data = await response.json() // wait for JSON response from the server and then assign it into a variable named data
        console.log(data) // console log the data
        location.reload() // reload the page

    }catch(err){ // if promise (try) does not work
        console.log(err) //console log the error 
    }
}