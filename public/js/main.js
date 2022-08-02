const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable storing all tags with class .fa-trash in the  variable
const item = document.querySelectorAll('.item span') //creating a variable storing all span tags with class .item in the variable
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable storing all  spans with .completed tags within tags with class .item in the variable 

Array.from(deleteBtn).forEach((element)=>{ // Creating an array from the variable deleteBtn, and calling each item in the array as an element
    element.addEventListener('click', deleteItem) // Adding an event listener to run the deleteItem function when the tag is clicked.
}) // Ending forEach

Array.from(item).forEach((element)=>{ // Creating an array from the variable item, and calling each item in the array as an element
    element.addEventListener('click', markComplete)// Adding an event listener to run the markComplete function when the tag is clicked.
}) // Ending forEach

Array.from(itemCompleted).forEach((element)=>{ // Creating an array from the variable deleteBtn, and calling each item in the array as an element
    element.addEventListener('click', markUnComplete) // Adding an event listener to run the itemCompleted function when the tag is clicked.
}) // Ending forEach

async function deleteItem(){ // async function declared and named deleteItem, no parameters used.
    const itemText = this.parentNode.childNodes[1].innerText //declare variable and store inputted text contained in the second child node of a parent node
    try{ // Start try block to do something
        const response = await fetch('deleteItem', { //create and store in variable response the data from a fetch request
            method: 'delete', // declare the method of the fetch request
            headers: {'Content-Type': 'application/json'}, // declare the type of content to be expected, JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
              'itemFromJS': itemText // play key of itemFromJS and property from itemText variable to body for request
            }) // end body being sent
          })// end fetch request
        const data = await response.json() // convert response of fetch request to json and store in data
        console.log(data) //console log the data
        location.reload() // refresh the page

    }catch(err){ // start catch block to catch errors if fetch request goes wrong
        console.log(err) //  console log the error
    } // end catch block
}

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