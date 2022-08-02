const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning it to a selection of all elements wtih a class of '.fa-trash' and stores variable deleteBtn 
const item = document.querySelectorAll('.item span') //selecting a variable and assigning it to a selection of span tags with a parent that has class of '.item'
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable & assigning to a selction of span tags with a class of 'completed' inside a parent with class '.item', code error missing a space

Array.from(deleteBtn).forEach((element)=>{//reate an array .from deleteBtn and looping trough each element 
    element.addEventListener('click', deleteItem)//add event listener to current item that wait for a click, on click calls function called deleteItem
})

Array.from(item).forEach((element)=>{//create an array, starting a loop
    element.addEventListener('click', markComplete)//add the deleteBtns into an array, add event listener to current item that waits for a click calling the function that is markComplete
})

Array.from(itemCompleted).forEach((element)=>{//create an array, starting a loop
    element.addEventListener('click', markUnComplete)//add the deleteBtns into an array, adds an event listener to only completed items or markUncomplete
})

async function deleteItem(){//declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//direct reference: grab parent, then child, then 2nd element, then the text (don't do this, use classes, datatags), looks inside of list item an extracts the text value of the specified list item
    try{//starting try block, try block(allows us to run something or other) and catch block(if an error is thrown, it handles that error) go together
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to get data from a deleteItem
            method: 'delete',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//parse as JSON, specifying the type of content that is expected which JSON
            body: JSON.stringify({//the body is the method that we are getting, make it a string
              'itemFromJS': itemText//setting the content to the body to innnerText of the list item and naming it 'itemFromJS', same as line84 in server.js. they need to match, they are tied together
            })
          })
        const data = await response.json()//we waited for the response, now we need to read it(conversion) and wait for JSON
        console.log(data)//log data to console
        location.reload()//refresh the page, show updated list

    }catch(err){//something failed, if an error occurs pass the error into the attached block
        console.log(err)//log error to the console
    }
}

async function markComplete(){//updating stuff, declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//see above for the notes line18
    try{//starting a try block
        const response = await fetch('markComplete', {//creates a response variable that waits on the fetch to get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to update for the route
             headers: {'Content-Type': 'application/json'},//make sure it's JSON, specifying the type of contect which is JSON
            body: JSON.stringify({//make it a string
                'itemFromJS': itemText//setting the content to the body to innnerText of the list item and naming it 'itemFromJS', same as line84 in server.js. they need to match, they are tied together
            })
          })
        const data = await response.json()//waiting on JSON response
        console.log(data)//response
        location.reload()//refresh

    }catch(err){//if error occurs, pass the error into the catch block
        console.log(err)//log error to console
    }
}

async function markUnComplete(){//same as above but complete as opposed to incomplete, declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the lsit item and grabs only the inner text within the list span
    try{//starting try block
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetcch to get data from the result of markUnComplete
            method: 'put',//setting the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'},//make sure it's JSON, specifying the type of contect which is JSON
            body: JSON.stringify({//make it a string
                'itemFromJS': itemText//setting the content to the body to innnerText of the list item and naming it 'itemFromJS', same as line84 in server.js. they need to match, they are tied together
            })
          })
        const data = await response.json()//
        console.log(data)//
        location.reload()//

    }catch(err){//
        console.log(err)//
    }
}