const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a sleection of all elements with  class of the trash can
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assinging it to a selection of spans with a class of completed inside of a parent with a class of item 

Array.from(deleteBtn).forEach((element)=>{ // creating an array from selection and starting a loop
    element.addEventListener('click', deleteItem) // adding an event listener to the current item that waits for a click and then calls a function called deleteItem
}) // close the loop 

Array.from(item).forEach((element)=>{ // creating an array from selection and starting a loop 
    element.addEventListener('click', markComplete) // adding event listener to the current item that waits for a click and then calls afunction called markComplete
}) // close the loop 

Array.from(itemCompleted).forEach((element)=>{ // creating an array from selection and starting a loop
    element.addEventListener('click', markUnComplete) // adding event listener to only completed item 
}) // close the loop 

async function deleteItem(){ // declare a asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span (I am not sure what is really going on here)
    try{ // starting a try block
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from result of deleteItem route
            method: 'delete', // sets the crud method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON 
            body: JSON.stringify({ // declare the message content being passed and stringify that content
              'itemFromJS': itemText // set the content of the body to the inner text of the list item, nd naming it itemFromJS
            }) // closing the body 
          }) // closing our object
        const data = await response.json() // creating a variable and waiting on json from the  response to be converted
        console.log(data) // log the result to the console 
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //
        console.log(err) //
    } //
} //

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
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
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
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
        console.log(err)
    }
}