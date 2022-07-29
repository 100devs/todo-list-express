const deleteBtn = document.querySelectorAll('.fa-trash') //creates an array containing all the values with .fa-trash as the class
//and assigns it to the deleteBtn variable
const item = document.querySelectorAll('.item span')//creates an array containing all the span tags within the .item class and assigns
//it to a variable item
const itemCompleted = document.querySelectorAll('.item span.completed') //creates an array containing all the span tags with a class
//of completed that is also inside an item class

Array.from(deleteBtn).forEach((element)=>{ //this creates an array from deletebtn variable and invokes the forEach method. 
    //for each element, place an event listener of click and invoke the deleteitem function on it
    element.addEventListener('click', deleteItem)
}) //close function

Array.from(item).forEach((element)=>{//this creates an array from the item variable and invokes the forEach method. 
    //for each element, place an event listener of click and invoke the markComplete function on it
    element.addEventListener('click', markComplete)
}) //close function

Array.from(itemCompleted).forEach((element)=>{ //this creates an array from itemCompleted variable and invokes the forEach method. 
    //for each element, place an event listener of click and invoke the markUnComplete function on it
    element.addEventListener('click', markUnComplete)
}) //close function

async function deleteItem(){ //declaring an async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //This is getting the innerText of the second child node
    try{ //declares a try block
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result
            //delete item
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and turning it into a string
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemfromjs'
            }) //closing our JSON.stringify function
          }) //closing our await function
        const data = await response.json() //assigning the response to data and turning that response into JSON
        console.log(data) //console log the data
        location.reload() //refreshes the webpage

    }catch(err){ //if there is an error and the try fails, the code will run this
        console.log(err) //console log the error
    } //closing the try catch 
} //closing the async function

async function markComplete(){ //declaring an async function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //This is getting the innerText of the second child node
    try{ //declares a try block
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result
            //MarkComplete
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({  //declare the message content being passed and turning it into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemfromjs'
            }) //closing our JSON.stringify function
          }) //closing our await function
        const data = await response.json() //assigning the response to data and turning that response into JSON
        console.log(data) //console log the data
        location.reload() //refreshes the webpage

 
    }catch(err){ //if there is an error and the try fails, the code will run this
        console.log(err) //console log the error
    } //closing the try catch 
} //closing the async function

async function markUnComplete(){ //declaring an async function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //This is getting the innerText of the second child node
    try{ //declares a try block
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result
            //markUnComplete
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and turning it into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemfromjs'
            }) //closing our JSON.stringify function
          }) //closing our await function
        const data = await response.json() //assigning the response to data and turning that response into JSON
        console.log(data) //console log the data
        location.reload() //refreshes the webpage


    }catch(err){ //if there is an error and the try fails, the code will run this
        console.log(err) //console log the error
    } //closing the try catch 
} //closing the async function