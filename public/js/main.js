const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning it to a salaction of all elements with a class of the trash can
const item = document.querySelectorAll('.item span')//creating a variable and assigning it to a selection of a span tags of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')// creating a vatiable and assign it to a selection of spans with a class of "completed" inside of parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)//add an event listener to the current item that waits for a click and then calls a function called deleteItem.
})//close our loop

Array.from(item).forEach((element)=>{//creating an array and we are starting loop
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for a click and then calls a function called markComplete
})//close our loop

Array.from(itemCompleted).forEach((element)=>{//creating an array and we are starting loop
    element.addEventListener('click', markUnComplete)//add an event listener to ONLY completed items
})//close our loop

async function deleteItem(){//declare an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{//starting a try block to do something
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to get data from a result of deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},// specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message contentbeing passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//closing the object
        const data = await response.json()// waiting on JSON from the response to be converted
        console.log(data)// log the result to the console
        location.reload()//reloads the age to update what is dsiplayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)// log the error ro the console
    }//close the catch block
}//close the function

async function markComplete(){// declara an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span 
    try{// starting a try block to do something
        const response = await fetch('markComplete', {// creates a response variable that waits ona afetch to get data dfrom the result of the markComplete route
            method: 'put',//setting the CRUD method to "update" for route
            headers: {'Content-Type': 'application/json'},// specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message contentbeing passed, and stringify that content
                'itemFromJS': itemText//setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body    
          })// closing the object
        const data = await response.json()// waiting on JSON from the response to be converted
        console.log(data)// log the result to the console
        location.reload()//reloads the age to update what is dsiplayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)// log the error ro the console
    }//close the catch block
}//end the function

async function markUnComplete(){//// declara an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span 
    try{// starting a try block to do something
        const response = await fetch('markUnComplete', {// creates a response variable that waits ona afetch to get data dfrom the result of the markUnComplete route
            method: 'put',//setting the CRUD method to "update" for route
            headers: {'Content-Type': 'application/json'},// specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message contentbeing passed, and stringify that content
                'itemFromJS': itemText//setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body 
          })// closing the object
        const data = await response.json()// waiting on JSON from the response to be converted
        console.log(data)// log the result to the console
        location.reload()//reloads the age to update what is dsiplayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)// log the error ro the console
    }//close the catch block
}//end the function