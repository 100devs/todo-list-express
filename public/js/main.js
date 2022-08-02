//This declares the variable deleteBtn and initializes the variable to a collection of nodes that have a class of 'fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
//This declares the variable item and initializes the variable to a collection of nodes that have a class of 'item' and are span elements (the querySelectorAll method takes a selectors string as an argument representing all the selectors the nodes wiwthin the resulting list should have)
const item = document.querySelectorAll('.item span')
//This declares the variable itemCompleted and initializes the variable to a collection of nodes that have a class of 'item' and are span elements that also have a class of "completed"
const itemCompleted = document.querySelectorAll('.item span.completed')
//This creates an array from the deletedBtn NodeList and uses the Array.prototype.forEach method to iterate through each node within the array and add a click event listener that on click, fires off the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//This creates an array from the item NodeList and uses the Array.prototype.forEach method to iterate through each node within the array and add a click event listener that on click, fires off the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//This creates an array from the itemCompleted NodeList and uses the Array.prototype.forEach method to iterate through each node within the array and add a click event listener that on click, fires off the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//By declaring async, we are able to write the asycnhronous code and make is appear synchronous
//This is syntanctical sugar
async function deleteItem(){
    //This declares a variable with the name of itemText and initializes it to the inner text of the parent node of the object that this function was called on's second element within the childNodes list belonging to it
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //This declares a variable, response, and stores the result of making a DELETE request to the deleteItem endpoint
        const response = await fetch('deleteItem', {
            //This specifies the HTTP method we're making the request to (DELETE)
            method: 'delete',
            //This specifies that the information we are sending within the body of this request is JSON data
            headers: {'Content-Type': 'application/json'},
            //This converts a object with a property of 'itemFromJS' and a value of the value bound to a JSON string and send it within the body property of the request we're making
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //This declares a variable, data, and stores the response parsed from JSON within this data variable
        const data = await response.json()
        //This logs the value bound to the data variable to the console
        console.log(data)
        //The Location interface represents the location (URL) of the object it is linked to
        //Calling the reload method of the location global object reloads the currentURL, like a refresh button
        location.reload()

    }catch(err){
        //If an error occurs within any portion of the above code, this error is logged to the console
        console.log(err)
    }
}
//By declaring async, we are able to write the asycnhronous code and make is appear synchronous
//This is syntanctical sugar
async function markComplete(){
    //This declares a variable with the name of itemText and initializes it to the inner text of the parent node of the object that this function was called on's second element within the childNodes list belonging to it
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //This declares a variable, response, and stores the result of making a request to the markComplete endpoint
        const response = await fetch('markComplete', {
            //This specifies the HTTP method we're making the request to (PUT = UPDATE)
            method: 'put',
            //This specifies that the information we are sending within the body of this request is JSON data
            headers: {'Content-Type': 'application/json'},
            //This converts a object with a property of 'itemFromJS' and a value of the value bound to a JSON string and send it within the body property of the request we're making
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //This declares a variable, data, and stores the response parsed from JSON within this data variable
        const data = await response.json()
        //This logs the value bound to the data variable to the console
        console.log(data)
        //The Location interface represents the location (URL) of the object it is linked to
        //Calling the reload method of the location global object reloads the currentURL, like a refresh button
        location.reload()

    }catch(err){
        //If an error occurs within any portion of the above code, this error is logged to the console
        console.log(err)
    }
}
//By declaring async, we are able to write the asycnhronous code and make is appear synchronous
//This is syntanctical sugar
async function markUnComplete(){
    //This declares a variable with the name of itemText and initializes it to the inner text of the parent node of the object that this function was called on's second element within the childNodes list belonging to it
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //This declares a variable, response, and stores the result of making a request to the markUnComplete endpoint
        const response = await fetch('markUnComplete', {
            //This specifies the HTTP method we're making the request to (PUT = UPDATE)
            method: 'put',
            //This specifies that the information we are sending within the body of this request is JSON data
            headers: {'Content-Type': 'application/json'},
            //This converts a object with a property of 'itemFromJS' and a value of the value bound to a JSON string and send it within the body property of the request we're making
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //This declares a variable, data, and stores the response parsed from JSON within this data variable
        const data = await response.json()
        //This logs the value bound to the data variable to the console
        console.log(data)
        //The Location interface represents the location (URL) of the object it is linked to
        //Calling the reload method of the location global object reloads the currentURL, like a refresh button
        location.reload()

    }catch(err){
        //If an error occurs within any portion of the above code, this error is logged to the console
        console.log(err)
    }
}