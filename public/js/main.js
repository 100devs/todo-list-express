const deleteBtn = document.querySelectorAll('.fa-trash') //selects all trash can icons and binds them to the variable deleteBtn
const item = document.querySelectorAll('.item span') //selects all items and binds them to the vairable item
const itemCompleted = document.querySelectorAll('.item span.completed')//selects all items that are completed and binds them to the variable itemCompleted

Array.from(deleteBtn).forEach((element)=>{//creates an array from the selection and starts a loop
    element.addEventListener('click', deleteItem)//adds a smurph the current item.  When clicked it calls the deleteItem function
})//closes the loop

Array.from(item).forEach((element)=>{//creates an array from the selection and starts a loop
    element.addEventListener('click', markComplete)//adds a smurph the current item.  When clicked it calls the markComplete function
})//closes the loop

Array.from(itemCompleted).forEach((element)=>{//creates an array from the selection and starts a loop
    element.addEventListener('click', markUnComplete)//adds a smurph the current item.  When clicked it calls the markUnComplete function
})//closes the loop

async function deleteItem(){ //declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item to extract the text value only of the specified list item
    try{ //starting a try block
        const response = await fetch('deleteItem', { //creates a response variable that waits on fetch to get data from the result of the deleteItem route.
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected
            body: JSON.stringify({ //declare the message content being passes and stringify that concent
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//closing the fetch
        const data = await response.json() //wait on the JSON from the response to be converted
        console.log(data) //log the results to the console.
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass it into the catch block
        console.log(err) //log the error to the console
    }//close the catch block
}//end the function
 
async function markComplete(){//declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item to extract the text value only of the specified list item
    try{ //starting a try block
        const response = await fetch('markComplete', {//creates a response variable that waits on fetch to get data from the result of the markComplete route.
            method: 'put',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected
            body: JSON.stringify({//declare the message content being passes and stringify that concent
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//clsoing the fetch
        const data = await response.json()//wait on the JSON from the response to be converted
        console.log(data) //log the results to the console
        location.reload() //reloads the page to update the data displayed

    }catch(err){ //if an error occurs, pass it into the catch block
        console.log(err) //loc the error to the console
    } //close the catch block
} //close the function

async function markUnComplete(){//declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item to extract the text value only of the specified list item
    try{ //starting a try block
        const response = await fetch('markUnComplete', {//creates a response variable that waits on fetch to get data from the result of the markUnComplete route.
            method: 'put',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected
            body: JSON.stringify({//declare the message content being passes and stringify that concent
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//clsoing the fetch
        const data = await response.json()//wait on the JSON from the response to be converted
        console.log(data) //log the results to the console
        location.reload() //reloads the page to update the data displayed

    }catch(err){ //if an error occurs, pass it into the catch block
        console.log(err) //loc the error to the console
    } //close the catch block
} //close the function