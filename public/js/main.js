// Declare variables:
const deleteBtn = document.querySelectorAll('.fa-trash');
const item = document.querySelectorAll('.item span');
const itemCompleted = document.querySelectorAll('.item span.completed');


/*
========== ========== ==========
Event Listeners
========== ========== ==========
*/
// Set event listeners to all of the buttons with the class ".fa-trash"
Array.from(deleteBtn).forEach( (element) => {
    element.addEventListener('click', deleteItem);
})

// Set event listeners to all of the elements with the class ".item span"
Array.from(item).forEach( (element) => {
    element.addEventListener('click', markComplete);
})

// Set event listeners to all of the elements with the class ".item span.completed"
Array.from(itemCompleted).forEach( (element) => {
    element.addEventListener('click', markUnComplete);
})


/*
========== ========== ==========
Functions
========== ========== ==========
*/
async function deleteItem() {
    // get the innerText of element that we want to delete
    const itemText = this.parentNode.childNodes[1].innerText;
    
    try {
        const response = await fetch('deleteItem', {
            // DELETE request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            
            // convert data into JSON object
            body: JSON.stringify({
                // bind the variables "itemText" to "itemFromJS"
                'itemFromJS': itemText
            })
        })
        
        // wait for the promise to resolve, log the result, and then refresh the page at that location.
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        // log any errors if they occur
        console.log(err)
    }
}


async function markComplete() {
    // get the innerText of element that we want to update and mark as Complete
    const itemText = this.parentNode.childNodes[1].innerText;
    
    try {
        const response = await fetch('markComplete', {
            // PUT request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            
            // convert data into JSON object
            body: JSON.stringify({
                // bind the variables "itemText" to "itemFromJS"
                'itemFromJS': itemText
            })
        })

        // wait for the promise to resolve, log the result, and then refresh the page at that location.
        const data = await response.json();
        console.log(data);
        location.reload();

    } catch (err) {
        // log any errors if they occur
        console.log(err)
    }
}


async function markUnComplete() {
    // get the innerText of element that we want to update and mark as UNComplete
    const itemText = this.parentNode.childNodes[1].innerText;
    
    try {
        const response = await fetch('markUnComplete', {
            // another PUT request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
        
            // convert data into JSON object
            body: JSON.stringify({
                // bind the variables "itemText" to "itemFromJS"
                'itemFromJS': itemText
            })
        })

        // wait for the promise to resolve, log the result, and then refresh the page at that location.
        const data = await response.json();
        console.log(data);
        location.reload();

    } catch (err) {
        // log any errors if they occur
        console.log(err)
    }
}
