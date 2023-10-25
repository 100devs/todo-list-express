// selects all HTML elements with the class 'fa-trash' and stores them in the 'deleteBtn" variable
const deleteBtn = document.querySelectorAll('.fa-trash')

//all HTML elements with the class of item that contain '<span>' elements are selected and stored inthe 'item' variable.
const item = document.querySelectorAll('.item span')

//selects elemts that meet 2 criterias:
//elements with class "item" and among these 'item' elements, specifically wants those contianing a '<span>' element with the class 'completed' Result is stored in varivble 'itemCompleted'
const itemCompleted = document.querySelectorAll('.item span.completed')

// Array.from() method converts the NodeList stored in the deleteBtn variable into a JavaScript array. After converting the NodeList into an array, the forEach method is called on the array. Attaching a click event listener to each element in the deleteBtn array. When any of these elements is clicked, it will call the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Similar to the previous line, this code attaches a click event listener to each element in the item array, calling the markComplete function when clicked.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//attaches a click event listener to wach element in the 'itemCompleted' array calling the 'markCompleted' function when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// 'deleteItem' function is executed when an element with the 'fa-trash' class is clicked. A async request is sent to a server to delete an item and upon success, reloads the pade
async function deleteItem(){
    //retrieves text content of the second child node of the parent node of the current element and stores it in the variable itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block, used for error handling. code inside 'try'block is executed, and if an error occurs,it can be caught and handled by the 'catch' block
    try{
        //The await keyword is used because fetch returns a promise, and it makes the code wait until the promise is resolved. The response from the server will be stored in the response variable.
        const response = await fetch('deleteItem', {
            // specifies that a DELETE request should be sent to the server.
            method: 'delete',
            // sets the request headers to indicate that the request's body is in JSON format. This is important when sending data to the server because it tells the server how to interpret the data.
            headers: {'Content-Type': 'application/json'},
            // This is the data being sent in the request body. It's converted to a JSON string using JSON.stringify. In this case, it's an object with a property 'itemFromJS' containing the value of itemText.
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //the response from the server is parsed as JSON, and the resulting data is stored in the data variable.
        const data = await response.json()
        //The received data is logged to the console, allowing you to see the response from the server
        console.log(data)
        //This line forces the browser to reload the current page. This might be used to reflect changes made on the server, such as deleting an item.
        location.reload()
    //marks the beginning of the catch block. Any errors are logged to the console for debugging and error tracking. 
    }catch(err){
        console.log(err)
    }
}
//defines an asynchronous function called markComplete
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //a network request is initiated using the fetch function. It sends a PUT request to the 'markComplete' URL. The await keyword is used because fetch returns a promise, and it makes the code wait until the promise is resolved. The response from the server will be stored in the response variable.
        const response = await fetch('markComplete', {
            //This option specifies that a PUT request should be sent to the server. PUT requests are often used to update or modify existing resources on the server.
            method: 'put',
            //Headers provide additional information about the request, such as the content type. In this case, it specifies that the request body will be in JSON format, and the content type is set to 'application/json.' This is important because it tells the server that it should expect JSON data in the request body.
            headers: {'Content-Type': 'application/json'},
            //sending a JSON object with a single property 'itemFromJS' containing the itemText variable. This JSON data will be sent to the server as part of the 'PUT' request. The server will then use this data to identify and mark the corresponding item as complete.
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //waits for the response from the server and then parses it as JSON. The response data is stored in the data variable.
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//handles marking an item as uncompleted
async function markUnComplete(){
    // extract the text content of the second child node of the current element.
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //sends a 'PUT' request to the 'markUnComplete' endpoint using the fetch API
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}