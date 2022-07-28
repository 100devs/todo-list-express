const deleteBtn = document.querySelectorAll('.fa-trash')
//select all DOM element with class of 'fa-trash' and assign this nodelist to 'deleteBtn' variable
const item = document.querySelectorAll('.item span')
//select all DOM elements that are spand and a descendant of elements iwth a class of 'item', and assign this nodelist to the item variable
const itemCompleted = document.querySelectorAll('.item span.completed')
//select all DOM elements that are a spand with the class 'completed' and are a descendant of elements with a class of 'item', and assign this nodelist to 'itemCompleted' variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//create an array from the nodelist 'deleteBtn' and iter thorugh each element, adding an eventlistener with a click event that triggers the deleteItem function

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
//create an array from the nodelist 'item' and iter thorugh each element, adding an eventlistener with a click event that triggers the marketComplete function
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
//create an array from the nodelist 'itemCompleted' and iter thorugh each element, adding an eventlistener with a click event that triggers the markUnComplete function
})

async function deleteItem(){
//create an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText
    //we get the innertext of the first children of the parent node ( which is the span) where this funcion was called from
    try{
        const response = await fetch('deleteItem', {
        //make a fetch to deleteItem path and await for it
            method: 'delete',
            //set method to delete
            headers: {'Content-Type': 'application/json'},
            //set Content-Type header to application/json - so it knows we're sending JSON
            body: JSON.stringify({
            //send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        // attempt to load and parse the response body as JSON, assigning it to data
        console.log(data)
        location.reload()
        //reload window
        

    }catch(err){
        console.log(err)
    }
    //if any errors are caught, log the erros
}

async function markComplete(){
    // get the innerText of the <span>(changed childnodes[1] to children[0] since the comments are part of the childnode and broke the code!!)
    const itemText = this.parentNode.childNodes[0].innerText
    try{
        const response = await fetch('markComplete', {
         // make fetch to markComplete path
            method: 'put',
             // set request method to PUT
            headers: {'Content-Type': 'application/json'},
             // set Content-Type header to application/json - so it knows we're sending JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
            // send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
          })
        const data = await response.json()
        // attempt to load and parse the response body as JSON, assigning it to data
        console.log(data)
        location.reload()
        // reload the webpage

    }catch(err){
        console.log(err)
    }
    // If any errors are caught, console.log them
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
     // get the innerText of the <span>
    try{
        const response = await fetch('markUnComplete', {
        // make fetch to markUnComplete path
            method: 'put',
            // set request method to PUT
            headers: {'Content-Type': 'application/json'},
            // set Content-Type header to application/json - so it knows we're sending JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
            // send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
          })
        const data = await response.json()
        console.log(data)
        // attempt to load and parse the response body as JSON, assigning it to data
        location.reload()
        // reload the webpage

    }catch(err){
        console.log(err)
    }
    // If any errors are caught, console.log them
}