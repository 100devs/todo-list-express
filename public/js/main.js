//get all the DOM elements with a class of 'fa-trash' and assign the HTMLCollection to deeleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
//get all the DOM elements with a class of 'span' and assign the HTMLCollection to item
const item = document.querySelectorAll('.item span')
//get all the DOM elements of span with a class of 'item' and assign the HTMLCollection to itemCompleted variable
const itemCompleted = document.querySelectorAll('.item span.completed')

//create an array from the nodelist assigned to deleteBtn looping through it and adding an eventlistener to each element in the array
Array.from(deleteBtn).forEach((element)=>{
    //anytime there is a click on the element, it will run a function called deleteItem
    element.addEventListener('click', deleteItem)
})

//create an array from the nodelist assigned to item looping through it and adding an eventlistener to each element in the array
Array.from(item).forEach((element)=>{
     //anytime there is a click on the element, it will run a function called markComplete
    element.addEventListener('click', markComplete)
})

//create an array from the nodelist assigned to itemCompleted looping through it and adding an eventlistener to each element in the array
Array.from(itemCompleted).forEach((element)=>{
    //anytime there is a click on the element, it will run a function called markUnComplete
    element.addEventListener('click', markUnComplete)
})

//hoisting!! in JS when we write a function, js will see the function name at the top of the document so that it can be accessed anywhere in the script including a function that is written above this function
//Whenever any of the delete buttons are clicked, this function will run
async function deleteItem(){
    //this refers to the span that the eventlistener was attached to, then the parentNode will be the li because it is the parent of the span. then it looks at ALL of the child nodes of that li (span complete and span uncompleted and span of the trashcan)
    //we then make it the variable of itemText
    //get the innerText of the span
    const itemText = this.parentNode.childNodes[1].innerText
    //start the response
    try{
         //make a fetch to the url of deleteItem
        const response = await fetch('deleteItem', {
            //ensure that the function knows this is a put request
            method: 'delete',
            //tell that it is an application that is going to be json
            headers: {'Content-Type': 'application/json'},
            //tells that the body of the item to be deleted will be json and needs to be turned into a string
            body: JSON.stringify({
                //the json body will be 'itemFromJS' and the content will be from the parent childnoes innertext from the variable itemText above
              'itemFromJS': itemText
            })
          })
          //wait for the response from the database and assign it to the variable data when response is received
        const data = await response.json()
        //console log the response after the promis has been fullfilled
        console.log(data)
        //reload the webpage once the action has been complete so that the user can see that the delete has been processed
        location.reload()
          //if there are any errors, catch them
    }catch(err){
        // if there are errors this will display them in the console
        console.log(err)
    }
}

//create an async function called makComplete
async function markComplete(){
    //this refers to the span that the eventlistener was attached to, then the parentNode will be the li because it is the parent of the span. then it looks at ALL of the child nodes of that li (span complete and span uncompleted and span of the trashcan)
    //we then make it the variable of itemText
    //get the innerText of the span
    const itemText = this.parentNode.childNodes[1].innerText
    //start the response 
    try{
        //make a fetch to the url of markComplete
        const response = await fetch('markComplete', {
            //ensure that the function knows this is a put request
            method: 'put',
            //tell that it is an application that is going to be json
            headers: {'Content-Type': 'application/json'},
            //send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
            body: JSON.stringify({
                //the object that will be stringified will be 'itemFromJS'
                'itemFromJS': itemText
            })
          })
          //attempt to load and parse the reponse body as JSON, assigning it to data
        const data = await response.json()
        //display json response in the console
        console.log(data)
        //reload the webpage
        location.reload()
          //catch any error if there are any
    }catch(err){
        //if there is an arrer, console.log them
        console.log(err)
    }
}

//create an async function called makUnComplete
async function markUnComplete(){
    //assign the variable 'itemText' to the inner text of the span in the ejs. the event listener is attached to this. 
    const itemText = this.parentNode.childNodes[1].innerText
    //start the response 
    try{
        //Make a fetch to the url of markUnComplete
        const response = await fetch('markUnComplete', {
            //ensure that the function knows this is a put request
            method: 'put',
            //tells us that the app is going to recieve json 
            headers: {'Content-Type': 'application/json'},
            //send the object with the property of 'itemFromJS' and ensure that it is a string
            body: JSON.stringify({
                //the item will be the inner text from the parent child node of the submited form from the variable created above
                'itemFromJS': itemText
            })
          })
          //load and parse the response body as JSON, and assign it to the variable of data
        const data = await response.json()
        //display the json response in the console
        console.log(data)
        //reload the webpage to show the user that the information has been changed
        location.reload()
          //catch any error if there is one
    }catch(err){
        //display that error message in the console
        console.log(err)
    }
}