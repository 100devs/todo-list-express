// selects all elements with class of .fa-trash (trashcan) & stores in a constant var
const deleteBtn = document.querySelectorAll('.fa-trash')
// selects all span elements inside of a parent that has a class of item & stores in a constant var
const item = document.querySelectorAll('.item span')
// selects all spans with a class of completed inside of a parent with a class of item & stores in a constant var
const itemCompleted = document.querySelectorAll('.item span.completed')

// creates an array from the deleteBtn var & use forEach method
Array.from(deleteBtn).forEach((element)=>{
    // adding event listeners to items --> when clicked, runs function named "deleteItem"
    element.addEventListener('click', deleteItem)
    // closing forEach func
})

// init an array from item var & use forEach method
Array.from(item).forEach((element)=>{
    // adding event listeners --> when clicked, runs markComplete func
    element.addEventListener('click', markComplete)
    // closes forEach func
})

// init an array from itemCompleted var & use forEach method
Array.from(itemCompleted).forEach((element)=>{
    // adds event listeners to only completed items --> when clicked, runs markUnComplete func
    element.addEventListener('click', markUnComplete)
    // closes forEach func
})

// declaring async deleteItem func
async function deleteItem(){
    // init constant var itemText and assigning it value of only the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // init try catch block
    try{
        // init const response var that awaits fetch of data from the deleteItem route
        const response = await fetch('deleteItem', {
            // sets CRUD method for the route
            method: 'delete',
            // specifying the type of content expected, which is JSON
            headers: {'Content-Type': 'application/json'},
            // declaring the message content being passed, and stringify that content
            body: JSON.stringify({
                // setting the content of the body to the innerText of the list item, and naming it 'itemFromJS'
              'itemFromJS': itemText
              // closing body
            })
            // closing obj
          })
          // init const data var --> waiting on JSON from the response to be converted
        const data = await response.json()
        // console logs result
        console.log(data)
        // reloads the page to update what is displayed
        location.reload()
    // closes try block & inits catch block
    }catch(err){
        // if err, log to console err
        console.log(err)
    // closes catch block
    }
// closes func
}

// declares async markComplete func
async function markComplete(){
    // init const itemText var and looks inside of the list item and grabs only the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // init try catch block
    try{
        // init const response var that waits on a fetch to get data from the result of the markComplete route
        const response = await fetch('markComplete', {
            // setting the CRUD method to 'update'
            method: 'put',
            // specifying the type of content expected, which is JSON
            headers: {'Content-Type': 'application/json'},
            // declaring the message content being passed, and stringify that content
            body: JSON.stringify({
                'itemFromJS': itemText
                // closing body
            })
            // closing object
          })
          // init const data var --> waiting on JSON from the response to be converted
        const data = await response.json()
        // logs the result to console
        console.log(data)
        // reloads the page to update what is displayed
        location.reload()
    // closes try block & init catch block
    }catch(err){
        // if err, console log err
        console.log(err)
    // close catch block
    }
// close func
}

// declaring async func markUnComplete
async function markUnComplete(){
    // init const itemText var and looks inside of the list item and grabs only the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // init try catch block
    try{
        // init const response var that waits on a fetch to get data from the result of the markUnComplete route
        const response = await fetch('markUnComplete', {
            // setting the CRUD method to 'update'
            method: 'put',
            // specifying the type of content expected, which is JSON
            headers: {'Content-Type': 'application/json'},
            // declaring the message content being passed, and stringify that content
            body: JSON.stringify({
                'itemFromJS': itemText
            // closing body
            })
        // closing object
          })
        // init const data var --> waiting on JSON from the response to be converted
        const data = await response.json()
        // log the result
        console.log(data)
        // reloads the page to update what is displayed
        location.reload()
    // closes try block & init catch block
    }catch(err){
        // if err, console log err
        console.log(err)
    // close catch block
    }
// close func
}