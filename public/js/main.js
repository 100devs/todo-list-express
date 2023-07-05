const deleteBtn = document.querySelectorAll('.fa-trash') // creates a variable and assigns it to all elements with trash can class
const item = document.querySelectorAll('.item span') // variable assigned to classes of item with a span tag inside it
const itemCompleted = document.querySelectorAll('.item span.completed') // variable assigned to classes of items with span that have the class of completed

Array.from(deleteBtn).forEach((element)=>{ // make an array with contents of delete button and for each..
    element.addEventListener('click', deleteItem) // add an click event listnener that activates the deleteItem function
})

Array.from(item).forEach((element)=>{// make an array with contents of item and for each..
    element.addEventListener('click', markComplete) // add an click event listnener that activates the MarkComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // make an array with contents of itemCompleted and for each..
    element.addEventListener('click', markUnComplete)// add an click event listnener that activates the markUnComplete function
})

async function deleteItem(){ // calls the aync deleteItem function
    const itemText = this.parentNode.childNodes[1].innerText // declares variable that selects the first child elements text of the parentNode of the clicked element
    try{
        const response = await fetch('deleteItem', { // declares variable that waits on a  fetch to get data from the results of the deleteItem route
            method: 'delete', // sets the crud method for the route 
            headers: {'Content-Type': 'application/json'}, /// specifies type of content expected here json
            body: JSON.stringify({ // declares the message content and stringify it
              'itemFromJS': itemText // declares variable to be itemText
            })
          })
        const data = await response.json() // declares data var that awaits json data 
        console.log(data) // log data 
        location.reload() // reloads the page to get a new get request 

    }catch(err){ // if a error happens pass the error into here 
        console.log(err) // log it 
    }
}

async function markComplete(){ // declare async function 
    const itemText = this.parentNode.childNodes[1].innerText // declares variable that selects the first child elements text of the parentNode of the clicked element
    try{
        const response = await fetch('markComplete', { // declares variable that waits for a fetch to get data from markCompelte route
            method: 'put', // declares crud method
            headers: {'Content-Type': 'application/json'}, // specifies the type of content will be json
            body: JSON.stringify({ // the text that comes in will be stringified 
                'itemFromJS': itemText // the info will come from itemText and it will be declared itemFromJS
            })
          })
        const data = await response.json() // variable that waits for the stringifid response 
        console.log(data) // logs it 
        location.reload() // reloads the page to show the info 

    }catch(err){ // if a error happens pass the error into here 
        console.log(err) // log it 
    }
}

async function markUnComplete(){ // declare async function 
    const itemText = this.parentNode.childNodes[1].innerText // declares variable that selects the first child elements text of the parentNode of the clicked element
    try{
        const response = await fetch('markUnComplete', {// declares variable that waits for a fetch to get data from markUnCompelte route
            method: 'put', // declares crud method
            headers: {'Content-Type': 'application/json'}, // specifies the type of content will be json
            body: JSON.stringify({ // the text that comes in will be stringified 
                'itemFromJS': itemText  // the info will come from itemText and it will be declared itemFromJS
            })
          })
        const data = await response.json() // variable that waits for the stringifid response 
        console.log(data) // log it
        location.reload()  // reloads the page to show the info 

    }catch(err){ // if a error happens pass the error into here 
        console.log(err) // log it 
    }
}