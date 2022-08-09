//store the delete button in a vairable 
const deleteBtn = document.querySelectorAll('.fa-trash')
//store all items in a variable 
const item = document.querySelectorAll('.item span')
//create variable to grab all completed items
const itemCompleted = document.querySelectorAll('.item span.completed')

//attach an event lisiner to the delete buttons to run the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//attach even listener to all items to run the markComplete function 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//make an array from completed items and attach a click event listener that triggers the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //select the actual text of the item
    const itemText = this.parentNode.childNodes[1].innerText
    //try/catch block, enabling code to be tested for errors while it is being executed 
    try{
        //fetch deleteItem from server.js, returning Promise object
        const response = await fetch('deleteItem', {
            //state we are using the delete method
            method: 'delete',
            //headers to indicate json data type
            headers: {'Content-Type': 'application/json'},
            //set the request body to be json
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //store the response as json in the data variable
        const data = await response.json()
        //console log the data
        console.log(data)
        //reload the same URL to reflect updates
        location.reload()
          //console log any errors
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //access the actual text of the item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch markComplete
        const response = await fetch('markComplete', {
            method: 'put',
            //set headers for content type of data
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //store that data in the data variable as json
        const data = await response.json()
        //console log the data
        console.log(data)
        //reload current URL to show updated information
        location.reload()
//log any errors
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    //access the actual text of the item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch markUnComplete from server.js and return a Promise object
        const response = await fetch('markUnComplete', {
            //state we are using the put method
            method: 'put',
            //state we are using json format for data
            headers: {'Content-Type': 'application/json'},
            //put itemText into the request body from the item that was clicked
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //store the response in the data variable
        const data = await response.json()
        //console log the data for verification
        console.log(data)
        //reload the same URL to reflect updates 
        location.reload()
//console log any errors 
    }catch(err){
        console.log(err)
    }
}