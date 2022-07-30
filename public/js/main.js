const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning all elements with class of the trash can
const item = document.querySelectorAll('.item span')//creating a variable and assigning it to a selection of span tags inside of parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of spans with a class of 'completed' inside of a parent with class 'item'

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)//add an event listener to the current item that waits for a click and calls function deleteItem
})//close the loop

Array.from(item).forEach((element)=>{//
    element.addEventListener('click', markComplete)//creat an event listener to the current item then waits for click and then calls a function called markComplete
})//close the loop

Array.from(itemCompleted).forEach((element)=>{//creating array from selection and starting loop
    element.addEventListener('click', markUnComplete)//add event listener to ONLY completed items
})//close our loop

async function deleteItem(){//declaring async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item and grabs only inner text within the list of span
    try{//starting a try block to do something
        const response = await fetch('deleteItem', {//creates a variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete',// sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//setting the type of content expected 'JSON'
            body: JSON.stringify({//declaring the message content being passed, and stringify that content
              'itemFromJS': itemText//setting the content of the body to  the inner text of the list item,  and naming it 'itemFromJS'
            })//closing the body
          })// closing the object
        const data = await response.json()//waiting to get JSON from server response
        console.log(data)//log data to console
        location.reload()//reloads page to update what is displayed

    }catch(err){//if error occurs pass the error into the block
        console.log(err)//log the error into the console
    }//closing the catch block
}//end the function

async function markComplete(){// declaring async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item and grabs only inner text within the list of span
    try{// starting a try block
        const response = await fetch('markComplete', {//create a response variable that waits on fetch to get date from result of the markComplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//setting the type of content expected 'JSON'
            body: JSON.stringify({//declaring the message content being passed, and stringify that content
                'itemFromJS': itemText//setting the content of the body to  the inner text of the list item,  and naming it 'itemFromJS'
            })//closing the body
          })//close the object
        const data = await response.json()//waiting to get JSON from server response
        console.log(data)//log data to console
        location.reload()//reloads page to update what is displayed

    }catch(err){//if error occurs pass the error into the block
        console.log(err)//log the error into the console
    }//closing the catch block
}//end function

async function markUnComplete(){//decarling asyncrounous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item and grabs only inner text within the list of span
    try{//starting try block
        const response = await fetch('markUnComplete', {//create a response variable that waits on fetch to get date from result of the markUnComplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//setting the type of content expected which is 'JSON'
            body: JSON.stringify({//declaring the message content being passed, and stringify that content
                'itemFromJS': itemText//setting the content of the body to  the inner text of the list item,  and naming it 'itemFromJS'
            })//closing the body
          })//close the object
        const data = await response.json()//waiting to get JSON from server response
        console.log(data)//log data to console
        location.reload()//reloads page to update what is displayed

    }catch(err){//if error occurs pass the error into the block
        console.log(err)//log the error into the console
    }//closing the catch block
}//end function