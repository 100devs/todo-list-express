// sets a variable name for all trash icons
const deleteBtn = document.querySelectorAll('.fa-trash')
// sets a variable name for all todo items
const item = document.querySelectorAll('.item span')
// sets a variable name for all completed todo items
const itemCompleted = document.querySelectorAll('.item span.completed')
//cycles through each deletebtn variable
Array.from(deleteBtn).forEach((element)=>{
    //adds smurf to all trash cans aka deletebtn variable- sends to deleteItem function
    element.addEventListener('click', deleteItem)
// close forEach loop
})

//cycles through each item variable
Array.from(item).forEach((element)=>{
    //adds smurf to all todo list items aka item variable sends to markComplete function
    element.addEventListener('click', markComplete)
// close forEach loop
})

//cycles through each itemCompleted variable
Array.from(itemCompleted).forEach((element)=>{
    //adds smurf to all completed todo list items aka itemCompleted variable sends to markUncomplete function
    element.addEventListener('click', markUnComplete)
// close forEach loop
})
//intilize async function deleteItem
async function deleteItem(){
    //grabs which 'this' to determine which item's trash can was clicked and stores it in the variable itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //if it works:
    try{
        //makes a fetch request to deleteItem
        const response = await fetch('deleteItem', {
            //defines as a delete request
            method: 'delete',
            //lets request know it will be looking for/handling JSON data
            headers: {'Content-Type': 'application/json'},
            //convert value to JSON
            body: JSON.stringify({
               //select the JSON object that has a key of 'itemFromJS' and value of itemText 
              'itemFromJS': itemText
            // close object
            })
          // close fetch   
          })
        //hold json response in data variable
        const data = await response.json()
        //display data to console
        console.log(data)
        //refresh page
        location.reload()
    //if error:
    }catch(err){
        //display error to console
        console.log(err)
    //close error
    }
//close function
}
//intilize function markComplete
async function markComplete(){
    //grabs which 'this' to determine which item was clicked and stores it in the variable itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //if it works:
    try{
        //makes a fetch request to markComplete
        const response = await fetch('markComplete', {
             //defines as a put request
            method: 'put',
            //lets request know it will be looking for/handling JSON data
            headers: {'Content-Type': 'application/json'},
            //convert value to JSON
            body: JSON.stringify({
                //select the JSON object that has a key of 'itemFromJS' and value of itemText 
                'itemFromJS': itemText
            // close object
            })
          // close fetch   
          })
        //hold json response in data variable
        const data = await response.json()
        //display data to console
        console.log(data)
        //refresh page
        location.reload()
    //if error:
    }catch(err){
        //display error to console
        console.log(err)
    //close error
    }
//close function
}
//intilize function markUncomplete
async function markUnComplete(){
    //grabs which 'this' to determine which completed item was clicked and stores it in the variable itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //if it works:
    try{
        //makes a fetch request to markUncomplete
        const response = await fetch('markUnComplete', {
            //defines as a put request
            method: 'put',
            //lets request know it will be looking for/handling JSON data
            headers: {'Content-Type': 'application/json'},
            //convert value to JSON
            body: JSON.stringify({
                //select the JSON object that has a key of 'itemFromJS' and value of itemText 
                'itemFromJS': itemText
            // close object
            })
          // close fetch 
          })
        //hold json response in data variable
        const data = await response.json()
        //display data to console
        console.log(data)
        //refresh page
        location.reload()
    //if error:     
    }catch(err){
        //display error to console
        console.log(err)
    //close error
    }
//close function
}