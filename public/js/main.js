// Node list of elements with className 'fa-trash'
const deleteBtnList = document.querySelectorAll('.fa-trash')
// Node list of spans that are descendants of elements with className 'item'
const item = document.querySelectorAll('.item span')
// Node list of spans with className 'completed' that are descendants of elements with className 'item' 
// The list of completed tasks
const itemCompleted = document.querySelectorAll('.item span.completed')

// create array from deleteBtnList, iterate and pass an arrow function 
Array.from(deleteBtnList).forEach((deleteBtn)=>{
    // bind click event to each deleteBtn to call deleteItem
    deleteBtn.addEventListener('click', deleteItem)
})

// create array from item, iterate and pass an arrow function 
Array.from(item).forEach((element)=>{
    // bind click event to each element to call markComplete
    element.addEventListener('click', markComplete)
})

// create array from itemCompleted, iterate and pass an arrow function
Array.from(itemCompleted).forEach((element)=>{
    // bind click event to each element to call markUnComplete
    element.addEventListener('click', markUnComplete)
})

// asynchronus function that runs when the 'fa-trash' element is clicked
async function deleteItem(){
    // text in 'fa-trash' span
    const itemText = this.parentNode.childNodes[1].innerText
    // try to make a request
    try{
        // await response from server
        const response = await fetch('/deleteItem', {
            // set request method to delete
            method: 'delete',
            // set content type to application/json
            headers: {'Content-Type': 'application/json'},
            // set body to stringified object
            body: JSON.stringify({
                // set itemFromJS property to span.innerText
              'itemFromJS': itemText
            })
          })
        // parse fetch response string to json
        const data = await response.json()
        // show json response in console
        console.log(data)
        // refresh the page
        location.reload()
    // if try fails
    }catch(err){
        // show error in console
        console.log(err)
    }
}

// asynchronus function that runs when the span element that is the first child of the element
// with the 'item' className is clicked
async function markComplete(){
    // text in span element that is the second child of <li>
    const itemText = this.parentNode.childNodes[1].innerText
    // try to make a request
    try{
        // await response from server
        const response = await fetch('/markComplete', {
            // set request method to put
            method: 'put',
            // set content type to application/json
            headers: {'Content-Type': 'application/json'},
            // set body to stringified object
            body: JSON.stringify({
                // set itemFromJS property to span.innerText
                'itemFromJS': itemText
            })
          })
          // parse fetch response string to json
        const data = await response.json()
        // show json response in console
        console.log(data)
        // refrest the page
        location.reload()
    // if try fails
    }catch(err){
        // show error in console
        console.log(err)
    }
}

// asynchronus function that runs when the span element that is the first child of the element
// with the 'item' className is clicked
async function markUnComplete(){
    // text in span element that is the second child of <li>
    const itemText = this.parentNode.childNodes[1].innerText
    // try to make a request
    try{
        // await response from server
        const response = await fetch('markUnComplete', {
            // set request method to put
            method: 'put',
            // set content type to application/json
            headers: {'Content-Type': 'application/json'},
            // set body to stringified object
            body: JSON.stringify({
                // set itemFromJS property to span.innerText
                'itemFromJS': itemText
            })
          })
        // parse fetch response string to json
        const data = await response.json()
        // show json response in console
        console.log(data)
        // refresh the page
        location.reload()
    // if try fails
    }catch(err){
        // show error in console
        console.log(err)
    }
}