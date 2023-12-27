// Select all elements with the class '.fa-trash' and store them in deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash');

// Select all elements with the class '.item span' and store them in item
const item = document.querySelectorAll('.item span');

// Select all elements with the class '.item span.completed' and store them in itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed');

// For each delete button in deleteBtn, add a click event listener that triggers deleteItem function
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem);
});

// For each item in the item list, add a click event listener that triggers markComplete function
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete);
});

// For each completed item in itemCompleted list, add a click event listener that triggers markUnComplete function
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete);
});

// Define an asynchronous function named deleteItem
async function deleteItem() {
    // Get the text of the item to be deleted from its parent node and store it in itemText
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // Send a DELETE request to 'deleteItem' endpoint with the itemText as JSON payload
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        });
        // Parse response data as JSON
        const data = await response.json();
        console.log(data); // Log the response data
        location.reload(); // Reload the page to reflect changes

    } catch (err) {
        console.log(err); // Log any errors that occur during the process
    }
}

// Define an asynchronous function named markComplete
async function markComplete() {
    // Get the text of the item to be marked as complete from its parent node and store it in itemText
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // Send a PUT request to 'markComplete' endpoint with the itemText as JSON payload
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        });
        // Parse response data as JSON
        const data = await response.json();
        console.log(data); // Log the response data
        location.reload(); // Reload the page to reflect changes

    } catch (err) {
        console.log(err); // Log any errors that occur during the process
    }
}

// Define an asynchronous function named markUnComplete
async function markUnComplete() {
    // Get the text of the completed item to be marked as incomplete from its parent node and store it in itemText
    const itemText = this.parentNode.childNodes[1].innerText;
    try {
        // Send a PUT request to 'markUnComplete' endpoint with the itemText as JSON payload
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        });
        // Parse response data as JSON
        const data = await response.json();
        console.log(data); // Log the response data
        location.reload(); // Reload the page to reflect changes

    } catch (err) {
        console.log(err); // Log any errors that occur during the process
    }
}
