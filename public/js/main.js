//Creates a constant to target a group of selectors for the font awesome trashcan icon
const deleteBtn = document.querySelectorAll('.fa-trash')
//Creates a constant to target the item selectors the span with the list items
const item = document.querySelectorAll('.item span')
//Creates a constant to target the completed list items
const itemCompleted = document.querySelectorAll('.item span.completed')

//Convert 'deleteBtn' to an array, then call 'forEach' on the array
Array.from(deleteBtn).forEach((element)=>{
    //Add an event listener, so that each time the trash can icon is clicked, the deleteItem function on the related list item runs 
    element.addEventListener('click', deleteItem)
})

//Convert 'item' to an array, then call 'forEach' on the array
Array.from(item).forEach((element)=>{
    //Add an event listener so that each time a list item is marked complete the markComplete function on the related list item runs
    element.addEventListener('click', markComplete)
})

//Convert 'itemCompleted' to an array, then call 'forEach' on the array
Array.from(itemCompleted).forEach((element)=>{
    //Add an event listener so that each time a completed item is clicked, the markUncomplete function on the related item runs
    element.addEventListener('click', markUnComplete)
})

//Declares the deleteItem function and allows it run asynchronously 
async function deleteItem(){
    //from the <span> bound by the event listener, get the 1th childNode from the parentNode (<li>) and get the text content
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Fetch deleteItem
        const response = await fetch('deleteItem', {
            //Set request method to DELETE
            method: 'delete',
            //Set header content type to JSON so it can properly parse our JSON data
            headers: {'Content-Type': 'application/json'},
            // Send the object with a property of itemFromJS and value of 'itemText' from the current item as a JSON string
            body: JSON.stringify({
            'itemFromJS': itemText
            })
        })
        //Parse the response as JSON, assign it to a constant data
        const data = await response.json()
        //Console log the data to make sure it worked
        console.log(data)
        // Reload the webpage
        location.reload()
    //If there are any errors, they will be caught and logged here.
    }catch(err){
        //Console log errors
        console.log(err)
    }
}

//Declare the markComplete function and allow it to run async
async function markComplete(){
    //from the <span> bound by the event listener, get the 1th childNode from the parentNode (<li>) and get the text content
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Fetch 'markComplete
        const response = await fetch('markComplete', {
            //Set request method to PUT
            method: 'put',
            //SEt the content header type to JSON, so it can properly parse or JSON data
            headers: {'Content-Type': 'application/json'},
            // Send the object with a property of itemFromJS and value of 'itemText' from the current item as a JSON string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        //Parse the response as JSON, assign it to a constant 'data'
        const data = await response.json()
        //Console log data to make sure it worked
        console.log(data)
        //Reload webpage
        location.reload()
    //Catch any errors.
    }catch(err){
        //Console log errors.
        console.log(err)
    }
}

//Declares the markUncomlete function and allows to run async
async function markUnComplete(){
    //from the <span> bound by the event listener, get the 1th childNode from the parentNode (<li>) and get the text content
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Fetch 'markUncomplete'
        const response = await fetch('markUnComplete', {
            //Set request method to PUT
            method: 'put',
            // Set the content header type to JSON, so it can perperly parse our JSON data
            headers: {'Content-Type': 'application/json'},
            //Send the object with a property of itemFromJS and value of 'itemText' from the current item as a JSON string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        //Parse the response as JSON, assign it to a constant 'data'
        const data = await response.json()
        //Console log the data to make sure it worked
        console.log(data)
        //Reload the page
        location.reload()
    //Catch any errors that may have occurred
    }catch(err){
        //console log the errors.
        console.log(err)
    }
}