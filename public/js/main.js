const deleteBtn = document.querySelectorAll('.fa-trash') // create variable which select all the elements with class fa-trash
const item = document.querySelectorAll('.item span') // create variable which select all the spans with parents with class item
const itemCompleted = document.querySelectorAll('.item span.completed')  // create variable which select all the spans with class completed that have parents with class item

// add an event listener for all the elements from deleteBtn
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// add an event listener for all the elements from item
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// add an event listener for all the elements from itemCompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// create a function
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText 
    try{
        const response = await fetch('deleteItem', { // create a request from 'deleteItem' using:
            method: 'delete', // the method delete
            headers: {'Content-Type': 'application/json'}, // tell to parse the result as JSON
            body: JSON.stringify({
              'itemFromJS': itemText // convert JS object to JSON
            })
          })
        const data = await response.json() // returns a promise resolved to a JSON object
        console.log(data)
        location.reload() // after the response refresh the page
    // show if we have errors
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', { // create a request from 'markComplete' using:
            method: 'put', // update method
            headers: {'Content-Type': 'application/json'}, // tell to parse the result as JSON
            body: JSON.stringify({ 
                'itemFromJS': itemText // convert JS object to JSON
            })
          })
        const data = await response.json() // returns a promise resolved to a JSON object
        console.log(data)
        location.reload() // after the response refresh the page

    // show if we have errors
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {  // create a request from 'markUnComplete' using:
            method: 'put', // update method
            headers: {'Content-Type': 'application/json'}, // tell to parse the result as JSON
            body: JSON.stringify({
                'itemFromJS': itemText // convert JS object to JSON
            })
          })
        const data = await response.json() // returns a promise resolved to a JSON object
        console.log(data)
        location.reload()// after the response refresh the page

    // show if we have errors
    }catch(err){
        console.log(err)
    }
}