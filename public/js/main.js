// Variables
const deleteBtn = document.querySelectorAll('.fa-trash') // set all elements with 'fa-trash' class as `deleteBtn`
const item = document.querySelectorAll('.item span') // set all <span> element whose parent element has 'item' class as `item`
const itemCompleted = document.querySelectorAll('.item span.completed') // set all <span> elements with 'completed' class whose parent element has 'item' class as `itemCompleted`

Array.from(deleteBtn).forEach((element)=>{
    /* 
        For each `element` in `deleteBtn` array,
        add an event listener for event type 'click'.
        When 'click' occur, execute `deleteItem` function
    */
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    /* 
        For each `element` in `item` array,
        add an event listener for event type 'click'.
        When 'click' occur, execute `markComplete` function
    */
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    /* 
        For each `element` in `itemCompleted` array,
        add an event listener for event type 'click'.
        When 'click' occur, execute `markUnComplete` function
    */
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    /* 
        An asynchronous function. Send a request to the server for deleting a TODO item
    */

    // set `innerText` of second `childNodes` of `this` object `parentNode` as `itemText`
    // this -> element with 'fa-trash' class
    // parentNode -> li.item
    // childNodes[1] -> span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        /* 
            try to execute a `fetch` request to the server on route 'deleteItem'. The `response` from the server are then converted into JSON and set as `data`. The value of `data` will then be display in the console and the current `location` will be reloaded
        */
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        /* 
            catch the `error` if an exception is thrown in the `try` block. Display the `error` into the console
        */
        console.log(err)
    }
}

async function markComplete(){
    /* 
        An asynchronous function. Send a request to the server to mark a TODO item as completed
    */

    // set `innerText` of second `childNodes` of `this` object `parentNode` as `itemText`
    // this -> .item span
    // parentNode -> li.item
    // childNodes[1] -> span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        /* 
            try to execute a `fetch` request to the server on route 'markComplete'. The `response` from the server are then converted into JSON and set as `data`. The value of `data` will then be display in the console and the current `location` will be reloaded
        */
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        /* 
            catch the `error` if an exception is thrown in the `try` block. Display the `error` into the console
        */
        console.log(err)
    }
}

async function markUnComplete(){
    /* 
        An asynchronous function. Send a request to the server to mark a TODO item as incomplete
    */

    // set `innerText` of second `childNodes` of `this` object `parentNode` as `itemText`
    // this -> .item span.completed
    // parentNode -> li.item
    // childNodes[1] -> span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        /* 
            try to execute a `fetch` request to the server on route 'markUnComplete'. The `response` from the server are then converted into JSON and set as `data`. The value of `data` will then be display in the console and the current `location` will be reloaded
        */
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        /* 
            catch the `error` if an exception is thrown in the `try` block. Display the `error` into the console
        */
        console.log(err)
    }
}