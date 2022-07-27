//learned that document.querySelectors are not js but web APIs that grab the element. Assign the specific element to a variable.
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//creates an array from each item deleteBtn and it iterates through each item to add an event listener to each item with the function of deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//creates an array from each list item span and adds event listener to that item so that when clicked, it triggers markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//creates an array from each markCompleted item span and assigns eventlistener to it that runs markUncomplete func on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// async func fires off on click
async function deleteItem(){ //grabs the item being referenced by this and puts it in a variable itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{ // do what is in the try block,
        const response = await fetch('deleteItem', { //fetch promise to await results from server.js 
            method: 'delete', //delete method to be used on item
            headers: {'Content-Type': 'application/json'}, //what type of file it is returning
            body: JSON.stringify({ //converts the db collection object into JSON
              'itemFromJS': itemText //this item being referenced is the value from the object with itemFromJS being the key
            }) 
          })
        const data = await response.json() //stores the json object into data variable
        console.log(data)
        location.reload() //reloads the page on the client side

    }catch(err){ // if the promise is rejected, it goes to catch block which console logs the error for debugging
        console.log(err)
    }
}
//async function on click 
async function markComplete(){ //async allows code to run asynchronously along with other code. 
    const itemText = this.parentNode.childNodes[1].innerText //grabs the li and it's span. stores the innerText in itemText
    try{ //try this
        const response = await fetch('markComplete', { //fetch promise route is /markComplete on server.js
            method: 'put', //update method will happen on server.js
            headers: {'Content-Type': 'application/json'}, //content-type it is returning is json
            body: JSON.stringify({ //grabs the document object and converts it into JSON
                'itemFromJS': itemText  //key and value in object. itemFromJS is used on EJS file
            })
          })
        const data = await response.json()
        console.log(data) //data will log the specific item that was picked to be marked as complete
        location.reload() //reloads the current page

    }catch(err){ //catch errors incase promise is rejected
        console.log(err)
    }
}
//also an update request made to the server. same as the above
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