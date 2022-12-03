const deleteBtn = document.querySelectorAll('.fa-trash')
// makes a variable that selects all elements with a class of fa-trash
const item = document.querySelectorAll('.item span')
// makes a variable for the span tags inside of a parent that has a "item"
const itemCompleted = document.querySelectorAll('.item span.completed')// makes a variable for the spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{// makes an array of the selection and starting a loop
    element.addEventListener('click', deleteItem)
    // adds an event listener to the current item that waits for a click and then calls a function called deleteItem
})


Array.from(item).forEach((element)=>{// makes an array from our selection and starting a loop
    element.addEventListener('click', markComplete)
    // add an event listener to the current item that waits for a click and then calls a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{// makes an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)
    // add an event listener to only completed items
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //finds the inner text within the list spanlooks inside of the list item 
    try{
        const response = await fetch('deleteItem', {
            //makes a response variable that waits on a fetch request to get data fot the deleteItem route
            method: 'delete',
            //sets a CRUD method for the route
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
              'itemFromJS': itemText //set the content of the body to the inner text of the list item, and name it 'itemFromJS'
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err) //log the error to the console
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{
        const response = await fetch('markComplete', { //create a response variable that waits on a fetch request to get data from the result of the markComplete route
            method: 'put', //sets a CRUD method to "Update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({ //delcare the message content being passed, and stringify the content
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data) // log the result to the console
        location.reload()

    }catch(err){
        console.log(err) //catch errors
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{
        const response = await fetch('markUnComplete', { //create a response variable that waits on a fetch request to get data from the result of the markUnComplete route
            method: 'put', //set the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is JSON
            body: JSON.stringify({
                'itemFromJS': itemText //the content of the body to Inner
            })
          })
        const data = await response.json()//waits on JSON
        console.log(data)
        location.reload() /// reloads to update visuals

    }catch(err){ //cathches error
        console.log(err) //log the error to the console
    }
}