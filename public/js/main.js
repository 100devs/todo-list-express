const deleteBtn = document.querySelectorAll('.fa-trash') //assigning 'deleteBtn' to all icons with the fa-trash
const item = document.querySelectorAll('.item span') // assigning 'item' to all elements with the class of .item and all spans
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a var itemCompleted ans assigning it to spans that have a class of completed with a PARENT with the class of item 

Array.from(deleteBtn).forEach((element)=>{//turning the deletbuttons into an array and looping through each button
    element.addEventListener('click', deleteItem)//calling a function called deleteItem when button is clicked via event listener
})//close our loop

Array.from(item).forEach((element)=>{//turning 'item' var into an array and looping through each 'item'
    element.addEventListener('click', markComplete)//calling markComplete function when the 'item' is clicked 
})//close loop

Array.from(itemCompleted).forEach((element)=>{//creating array from the itemCompleted variable , looping through each 'itemCompleted' 
    element.addEventListener('click', markUnComplete)//runs the markUncomplete when clicked, only on COMPLETED items
})//close loop

async function deleteItem(){//declaring an asynchrounous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside text that inside of the list item grabs only the inner text within the list span
    try{//starting a try block to do stuff
        const response = await fetch('deleteItem', {// assigning response var to a fetch that waits for fetch to get data from the result of delete item route
            method: 'delete',//declaring method of delete on our object , CRUD for the route
            headers: {'Content-Type': 'application/json'},//specifies the type of content expected (json)
            body: JSON.stringify({//declare the message content being passed and stringify that content 
              'itemFromJS': itemText//setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//closing body
          })//closing the object
        const data = await response.json()//waiting on the JSON from the response to be converted 
        console.log(data)//log data from console
        location.reload()//reloads the page to update what is displayed to the client 

    }catch(err){//if error occurs pass it into the catch block
        console.log(err)//log error to console
    }//close the catch block
}//end the function

async function markComplete(){//declaring an asynchrounous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside text that inside of the list item grabs only the inner text within the list span
    try{//starting a try block to do stuff
        const response = await fetch('markComplete', {// assigning response var to a fetch that waits for fetch to get data from the result of markComplete item route
            method: 'put',//declaring method of put on our object , CRUD for the route
            headers: {'Content-Type': 'application/json'},//specifies the type of content expected (json)
            body: JSON.stringify({//declare the message content being passed and stringify that content 
                'itemFromJS': itemText//setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//closing body
          })//closing obj
        const data = await response.json()//waiting on the JSON from the response to be converted 
        console.log(data)//log data from console
        location.reload()//reloads the page to update what is displayed to the client 

    }catch(err){//if error occurs pass it into the catch block
        console.log(err)//log error to console
    }//close catch
}//end function

async function markUnComplete(){//declaring an asynchrounous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside text that inside of the list item grabs only the inner text within the list span
    try{//starting a try block to do stuff
        const response = await fetch('markUnComplete', {// assigning response var to a fetch that waits for fetch to get data from the result of markUnComplete item route
            method: 'put',//declaring method of put on our object , CRUD for the route
            headers: {'Content-Type': 'application/json'},//specifies the type of content expected (json)
            body: JSON.stringify({//declare the message content being passed and stringify that content 
                'itemFromJS': itemText//setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//close body
          })//close obj
        const data = await response.json()//waiting on the JSON from the response to be converted 
        console.log(data)//log data to function
        location.reload()//reloads the page to display changes to client 

    }catch(err){//if error occurs pass it into the catch block
        console.log(err)//log error to console
    }//close catch
}//end function