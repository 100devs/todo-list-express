const deleteBtn = document.querySelectorAll(".fa-trash"); //storing all elements of trash icons in a node list
const item = document.querySelectorAll(".item span"); //stores all span elements within .item inside node list
const itemCompleted = document.querySelectorAll(".item span.completed"); // stores all span elements with class completed under the .item class into a node list

//convert to Array from nodelist and add smurfs/event listeners to each element. on click - calls deleteItem function
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener("click", deleteItem);
});

//convert to Array from nodeList and add smurfs/eventlisteners to each element. on click - calls markComplete function
Array.from(item).forEach((element) => {
    element.addEventListener("click", markComplete);
});

//convert to Array from nodeList and add smurfs/eventlisteners to each element. on click - calls markUnComplete function
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener("click", markUnComplete);
});

//async function that deletes the todo item associated with the delete icon we clicked
async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText; //define variable with the text of the todo item
    try {
        //sending a delete fetch req to the server with following parameters
        const response = await fetch("deleteItem", {
            method: "delete", //defining the method
            headers: { "Content-Type": "application/json" }, //setting the headers
            body: JSON.stringify({
                //stringifying it for consumption by server.js. key value pair is used for matching
                itemFromJS: itemText,
            }),
        });
        const data = await response.json(); //awaiting response and storing that into data variable
        console.log(data); //logging the data
        location.reload(); //page reload
    } catch (err) {
        //error handling
        console.log(err);
    }
}

//* async function that marks a todo item complete
async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText; //storing innerText of li's item within itemText
    try {
        // sending a put fetch req to the server to mark complete
        const response = await fetch("markComplete", {
            method: "put", //setting up action (PUT)
            headers: { "Content-Type": "application/json" }, //setting up headers
            body: JSON.stringify({
                //json stringify - will use this to match on server.js
                itemFromJS: itemText,
            }),
        });
        const data = await response.json(); //awaiting response and storing that into data variable
        console.log(data); //logging said data
        location.reload(); //reload the page
    } catch (err) {
        console.log(err); //error handling
    }
}

//* async function that marks a todo item uncomplete
async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText; //storing innerText of li's item within itemText
    try {
        // sending a put fetch req to the server to mark complete
        const response = await fetch("markUnComplete", {
            method: "put", //setting up action (PUT)
            headers: { "Content-Type": "application/json" }, //setting up headers
            body: JSON.stringify({
                itemFromJS: itemText,
            }),
        });
        const data = await response.json(); //awaiting response and storing data variable
        console.log(data); //logging data
        location.reload(); //reload
    } catch (err) {
        console.log(err); //error handling
    }
}
