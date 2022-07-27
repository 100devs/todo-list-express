const deleteBtn = document.querySelectorAll(".fa-trash") // creates a variable containing everything with the .fa-trash class applied to it
const item = document.querySelectorAll(".item span") // creates a variable for all spans within the .item class
const itemCompleted = document.querySelectorAll(".item span.completed") // creates a variable for the spans that belong to the .completed class within the .item class

Array.from(deleteBtn).forEach(element => {
    // loops through all delete button elements
    element.addEventListener("click", deleteItem) // adds smurfs to listen for clicks and run deleteItem function
})

Array.from(item).forEach(element => {
    // loops through all item span elements
    element.addEventListener("click", markComplete) // adds smurfs to listen for clicks and run markComplete function
})

Array.from(itemCompleted).forEach(element => {
    // loops through all item spans that are complete
    element.addEventListener("click", markUnComplete) // adds smurfs to listen for clicks and run markUnComplete function
})

async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText //assigns the todo to the itemText variable dynamically
    try {
        //try block if promise is fulfilled
        const response = await fetch("deleteItem", {
            //uses FETCH API to delete todos
            method: "delete", //sets the method type to delete
            headers: { "Content-Type": "application/json" }, //tells server that JSON data will be sent over
            body: JSON.stringify({
                itemFromJS: itemText, //converts todo item into JSON to send to the server
            }),
        })
        const data = await response.json() // awaits the resolution of response.json(), then assigns the result to const data
        console.log(data) //console logs the json response
        location.reload() // refreshes the page
    } catch (err) {
        // catches any errors
        console.log(err) // console logs the error
    }
}

async function markComplete() {
    // allows for async/await syntax inside of markComplete() function
    const itemText = this.parentNode.childNodes[1].innerText //assigns the todo to the itemText variable dynamically
    try {
        // try block for if the promise is fulfilled
        const response = await fetch("markComplete", {
            //uses Fetch API to update task to completed
            method: "put", // sets the method to put
            headers: { "Content-Type": "application/json" }, //tells server that JSON data will be sent over
            body: JSON.stringify({
                itemFromJS: itemText, //converts data into JSON-string to be readable to the server
            }),
        })
        const data = await response.json() // awaits the resolution of response.json(), then assigns the result to const data
        console.log(data) // console logs the data variable
        location.reload() // refreshes the page
    } catch (err) {
        // catches any errors
        console.log(err) // console logs the error
    }
}

async function markUnComplete() {
    // async function to mark a task an not complete
    const itemText = this.parentNode.childNodes[1].innerText //assigns the todo to the itemText variable dynamically
    try {
        // try block for if the promise is fulfilled
        const response = await fetch("markUnComplete", {
            //uses Fetch API to update task to incomplete
            method: "put", //sets method to put
            headers: { "Content-Type": "application/json" }, //tells server that JSON data will be sent over
            body: JSON.stringify({
                itemFromJS: itemText, //converts todo item into JSON-string to send to the server
            }),
        })
        const data = await response.json() // await the response data in json format and save it to the variable data
        console.log(data) // console log the data variable
        location.reload() // refreshes the page
    } catch (err) {
        // catch block for if the promise is rejected
        console.log(err) // console log the error
    }
}
