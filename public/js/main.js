const deleteBtn = document.querySelectorAll('.fa-trash') //declearing variable deletBtn assigning to it all elements with a class for the bin 
const item = document.querySelectorAll('.item span') //declaring variable which holds all span elements with the parent with the class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') //variable with assigned span with a class of 'completed', within a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ //Create an array from 'deleteBtn' items and for every element from the array 
    element.addEventListener('click', deleteItem) //add an event listener on the current element, when clicked call function 'deleteItem'
}) //forEach method closing brackets 

Array.from(item).forEach((element)=>{ //create array from 'item' and for every element from the array
    element.addEventListener('click', markComplete) //add an event listener on the current element, when clicked call function 'markComplete'
}) //forEach method closing brackets 

Array.from(itemCompleted).forEach((element)=>{ //create array from 'itemCompleted' and for every element from the array
    element.addEventListener('click', markUnComplete) //add an event listener on the current element, when clicked call function 'markUnComplete' 
}) //forEach method closing brackets 

async function deleteItem(){ //declara asynchronous function to delete item
    const itemText = this.parentNode.childNodes[1].innerText //declare varible which holds only the text from the parentNode li , childNode span 
    try{ //starting a try block
        const response = await fetch('deleteItem', { //craete variable that waits a fetch function to get data from the result of deleteItem route
            method: 'delete', //set the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specify the type of content expected - json 
            body: JSON.stringify({ //declare the content that is passed and strigify it
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemsFromJS', which we'll use in server.js 
            }) //closing the body
          }) //closing the fetch function
        const data = await response.json() //awaiting for the server to respond with data and converting it to json
        console.log(data) //logging the result 
        location.reload() //reloading the page

    }catch(err){ //starting on the catch block and passing the error if one occurs
        console.log(err) //logging the error
    }//closing the catch
} //closing the function

async function markComplete(){ //declare asynchronous function to mark item as done 
    const itemText = this.parentNode.childNodes[1].innerText //declare varible which holds only the text from the parentNode li , childNode span
    try{ //starting a try block
        const response = await fetch('markComplete', { //declaring a variable that is awaiting the response from a fetch function on a 'markComplete' route
            method: 'put', //put method for update  
            headers: {'Content-Type': 'application/json'}, //specifying the type of the expected content as json
            body: JSON.stringify({ //declare the message content being passed and stringify it
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemsFromJS', which we'll send to the server
            }) //closing the body
          }) //closing the fetch
        const data = await response.json() //waiting the json from the response to be converted
        console.log(data) //logging the result on the console
        location.reload() //reloading the page to update

    }catch(err){ //if an error occurs, pass the error to catch 
        console.log(err) //log the error
    } //close catch block
} //end of the function

async function markUnComplete(){ //declare asynchronous function to mark item as not done 
    const itemText = this.parentNode.childNodes[1].innerText//declare varible which holds only the text from the parentNode li , childNode span
    try{//starting a try block
        const response = await fetch('markUnComplete', {//declaring a variable that is awaiting the response from a fetch function on a 'markUnComplete' route
            method: 'put',//put method for update 
            headers: {'Content-Type': 'application/json'},//specifying the type of the expected content as json
            body: JSON.stringify({//declare the message content being passed and stringify it
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemsFromJS', which we'll send to the server
            })//closing the body
        }) //closing the fetch
        const data = await response.json()//waiting the json from the response to be converted
        console.log(data)//logging the result on the console
        location.reload()//reloading the page to update

    }catch(err){ //if an error occurs, pass the error to catch 
        console.log(err) //log the error
    } //close catch block
} //end of the function