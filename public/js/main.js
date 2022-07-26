const deleteBtn = document.querySelectorAll('.fa-trash'); // Select all classes matching fa-trash
const item = document.querySelectorAll('.item span'); // Select all classes matching .item span
const itemCompleted = document.querySelectorAll('.item span.completed'); // Select all classes matching string

// Create array from nodes matching deleteBtn
Array.from(deleteBtn).forEach((element) => {
    // For each add click event listener to run function deleteItem
    element.addEventListener('click', deleteItem);
});

// Create array from nodes matching item
Array.from(item).forEach((element) => {
    // For each add click event listener to run function markComplete
    element.addEventListener('click', markComplete);
});

// Create array from nodes matching itemCompleted
Array.from(itemCompleted).forEach((element) => {
    // For each add click event listener to mark incomplete
    element.addEventListener('click', markUnComplete);
});

// declare async function deleteItem
async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText; //declare itemText and assign todo text to it
    // Try to send request to delete item
    try {
        // Declare response and await response from deleteItem route
        const response = await fetch('deleteItem', {
            method: 'delete', // request method
            headers: { 'Content-Type': 'application/json' }, // set headers
            body: JSON.stringify({
                'itemFromJS': itemText // set body key itemFromJS equal to itemText
            })
        });
        const data = await response.json(); // Declare data variable and assign response in JSON format
        console.log(data); // Console log data
        location.reload(); // Reload page

    } catch (err) {
        // Catch any errors
        console.log(err);
    }
}

// Declare async function markComplete
async function markComplete() {
    const itemText = this.parentNode.childNodes[1].innerText; // Declare variable itemText and assign todo text
    try {
        // try to mark item complete
        const response = await fetch('markComplete', { // Fetch markComplete route
            method: 'put', // use PUT method
            headers: { 'Content-Type': 'application/json' }, //JSON content-type
            body: JSON.stringify({
                'itemFromJS': itemText // Set key itemFromJS equal to itemText
            })
        });
        const data = await response.json(); // Declare data variable and assign json from response
        console.log(data); // Console log data
        location.reload(); // Reload page

    } catch (err) {
        console.log(err); // catch any errors
    }
}

// Declare async function markUnComplete 
async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText; // Declare variable itemText and set equal to todo text
    try {
        const response = await fetch('markUnComplete', { // Fetch request to markUnComplete route
            method: 'put', // PUT method
            headers: { 'Content-Type': 'application/json' }, //JSON content-type
            body: JSON.stringify({
                'itemFromJS': itemText //send object with itemFromJS key set to itemTExt
            })
        });
        const data = await response.json(); //Declare variable data and assign response in JSON format
        console.log(data); // Console log data
        location.reload(); // Reload page

    } catch (err) {
        console.log(err); // Console log error
    }
}