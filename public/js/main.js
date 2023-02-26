// The querySelectorAll() method returns a static nodelist representing a list of span elements with the class fa-trash.
const deleteBtn = document.querySelectorAll('.fa-trash')
// The querySelectorAll() method returns a static nodelist representing a list of span elements with the class fa-check.
const item = document.querySelectorAll('.fa-check')
// The querySelectorAll() method returns a static nodelist representing a list of span elements with the class fa-wrench.
const itemCompleted = document.querySelectorAll('.fa-wrench')

// The Array.from() static method creates a new, shallow-copied Array instance from all the span elements with the class .fa-trash.
Array.from(deleteBtn).forEach((element)=>{
    // Every span element with the class fa-trash has an eventlistener that runs the deleteItem function when it is clicked.
    element.addEventListener('click', deleteItem)
})

// The Array.from() static method creates a new, shallow-copied Array instance from all the span elements with the class .fa-trash.
Array.from(item).forEach((element)=>{
    // Every span element with the class fa-check has an eventlistener that runs the markComplete function when it is clicked.
    element.addEventListener('click', markComplete)
})

// The Array.from() static method creates a new, shallow-copied Array instance from all the span elements with the class .fa-wrench.
Array.from(itemCompleted).forEach((element)=>{
    // Every span element with the class fa-wrench has an eventlistener that runs the markUnComplete function when it is clicked.
    element.addEventListener('click', markUnComplete)
})

// An asyncronous function invoked by a click 
async function deleteItem(){
    /* this represents the span element with the eventlistener
    // this.parentNode represents the listed item element containing the span element
    // this.parentNode.childNodes represents a nodeList of everything within the listed item element
    // this.parentNode.childNodes[i] represents a specific node from the nodeList
    // this.parentNode.childNodes[i].innerText is the text within the span element. It represents request.body.itemFromJS */
    const itemText = this.parentNode.childNodes[5].innerText
    // A try...catch statement, the code in the try block is executed first
    try{
        /* The await operator is used to wait for a Promise and get its fulfillment value. 
        The fetch-api sends a request to the /deleteItem route telling the server.js API to delete a document from its collection,
        the fetch-api passes a JSON object containing a property of itemFromJS & a value which is a variable that represents text within the span element.
        The server.js API compares this argument to the thing property & value within a document. */
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // server.js matches the document, runs the code within the server.js API & then says everything is OK, it responds with "Todo Deleted".
        const data = await response.json()
        console.log(data)
        // Reloads the page after the document is deleted.
        location.reload()
    // The catch block is executed if the try block throws an exception.
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    /* this represents the span element with the eventlistener
    // this.parentNode represents the listed item element containing the span element
    // this.parentNode.childNodes represents a nodeList of everything within the listed item element
    // this.parentNode.childNodes[i] represents a specific node from the nodeList
    // this.parentNode.childNodes[i].innerText is the text within the span element. It represents request.body.itemFromJS */
    const itemText = this.parentNode.childNodes[5].innerText
    // A try...catch statement, the code in the try block is executed first.
    try{
        /* The await operator is used to wait for a Promise and get its fulfillment value. 
        The fetch-api sends a request to the /markComplete route telling the server.js API to update a document from its collection,
        the fetch-api passes a JSON object containing a property of itemFromJS & a value which is a variable that represents text within the span element.
        The server.js API compares this argument to the thing property & value within a document. */
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // server.js matches the document, runs the code within the server.js API & then says everything is OK, it responds with "Marked Complete".
        const data = await response.json()
        console.log(data)
        // Reloads the page after the document is updated.
        location.reload()
    // The catch block is executed if the try block throws an exception.
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    /* this represents the span element with the eventlistener
    // this.parentNode represents the listed item element containing the span element
    // this.parentNode.childNodes represents a nodeList of everything within the listed item element
    // this.parentNode.childNodes[i] represents a specific node from the nodeList
    // this.parentNode.childNodes[i].innerText is the text within the span element. It represents request.body.itemFromJS */
    const itemText = this.parentNode.childNodes[5].innerText
    // A try...catch statement, the code in the try block is executed first.
    try{
        /* The await operator is used to wait for a Promise and get its fulfillment value. 
        The fetch-api sends a request to the /markUnComplete route telling the server.js API to update a document from its collection,
        the fetch-api passes a JSON object containing a property of itemFromJS & a value which is a variable that represents text within the span element.
        The server.js API compares this argument to the thing property & value within a document. */
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // server.js matches the document, runs the code within the server.js API & then says everything is OK, it responds with "Marked Uncomplete".
        const data = await response.json()
        console.log(data)
        // Reloads the page after the document is updated.
        location.reload()
    // The catch block is executed if the try block throws an exception.
    }catch(err){
        console.log(err)
    }
}