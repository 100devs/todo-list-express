const deleteBtn = document.querySelectorAll(".fa-trash"); // this creates a variable deleteBtn and selecting all of the elements with the class of .fa-trash
const item = document.querySelectorAll(".item span"); // this creates a variable item and selecting all of the elements with the span tag inside of the parent element class of .item
const itemCompleted = document.querySelectorAll(".item span.completed"); // this creates a variable itemCompleted and selection all of the elements with the span tag with the class of .completed inside of a parent element class of .item

Array.from(deleteBtn).forEach((element) => {
    // creating an Array from our deleteBtn selection and starting a loop
    element.addEventListener("click", deleteItem); // add an event listener to the current item that waits for a click and then calls the function deleteItem
}); // close our loop

Array.from(item).forEach((element) => {
    // creating an Array from our deleteBtn selection and starting a loop
    element.addEventListener("click", markComplete); // add an event listener to the current item that waits for a click and then calls the function mark Complete
}); // close our loop

Array.from(itemCompleted).forEach((element) => {
    // creating an Array from our deleteBtn selection and starting a loop
    element.addEventListener("click", markUnComplete); // add an event listener to only Completed items waits for a click and then calls the function markUnComplete
}); // close our loop

async function deleteItem() {
    // Async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText; // looks inside of the list iem and grabs only the inner text within the list span
    try {
        // starting a try block to do something
        const response = await fetch("deleteItem", {
            // creates a response variable that waits on a fetch to get data from the results of the deleteItem route
            method: "delete", // sets the CRUD method to delete for the route
            headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
            body: JSON.stringify({
                // declare the message content being passed, and stringify that content
                itemFromJS: itemText, //setting the content of the body to the inner text of the list item, and naming it itemFromJS
            }), // closing the body tag
        }); // closing the object inside of the fetch
        const data = await response.json(); // waiting on the JSON from the response to be converted
        console.log(data); // log the result to the console
        location.reload(); // reload the page to update what is displayed
    } catch (err) {
        // starting a catch block , so that if an error occurs , pass in the error to the block
        console.log(err); // log said error
    } // close the catch block
} // end of the function

async function markComplete() {
    // declare an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText; // looks inside of the list itme and grabs only the inner text within the list span.
    try {
        // starting a try block to do something
        const response = await fetch("markComplete", {
            // creates a response variable that waits on a fetch to get data from the results of the markComplete route
            method: "put", // sets the CRUD method to update for the route
            headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
            body: JSON.stringify({
                // declare the message content being passed, and stringify that content
                itemFromJS: itemText, //setting the content of the body to the inner text of the list item, and naming it itemFromJS
            }), // closing the body tag
        }); // closing the object inside of the fetch
        const data = await response.json(); // waiting on the JSON from the response to be converted
        console.log(data); // log the result to the console
        location.reload(); // reload the page to update what is displayed
    } catch (err) {
        // starting a catch block , so that if an error occurs , pass in the error to the block
        console.log(err); // log said error
    } // close the catch block
} // end of the function

async function markUnComplete() {
    // declare an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText; // looks inside of the list itme and grabs only the inner text within the list span.
    try {
        // starting a try block to do something
        const response = await fetch("markUnComplete", {
            // creates a response variable that waits on a fetch to get data from the results of the markUnComplete route
            method: "put", // sets the CRUD method to update for the route
            headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is JSON
            body: JSON.stringify({
                // declare the message content being passed, and stringify that content
                itemFromJS: itemText, //setting the content of the body to the inner text of the list item, and naming it itemFromJS
            }), // closing the body tag
        }); // closing the object inside of the fetch
        const data = await response.json(); // waiting on the JSON from the response to be converted
        console.log(data); // log the result to the console
        location.reload(); // reload the page to update what is displayed
    } catch (err) {
        // starting a catch block , so that if an error occurs , pass in the error to the block
        console.log(err); // log said error
    } // close the catch block
} // end of the function
