const deleteBtn = document.querySelectorAll('.fa-trash') // assigns the fa trash icon to a variable named deleteBtn
const item = document.querySelectorAll('.item span') // assigns spans with the item class to a variable named item
const itemCompleted = document.querySelectorAll('.item span.completed') // assigns spans with the item class and completed class to a variable named itemCompleted

Array.from(deleteBtn).forEach((element)=>{ // creates an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // when the trash icon is clicked, we run the deleteItem function
})

Array.from(item).forEach((element)=>{ // creates an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // when the task is clicked, we run the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // creates an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // when the completed task is clicked, we run the markUnComplete function
})

async function deleteItem(){ // declares an async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract only the text value
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // creates a variable that waits on a fetch to retrieve data and assigns it to response
            method: 'delete', // sets CRUD method to delete
            headers: {'Content-Type': 'application/json'}, // expecting JSON data
            body: JSON.stringify({ // turns the JSON data into a string
              'itemFromJS': itemText // setting content of the body to the innerText of the list item and naming it 'itemFromJS'
            }) // close body
          }) // clsoe object
        const data = await response.json() // wait for JSON response from the fetch
        console.log(data) // log data
        location.reload() // refresh page

    }catch(err){ // catch if the response is an error
        console.log(err) // logs the error
    } // close catch
} // close aysnc function

async function markComplete(){ // declares an async function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract only the text
    try{ // start a try block to do something
        const response = await fetch('markComplete', { // creates a variable that waits on a fetch to retrieve data and assigns it to response
            method: 'put', // sets CRUD method to put (update)
            headers: {'Content-Type': 'application/json'}, // expecting JSON data
            body: JSON.stringify({ // stringift JSON data
                'itemFromJS': itemText // setting content of the body to the innerText of the list item and naming it
            }) // close body
          }) // close object
        const data = await response.json() // wait for JSON response from the fetch
        console.log(data) // log data
        location.reload() // refresh page

    }catch(err){ // catch if the response is an error
        console.log(err) // logs the error
    } // close catch
} // close aysnc function

async function markUnComplete(){ // declares an async function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract only the text
    try{ // start a try block to do something
        const response = await fetch('markUnComplete', { // creates a variable that waits on a fetch to retrieve data and assigns it to response
            method: 'put', // sets CRUD method to put (update)
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // wait for JSON response from the fetch
        console.log(data) // log data
        location.reload() // refresh page

    }catch(err){ // catch if the response is an error
        console.log(err) // logs the error
    } // close catch
} // close aysnc function
