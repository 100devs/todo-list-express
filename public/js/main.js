// creates a variable holding all elements with the class of fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//Stores all of the span elements with a parent class of item
const item = document.querySelectorAll('.item span')
//Stores all of the span elements with a class of completed and a parent class of item
const itemCompleted = document.querySelectorAll('.item span.completed')

// Add event listeners to each item in deleteBtn (first transforms nodelist object into an array to utilise forEach method)
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Adds event listeners to each item in item (first it transforms it into an array and iterates over each item in the array via forEach method)
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// Add event listeners to each item in itemCompleted (first transforms nodelist object into an array to utilise forEach method)
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// asynchronus function which deletes the clicked on item from the database
async function deleteItem(){
    //Creates a variable that via the *this* target object (which focuses only on the element the event listener is on) and pulls the parent which pulls the child at 1 and then puts the text content in a variable.
    const itemText = this.parentNode.childNodes[1].innerText
    // will then try to execute he following code
    try{
        // assigns the result of the fetch delete request to the response variable
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // turn response into json
        const data = await response.json()
        //console.log the data (which is now in json format)
        console.log(data)
        //refreshes the page 
        location.reload()

        //Catches and returns any errors to the console
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //Creates a variable that via the *this* target object(which focuses only on the element the event listener is on) and pulls the parent which pulls the child at 1 and then puts the text content in a variable.
    const itemText = this.parentNode.childNodes[1].innerText
     // will then try to execute he following code
    try{
        // assigns the result of the fetch put request to the response variable
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // turn response into json
        const data = await response.json()
        //console.log the data (which is now in json format)
        console.log(data)
        //refreshes the page 
        location.reload()
        
        //Catches and returns any errors to the console
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    //Creates a variable that via the *this* target object (which focuses only on the element the event listener is on) and pulls the parent which pulls the child at 1 and then puts the text content in a variable.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // assigns the result of the fetch put request to the response variable
        const response = await fetch('markUnComplete', {
            // use a put method
            method: 'put',
            // send the request as json
            headers: {'Content-Type': 'application/json'},
            // input request as a json object
            // object has format {'itemFromJS: text for item}
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        // turn response into json
        const data = await response.json()
        //console.log the data (which is now in json format)
        console.log(data)
        //refreshes the page 
        location.reload()

        //Catches and returns any errors to the console
    }catch(err){
        console.log(err)
    }
}