// the font-awesome trash icon is assigned to variable deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
// the todo items from ejs are assigned to item
const item = document.querySelectorAll('.item span')
// the todo item(s) with span class completed are assigned to itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from each delete button displayed
// forEach delete button, create an eventListener
// callback function deleteItem will run when a given delete button is clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create an array from each item displayed
// forEach item, create an eventListener
// callback function markComplete will run when a given item is clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// create an array from each itemCompleted displayed
// forEach itemCompleted, create an eventListener
// callback function markUnComplete will run when a given item is clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// callback function for delete event listener
async function deleteItem(){
    // this refers to the clicked delete button
    // parentNode = li class item
    // childNodes[1] = items.thing (completed or incomplete)
    // itemText is set to the todo list item 
    const itemText = this.parentNode.childNodes[1].innerText
    // try block
    try{
        // response variable dependent on fetch 
        // fetch has the route of 'deleteItem' that correlates to the server side (server.js line 129)
        const response = await fetch('deleteItem', {
            // sets the method type
            method: 'delete',
            // sets content type so server knows its receiving json info
            headers: {'Content-Type': 'application/json'},
            // request.body using JSON
            body: JSON.stringify({
                // sets the itemText to property 'itemFromJS'
              'itemFromJS': itemText
            })
          })
        // data = the server json response
        const data = await response.json()
        // console.logs the json response
        console.log(data)
        // refreshes the page
        location.reload()
    // if try block cannot run due to error
    // catch block will run
    }catch(err){
       // console logs the error
        console.log(err)
    }
}

// callback function for item event listener
async function markComplete(){
    // this refers to the clicked item
    // parentNode = li class item
    // childNodes[1] = items.thing (incomplete)
    // itemText is set to the todo list item 
    const itemText = this.parentNode.childNodes[1].innerText
    // try block
    try{
        // response variable dependent on fetch 
        // fetch has the route of 'markComplete' that correlates to the server side (server.js line 77)
        const response = await fetch('markComplete', {
            // sets the method type
            method: 'put',
            // sets content type so server knows its receiving json info
            headers: {'Content-Type': 'application/json'},
            // request.body using JSON
            body: JSON.stringify({
                // sets the itemText to property 'itemFromJS'
                'itemFromJS': itemText
            })
          })
        // data = the server json response
        const data = await response.json()
        // console.logs the json response
        console.log(data)
        // refreshes the page
        location.reload()

    // if try block cannot run due to error
    // catch block will run
    }catch(err){
        // console logs the error
        console.log(err)
    }
}

// callback function for completed item event listener
async function markUnComplete(){
    // this refers to the clicked completed item
    // parentNode = li class item
    // childNodes[1] = items.thing (complete)
    // itemText is set to the todo list item 
    const itemText = this.parentNode.childNodes[1].innerText
    // try block
    try{
        // response variable dependent on fetch 
        // fetch has the route of 'markUnComplete' that correlates to the server side (server.js line 103)
        const response = await fetch('markUnComplete', {
            method: 'put',
            // sets content type so server knows its receiving json info
            headers: {'Content-Type': 'application/json'},
            // request.body using JSON
            body: JSON.stringify({
                // sets the itemText to property 'itemFromJS'
                'itemFromJS': itemText
            })
          })
        // data = the server json response
        const data = await response.json()
        // console.logs the json response
        console.log(data)
        // refreshes the page
        location.reload()

    // if try block cannot run due to error
    // catch block will run
    }catch(err){
        // console logs the error
        console.log(err)
    }
}