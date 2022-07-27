const deleteBtn = document.querySelectorAll('.fa-trash')  // variable of the class fa-trash
const item = document.querySelectorAll('.item span') // variable of the class item and element span (0021)
const itemCompleted = document.querySelectorAll('.item span.completed') // variable of the class item and element span and class completed

Array.from(deleteBtn).forEach((element)=>{ // forEach loop that runs object array in the deleteBtn
    element.addEventListener('click', deleteItem) // adds a smurf to the deleteBtn that run the deleteItem function on click 
})

Array.from(item).forEach((element)=>{ // forEach loop that runs object array in the item
    element.addEventListener('click', markComplete) // adds a smurf to the item that run the markComplete function on click 
})

Array.from(itemCompleted).forEach((element)=>{ // forEach loop that runs object array in the itemCompleted
    element.addEventListener('click', markUnComplete) // adds a smurf to the itemCompleted that run the markUnComplete function on click
})

async function deleteItem(){ //deleteItem async function
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text inthe this.parentNode.childNodes[1] constructor
    try{ 
        const response = await fetch('deleteItem', { // fetches deleteItem 
            method: 'delete', // adds delete value to method property
            headers: {'Content-Type': 'application/json'}, // adds 'Content-Type': 'application/json' value to header property
            body: JSON.stringify({ // convere json to html
              'itemFromJS': itemText // give the value of the itemText variable
            })
          })
        const data = await response.json() // variable data for the json
        console.log(data)   // outputs the json
        location.reload()

    }catch(err){
        console.log(err) // error when object is not delete
    }
}

async function markComplete(){ //markComplete async function
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text inthe this.parentNode.childNodes[1] constructor
    try{
        const response = await fetch('markComplete', { // fetches markComplete 
            method: 'put', // adds put value to method property
            headers: {'Content-Type': 'application/json'},  // adds 'Content-Type': 'application/json' value to header property
            body: JSON.stringify({ // convere json to html
                'itemFromJS': itemText // give the value of the itemText variable
            })
          })
        const data = await response.json()
        console.log(data) // outputs the json
        location.reload()

    }catch(err){
        console.log(err) // error when object is not delete
    }
}

async function markUnComplete(){ //markUnComplete async function
    const itemText = this.parentNode.childNodes[1].innerText // grabs the text inthe this.parentNode.childNodes[1] constructor
    try{
        const response = await fetch('markUnComplete', { // fetches markUnComplete 
            method: 'put', // adds put value to method property
            headers: {'Content-Type': 'application/json'}, // adds 'Content-Type': 'application/json' value to header property
            body: JSON.stringify({ // convere json to html
                'itemFromJS': itemText // give the value of the itemText variable
            })
          })
        const data = await response.json()
        console.log(data) // outputs the json
        location.reload()

    }catch(err){
        console.log(err) // error when object is not delete
    }
}