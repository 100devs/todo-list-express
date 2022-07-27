const deleteBtn = document.querySelectorAll('.fa-trash') // creates an array of all elements with  the .fa-trash class
const item = document.querySelectorAll('.item span') // creates an array of all elements with  the completed class
const itemCompleted = document.querySelectorAll('.item span.completed') // creates an array of all elements with  the completed class

Array.from(deleteBtn).forEach((element)=>{ // loops through the array and creates an event listener for each element
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // loops through the array and creates an event listener for each element
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ // loops through the array and creates an event listener for each element
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ // async function called when trash icon clicked 
    const itemText = this.parentNode.childNodes[1].innerText // assign inner text of the  list item with the name when the trash icon is clicked
try{   
        const response = await fetch('deleteItem', { // fetch delete request with deleteItem url
            method: 'delete', //delete method
            headers: {'Content-Type': 'application/json'}, //content type specified
            body: JSON.stringify({ //specifies body of request, converts item to json object string
              'itemFromJS': itemText // specifies name of item to be deleted
            })
          })
        const data = await response.json()// stores response from server
        console.log(data)
        location.reload() // reloads page

    }catch(err){ //catches errors
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put', // put method
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
            method: 'put', //put method
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