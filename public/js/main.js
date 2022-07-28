const deleteBtn = document.querySelectorAll('.fa-trash')// creates a variable. the variable will be equal to a selector that will target all items equal to a class of fa-trash
const item = document.querySelectorAll('.item span') // creates a variable. The variable will be equal to a selector that will target all classes of item and all spans that are a child of item.
const itemCompleted = document.querySelectorAll('.item span.completed')//creates a variable. The variable will be equal to a selector that will target all classes of item, all spans that are in a class of item and all classes of completeted.

Array.from(deleteBtn).forEach((element)=>{//creates an array from the items targeted in the deleteBtn variable. Starts a for each method that goes through each of the items with element as the variable.
    element.addEventListener('click', deleteItem)//adds an eventlistener to the element variable and waits for the element to be clicked by a cursor. once this happens it runs the deleteItem function. 
})//closes the foreach method

Array.from(item).forEach((element)=>{//creates an array from the items targeted in the deleteBtn variable. Starts a for each method that goes through each of the items with element as the variable.
    element.addEventListener('click', markComplete)//adds an eventlistener to the element variable and waits for the element to be clicked by a cursor. once this happens it runs the markComplete function. 
})//closes the foreach method

Array.from(itemCompleted).forEach((element)=>{//creates an array from the items targeted in the itemCompleted variable. Starts a for each method that goes through each of the items with element as the variable.
    element.addEventListener('click', markUnComplete)//adds an eventlistener to the element variable and waits for the element to be clicked by a cursor. once this happens it runs the markUncompleted function. 
})//closes the foreach method

async function deleteItem(){//runs an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText//assigns itemText to an obj+
    try{//creates a chain to retrieve or do something
        const response = await fetch('deleteItem', {//variable response will be assigned to the fetch function which will go retrieve something from deleteItem and wait until it receives something.
            method: 'delete',//the method type will be set to delete which will delete an item thats given
            headers: {'Content-Type': 'application/json'},//the type of content that will be served up will be in a json format
            body: JSON.stringify({//the actual content of what's being requested will be converted to json.stringify
              'itemFromJS': itemText //the format of the information being requested to be deleted
            })//closing the format information
          })//closing the fetch function 
        const data = await response.json()//data will be assigned to the actual response coming from fetch that will be converted to json format.
        console.log(data)//data will be shown in the console
        location.reload()//page will refresh with the item no longer present

    }catch(err){//creates a chain that will catch if something goes wrong in the request
        console.log(err)//will show the exact error in the console.
    }//closes the catch block
}//closes the delete function

async function markComplete(){//creates an ansynchronous function with the name of markComplete
    const itemText = this.parentNode.childNodes[1].innerText// assigns itemText to the item in the index.ejs that contains a parent(li) with a child element(span) at the 1st index(2nd span) and display that text on the page.
    try{//creates a chain to retrieve or do something
        const response = await fetch('markComplete', {///variable response will be assigned to the fetch function which will go retrieve something from markComplete and wait until it receives something.
            method: 'put',//allows the route to be updated with information
            headers: {'Content-Type': 'application/json'},//the content sent to the route will be displayed in json format
            body: JSON.stringify({//the information being sent will be converted into json.stringify
                'itemFromJS': itemText//the format of the information being requested to be updated
            })//closing the body
          })//closing the object 
        const data = await response.json() //assigns data to wait for a response from the fetch.
        console.log(data)//results will be entered into the console
        location.reload() // page will be updated and refreshed with updated content.

    }//closes the try block
    catch(err){//creates a chain that will catch something that went wrong 
        console.log(err)//will console log the error or thing that went wrong
    }//closes the catch block
}//closes the markComplete function

async function markUnComplete(){//creates an ansynchronous function with the name of markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText// assigns itemText to the item in the index.ejs that contains a parent(li) with a child element(span) at the 1st index(2nd span) and display that text on the page.
    try{//creates a chain to retrieve or do something
        const response = await fetch('markUnComplete', {//variable response will be assigned to the fetch function which will go retrieve something from markunComplete and wait until it receives something.
            method: 'put',//allows the route to be updated with information
            headers: {'Content-Type': 'application/json'},//the content sent to the route will be displayed in json format
            body: JSON.stringify({//the information being sent will be converted into json.stringify
                'itemFromJS': itemText//the format of the information being requested to be updated
            })//closes the body 
          })//closes fetch/response variable
        const data = await response.json()//assigns data to wait for a response from the fetch.
        console.log(data)// will put the information equalling data into the console.
        location.reload()//page will be updated and refreshed with new content.

    }/*closes try block*/catch(err){//creates a chain that will catch something that went wrong 
        console.log(err)//will console log the error or thing that went wrong
    }//closes the catch block
}//closes the markUnComplete function