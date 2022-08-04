const deleteBtn = document.querySelectorAll('.fa-trash')//create a variable and assign it to a selections of all elements with class of trash can
const item = document.querySelectorAll('.item span')//create a variable and assign it to selections of span tag with a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')//create a variable and assign it to selections of span tags  with a class of "completed" inside of a parent that has a class of "item"

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)//add an event listener to the current item that waits for a click and then calls a function called deleteBtn 
})//clossing our  loop

Array.from(item).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for a click and then calls a function called  markComplete
})//close our loop

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)//add an event listener to the current item that waits for a click and then calls a function called markUnComplete
})//close our loop

async function deleteItem(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs the only inner text within the list span
    try{// starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response  variable that waits on a fetch to get data from the results of deleteItem route
            method: 'delete', //sets the crud method for the route
            headers: {'Content-Type': 'application/json'},//specfying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed , stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item , naming it "itemFromJS"
            })// closing the body 
          })// closing the object
        const data = await response.json()// waitting on JSON from the response to be converted
        console.log(data)// log the result to the console
        location.reload()//reload the page to update what is displayed

    }catch(err){//if an error occurs , pass the error into catch block 
        console.log(err)//log the error to the console 
    }//close the catch block function
}//end the function

async function markComplete(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs the only inner text within the list span
    try{//starting a try block to do something
        const response = await fetch('markComplete', { //creates a response  variable that waits on a fetch to get data from the results of markComplete route
            method: 'put', //sets the crud method for the route
            headers: {'Content-Type': 'application/json'}, //specfying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed , stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item , naming it "itemFromJS"
            })//closing the body
          })//closing the object
        const data = await response.json() //waitting on JSON from the response to be converted
        console.log(data)//log the result to the console
        location.reload()//reload the page to update what is displayed

    }catch(err){//if an error occurs , pass the error into catch block 
        console.log(err)//log the error to the console 
    }//close the catch block function
}//end the function


async function markUnComplete(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs the only inner text within the list span
    try{
        const response = await fetch('markUnComplete', {//creates a response  variable that waits on a fetch to get data from the results of markUnComplete route
            method: 'put',//sets the crud method for the route
            headers: {'Content-Type': 'application/json'},//specfying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message content being passed , stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item , naming it "itemFromJS"
            })//closing the body
          })//closing the object
        const data = await response.json() //waitting on JSON from the response to be converted
        console.log(data)//log the error to the console 
        location.reload()//reload the page to update what is displayed

    }catch(err){ //if an error occurs , pass the error into catch block 
        console.log(err)//log the error to the console 
    }//close the catch block function
}//end the function