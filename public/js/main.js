// variables

// assigns variables to some classes
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')


// assigns an click addEventListener to the declared variables
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// an async function that deletes an item
async function deleteItem(){
    
    //retrieves the text content of the current element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        
        // initiates a delete request to the deleteItem endpoint using the fetch API 
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        
//         parses the response as json
        const data = await response.json()
        
//         logs the response data to the console
        console.log(data)
        
//         reloads the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// an async function to mark an element as completed
async function markComplete(){
    
    //retrieves the inner text content of the current element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        
        //initiates a put request to the markComplete endpoint using the FetchAPI
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        
        // parses the response to json
        const data = await response.json()
        
        // logs the response to the console
        console.log(data)
        
        // reloads the page
        location.reload()

    }catch(err){
        
        // logs the error to the console
        console.log(err)
    }
}

// an async function that marks the current element as incomplete
async function markUnComplete(){
    
    // retrieves the inner text content of the current element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        
        // initiates a put request to the markUncomplete endpoint using fetchAPI
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        
        // parses the response into json
        const data = await response.json()
        
        // logs the data (response) in the console
        console.log(data)
        
        // reloads the page
        location.reload()

    }catch(err){
        
        // logs the error in the console
        console.log(err)
    }
}
