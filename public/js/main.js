const deleteBtn = document.querySelectorAll('.fa-trash') //creating a constant and selecting all elements with a class of the trashcan//
const item = document.querySelectorAll('.item span')//creating a constant and selecting all spans with a class of item//
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a constant and selecting all spans with a class of item and completed//

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop//
    element.addEventListener('click', deleteItem)//adding an eventlistener that listens for a click, and then calls a function called deleteItem (deletes the task upon click)//
})//closes out of the loop//

Array.from(item).forEach((element)=>{//creating an array from our selection and starting a loop//
    element.addEventListener('click', markComplete)//adding an eventlistener that listens for a click, and then calls a function called markComplete (strikes through text)//
})//closes out of the loop//

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection and starting a loop//
    element.addEventListener('click', markUnComplete)//adding an eventlistener that listens for a click, and then calls a function called markUnComplete (unstrikes through text)//
})//closes out of the loop//

async function deleteItem(){//declaring an asyncronous function **async function helps change the flow of execution, force the function to wait**//
    const itemText = this.parentNode.childNodes[1].innerText//creates a constant variable that is looking inside the text that's inside the list item, and choosing the second item in the array//
    try{//declaring a try block **allows us to run something**//
        const response = await fetch('deleteItem', {//creating a constant variable that waits on a fetch to get data from the result of the deleteItem route//
            method: 'delete',//sets the CRUD method as the route//
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected (json)//
            body: JSON.stringify({//declare the message content and message being passed and return it as a string//
              'itemFromJS': itemText//setting the content of the body to the innertext of the list item and naming it 'itemFromJS'//
            })//closing the body//
          })//closing the object//
        const data = await response.json()//creating a constant that waits for the server to respond with json to be converted//
        console.log(data)//log the data to the console//
        location.reload()//refreshes the page to update what is displayed//

    }catch(err){//declaring a catch block **allows us to recieve an error if try does not work**//
        console.log(err)//log the error to the console//
    }//close the catch block//
}//end the function//

async function markComplete(){//declaring an asyncronous function **async function helps change the flow of execution, force the function to wait**//
    const itemText = this.parentNode.childNodes[1].innerText//creates a constant variable that is looking inside the text that's inside the list item, and choosing the second item in the array//
    try{//declaring a try block **allows us to run something**//
        const response = await fetch('markComplete', {//creating a constant variable that waits on a fetch to get data from the result of the markComplete route//
            method: 'put',//setting the CRUD method to update for the route//
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected (json)//
            body: JSON.stringify({//declare the message content and message being passed and return it as a string//
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and naming it 'itemFromJS'//
            })//close the body//
          })//close the object//
        const data = await response.json()//creating a constant that waits for the server to respond with json to be converted//
        console.log(data)//log the data to the console//
        location.reload()//refreshes the page to update what is displayed//

    }catch(err){//declaring a catch block **allows us to recieve an error if try does not work**//
        console.log(err)//log the error to the console//
    }//close the catch block//
}//end the function//

async function markUnComplete(){//declaring an asyncronous function **async function helps change the flow of execution, force the function to wait**//
    const itemText = this.parentNode.childNodes[1].innerText//creates a constant variable that is looking inside the text that's inside the list item, and choosing the second item in the array//
    try{//declaring a try block **allows us to run something**//
        const response = await fetch('markUnComplete', {//creating a constant variable that waits on a fetch to get data from the result of the markUnComplete route//
            method: 'put',//setting the CRUD method to update for the route//
            method: 'put',//setting the CRUD method to update for the route//
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected (json)//
            body: JSON.stringify({//declare the message content and message being passed and return it as a string//
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and naming it 'itemFromJS'//
            })//close the body//
          })//close the object//
        const data = await response.json()//creating a constant that waits for the server to respond with json to be converted//
        console.log(data)//log the data to the console//
        location.reload()//refreshes the page to update what is displayed//

    }catch(err){//declaring a catch block **allows us to recieve an error if try does not work**//
        console.log(err)//log the error to the console//
    }//close the catch block//
}//end the function//
