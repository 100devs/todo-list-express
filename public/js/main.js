// Selecting all delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash');
// Selecting all todo items
const item = document.querySelectorAll('.item span');
// Selecting all completed todo items
const itemCompleted = document.querySelectorAll('.item span.completed');

// Adding event listener to each delete button
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem);
});

// Adding event listener to each todo item
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete);
});

// Adding event listener to each completed todo item
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete);
});

// Function to handle deletion of a todo item
async function deleteItem() {
    // Extracting text of the todo item to be deleted
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // Sending DELETE request to server to delete the todo item
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        });
        // Parsing the response data
        const data = await response.json();
        console.log(data);
        // Reloading the page after deletion
        location.reload();
    } catch (err) {
        console.log(err);
    }
}

// Function to handle marking a todo item as complete
async function markComplete() {
    // Extracting text of the todo item to be marked as complete
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // Sending PUT request to server to mark the todo item as complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        });
        // Parsing the response data
        const data = await response.json();
        console.log(data);
        // Reloading the page after marking as complete
        location.reload();
    } catch (err) {
        console.log(err);
    }
}

// Function to handle marking a todo item as incomplete
async function markUnComplete() {
    // Extracting text of the todo item to be marked as incomplete
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // Sending PUT request to server to mark the todo item as incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        });
        // Parsing the response data
        const data = await response.json();
        console.log(data);
        // Reloading the page after marking as incomplete
        location.reload();
    } catch (err) {
        console.log(err);
    }
}
