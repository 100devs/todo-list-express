// targeting all DOM elements with the '.fa-trash' class
const deleteBtn = document.querySelectorAll('.fa-trash')

// targeting all span tags where the parent has the '.item' class
const item = document.querySelectorAll('.item span')

// targeting all span tags with the 'completed' class where the parent has the 'item' class
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from the qsA results, loop through them all, and add a 'click' event listener that fires the 'deleteItem' function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create an array from the qsA results, loop through them all, and add a 'click' event listener that fires the 'markComplete' function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// create an array from the qsA results, loop through them all, and add a 'click' event listener that fires the 'markUncomplete' function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
// traverses the dom up to the parent (li), gets the text inside of the first <span> element with the class of 'completed', and delete it
    const itemText = this.parentNode.childNodes[1].innerText
// try-catch is a cleaner way to handle errors (error handling)   
    try{
// sends a delete request to the 'deleteItem' endpoint, sets the headers to expect a JSON response, and the itemText variable contents to the body 
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // waiting for response from server and parsing JSON
        const data = await response.json()
        console.log(data)
        // reload the specific page
        location.reload()
// catches an error
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
// traverses the DOM up to the parent li, gets the text inside of the first span element with the parent is an item, and marks it complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
// sends a put request to the 'markComplete' endpoint, sets the headers to expect a JSON response, and the itemText variable contents to the body 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // waiting for response from server and parsing JSON
        const data = await response.json()
        console.log(data)
        // reload specific page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
// traverses the DOM up to the parent li, gets the text inside of the first span element with the class of 'completed' and the parent is an item, and marks it complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
// sends a put request to the 'markUncomplete' endpoint, sets the headers to expect a JSON response, and the itemText variable contents to the body 
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
       // waiting for response from server and parsing JSON
        const data = await response.json()
        console.log(data)
        // reload specific page
        location.reload()

    }catch(err){
        console.log(err)
    }
}