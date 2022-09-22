const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assign it to the selection of all elements with a class 
const item = document.querySelectorAll('.item span') // create a var and assign it to the selection of span tags inside a parent element with a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // create a var and assign it to a selection of spans with a class of completed inside a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //create array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add event listener to the current item that waits for a click, then calls a function called deleteItem
}) // close our loop

Array.from(item).forEach((element)=>{ // create array from our selection and start a loop
    element.addEventListener('click', markComplete) // add event listener to current item, when clicked the function called markComplete runs
}) // close our loop

Array.from(itemCompleted).forEach((element)=>{ // create array from our selection and start a loop
    element.addEventListener('click', markUnComplete) // add event listener to ONLY completed items, when clicked the function called markUnComplete runs. 
}) // close our loop

async function deleteItem(){ //declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs the TEXT only
    try{ // starting try block
        const response = await fetch('deleteItem', { //create a variable that waits on a fetch to get data from the result of deleteItem route. start a object
            method: 'delete', //sets crud method for the route
            headers: {'Content-Type': 'application/json'}, //specifying type of content expected which is json
            body: JSON.stringify({ //declare the message content being passed, and stringify it
              'itemFromJS': itemText //setting the content of the body to the innerText of the list item and naming it 'itemFromJs'
            }) //closing the body
          }) // closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // refresh to update changes on the dom

    }catch(err){ // if an error occurs, grab it and pass it into this catch block
        console.log(err) //log the error to the console
    } //close catch err tag
} //close async function

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