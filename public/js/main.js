// create a "nodelist" of every item with these classes (trash icon)
const deleteBtn = document.querySelectorAll(".fa-trash");
// create a "nodelist" of every item with these classes (item span)
const item = document.querySelectorAll(".item span");
// create a "nodelist" of every item with these classes (item, completed)
const itemCompleted = document.querySelectorAll(".item span.completed");

// create an array from these node lists, and add event listeners to each one
Array.from(deleteBtn).forEach((element) => {
    // run the deleteItem function when we click on the item
    element.addEventListener("click", deleteItem);
});

Array.from(item).forEach((element) => {
    // run the markComplete function when we click on the item
    element.addEventListener("click", markComplete);
});

Array.from(itemCompleted).forEach((element) => {
    // run the markUnComplete function when we click on the item
    element.addEventListener("click", markUnComplete);
});

// delete item function
async function deleteItem() {
    // from the trash icon, go up to the parent node (the <li>)
    // then go to the second child node (index 0), and grab the innerText
    // essentially - save the todo item text in a variable
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // make a fetch request to the deleteItem route
        const response = await fetch("deleteItem", {
            // DELETE method
            method: "delete",
            // set the headers to json
            headers: { "Content-Type": "application/json" },
            // in the body of the text
            body: JSON.stringify({
                // send the text of the todo
                itemFromJS: itemText,
            }),
        });
        // wait for the response
        const data = await response.json();
        // log the data
        console.log(data);
        // reload the current URL
        location.reload();
    } catch (err) {
        // otherwise log the error
        console.log(err);
    }
}

// mark complete function
async function markComplete() {
    // grab the text from the todo
    const itemText = this.parentNode.childNodes[1].innerText;
    // make a fetch reqeust to the mark complete route
    try {
        const response = await fetch("markComplete", {
            // PUT request
            method: "put",
            // json data
            headers: { "Content-Type": "application/json" },
            // convert the objects to string
            body: JSON.stringify({
                // send the todo text
                itemFromJS: itemText,
            }),
        });
        // wait for the response
        const data = await response.json();
        // log the data
        console.log(data);
        // reload the current route
        location.reload();
    } catch (err) {
        // log the error
        console.log(err);
    }
}

// marking an item as uncomplete
async function markUnComplete() {
    // grab the todo text
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // fetch request to the mark uncomplete route
        const response = await fetch("markUnComplete", {
            // PUT request
            method: "put",
            // json data is set
            headers: { "Content-Type": "application/json" },
            // stringify the object
            body: JSON.stringify({
                // send the todo text in the body of the request
                itemFromJS: itemText,
            }),
        });
        // wait for the response
        const data = await response.json();
        // log the data
        console.log(data);
        // reload the page
        location.reload();
    } catch (err) {
        // log the error if there is one
        console.log(err);
    }
}
