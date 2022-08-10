// Targeting all DOM elements with the 'fa-trash' class
const deleteBtn = document.querySelectorAll('.fa-trash')

// Targeting all <span> tags where the parent has the class of '.item'
const item = document.querySelectorAll('.item span')

// Targets all <span> tags with the class of 'completed' where the parent has the class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates an array from the querySelectorAll results, loop through all, and add a 'click' event listener that gives the 'deleteItem' function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Creates an array from the querySelectorAll results, loop through all, and add a 'click' event listener that gives the 'markComplete' function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Creates an array from the querySelectorAll results, loop through all, and add a 'click' event listener that gives the 'markUncomplete' function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


async function deleteItem(){
    // Traverses the dom up to the parent (li) and gets the text inside of the first <span> element 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a DELETE request to the 'deleteItem' endpoint, sets the headers to expect a json response, and the itemText variable contents in the body
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Waiting response, parsing json
        const data = await response.json()
        console.log(data)
        // Reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}


async function markComplete(){
    // Traverses the dom up to the parent (li) and gets the text inside of the first <span> element 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a PUT request to the 'markComplete' endpoint, sets the headers to expect a json response, and the itemText variable contents in the body
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Waiting response, parsing json
        const data = await response.json()
        console.log(data)
        // Reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}


async function markUnComplete(){
    // Traverses the dom up to the parent (li) and gets the text inside of the first <span> element 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a PUT request to the 'markUnComplete' endpoint, sets the headers to expect a json response, and the itemText variable contents in the body
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Waiting response, parsing json  
        const data = await response.json()
        console.log(data)
        // Reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}