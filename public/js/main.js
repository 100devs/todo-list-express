const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning it all elements that have the "fa-trash" class
const item = document.querySelectorAll('.item span') //creating a variable that selects the span elements that are in elements with the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable that selects all span elements with the class of "completed" and are found in elements with the class of "item"

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})//making an array of all elements with the "fa-trash" class (elements that were assigned to the variable of deleteBtn above) the looping through it and adding an event listener. If the item is clicked, then it calls the deleteItem function.

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})//making an array from all elements that are span AND are nested in elements with the "item" class. The array is then looped through and an event listener is added. When one of the elements is clicked, it calls the function markComplete

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})//making an array with all the span elements with the class of "completed" and nested in elements with the class of "item". The array is then looped through and an event listener is added. When one of the elements is clicked the function called "markUnComplete" is called. Add event listener to completed items.

async function deleteItem(){//declaring an async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list
    try{//decalring a try block to do something
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete',//set the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected which is JSON
            body: JSON.stringify({//declare the message content being passed and strinify that content
              'itemFromJS': itemText//setting the content of the body to the innerText of the list item and naming it "itemFromJS"
            })//closing the body
          })//closing the object
        const data = await response.json()// waiting on the JSON from the response to be converted
        console.log(data)// log result to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)// log the err to the console
    }//close the catch block
}//end the function

async function markComplete(){//declaring an async function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list
    try{//decalring a try block to do something 
        const response = await fetch('markComplete', {//creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put',//set the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected which is JSON
            body: JSON.stringify({//declare the message content being passed and strinify that content
                'itemFromJS': itemText//setting the content of the body to the innerText of the list item and naming it "itemFromJS"
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on the JSON from the response to be converted
        console.log(data)//log result to the console
        location.reload()//reloads the page to update what is displayed
    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)// log the err to the console
    }//close the catch block
}//end the function

async function markUnComplete(){//declaing an async function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list
    try{//decalring a try block to do something 
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put',//set the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected which is JSON
            body: JSON.stringify({//declare the message content being passed and strinify that content
                'itemFromJS': itemText//setting the content of the body to the innerText of the list item and naming it "itemFromJS"
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on the JSON from the response to be converted
        console.log(data)//log result to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)// log the err to the console
    }//close the catch block
}//end the function