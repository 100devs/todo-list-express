// selects all elements with .fa-trash class and puts them in a variable called deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash') 
// selects all elements with .item span class and puts them in a variable called itemCompleted
const item = document.querySelectorAll('.item span')
// selects elements with classes of both item and completed, stores them in variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates array using deleteBtn variable and adding a smurf to all deleteBtn's waiting for a click, calls deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// creates array from item variable, loops through each variable, adds a smurf that listens for a click, calls markComplete fn
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creates array from itemCompleted variable, adds a smurf to each that listens for a click, calls markUnComplete fn
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


// declare asyncronous fn named deleteItem
async function deleteItem(){
    // goes into the span of text from ejs file, retireves inner text within the li span
    const itemText = this.parentNode.childNodes[1].innerText

    // declares a try block
    try{
        // create response variable, have it wait on a fetch promise to get the result of the deleteItem route
        const response = await fetch('deleteItem', {
            // sets CRUD method to (D)elete
            method: 'delete',
            // specifies the content type as JSON
            headers: {'Content-Type': 'application/json'},
            // take the JSON content and make each text item a string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // using a variable to store the JSON response after waiting for it to respond
        const data = await response.json()
        // console log the data to show the response came through and to debug
        console.log(data)
        // refresh the current page
        location.reload()

    }catch(err){ // if an error occurs, pass it into the catch block
        // console log the error
        console.log(err)
    }
}
// declaring async fn called markComplete
async function markComplete(){
    // looks inside of the list item and grabs only the innertext
    const itemText = this.parentNode.childNodes[1].innerText
    // start of a try block
    try{
        // response variable to await a fetch on the mark complete route
        const response = await fetch('markComplete', {
            // crud method set to U, update. 
            method: 'put',
            // content type set to json
            headers: {'Content-Type': 'application/json'},
            // sets the content of the body to be strings
            body: JSON.stringify({
                // sets content of the body to innerText of the list item, names it itemFromJS
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // waits for JSON from response to be converted
        console.log(data) // console logs the data
        location.reload() // refreshes the page 

    }catch(err){ // if an error occurs the error is passed into the try block
        console.log(err) // error is console logged 
    }
}

async function markUnComplete(){
    // looks inside of the list item and grabs only the innertext
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // response variable awaits fetch response for markUncomplete route
        const response = await fetch('markUnComplete', {
            // method set to Update
            method: 'put',
            // content type set to JSON
            headers: {'Content-Type': 'application/json'},
            // response JSON content is turned into string
            body: JSON.stringify({
                // makes itemText a string and names it itemFromJS
                'itemFromJS': itemText
            })
          })
          // waits for response to be converted
        const data = await response.json()
        // logs the data to the console
        console.log(data)
        // refreshes the page
        location.reload()

    // if an error occurs the error is sent to the catch block
    }catch(err){
        // error is logged to the console 
        console.log(err)
    }
}