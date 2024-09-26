const deleteBtn = document.querySelectorAll('.fa-trash') //selecting ALL elements that have the .fa-trash class 
const item = document.querySelectorAll('.item span') //selecting ALL elements that have the .item class and span elements
const itemCompleted = document.querySelectorAll('.item span.completed') //selecting ALL elements that have the .item class and span elements with a .completed class

Array.from(deleteBtn).forEach((element)=>{ //creating an array from the deleteBtn variable which is all trash-can symbols 
    element.addEventListener('click', deleteItem) // within the array is a forEach method with a click event and async callback function 
})

Array.from(item).forEach((element)=>{ //creating an array from the item variable 
    element.addEventListener('click', markComplete) // within the array is a forEach method with a click event and async callback function
})

Array.from(itemCompleted).forEach((element)=>{ //creating an array from the itemCompleted variable 
    element.addEventListener('click', markUnComplete) // within the array is a forEach method with a click event and async callback function
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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

async function markComplete(){ //async function tied to clickevent 
    const itemText = this.parentNode.childNodes[1].innerText // initializing variable to 'this' object, which is the item that was clicked on and its text, using object properties
    try{ //try is similar to a promise, to attempt to do something
        const response = await fetch('markComplete', { //fetching a response from the back-end server that listens to ping markComplete. 1st param - server ping
            //2nd param = options of the object
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText //from the fetch, using this information that was given from the server 
            })
          })
        const data = await response.json() //waiting json response
        console.log(data)
        location.reload() //reloading page

    }catch(err){ //catching error after the TRY promise
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
