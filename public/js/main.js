const deleteBtn = document.querySelectorAll('.fa-trash')
//Set variable to select all items with the class of fa-trash
const item = document.querySelectorAll('.item span')
//set variable to select all items with the class of item and type of span
const itemCompleted = document.querySelectorAll('.item span.completed')
//set variable to select all items with the class of item and all spans  with the class of .completed

//This creates an array and places a smurf on each of our delete buttons which listens for a click and then runs the 'deleteItem' function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//On each todo list item there's a smurf waiting for a click to happen on that item.  When there is a click, the markComplete function will run (from line 38))


Array.from(itemCompleted).forEach((element)=>{
  element.addEventListener('click', markUnComplete)
})
//A smurf on our font awesome trash cans from ejs that listens for a click and then runs the markUnComplete function


//this function tells our server.js to delete an item from our database
async function deleteItem(){
//declare asynce delete function
  const itemText = this.parentNode.childNodes[1].innerText
  //get text from selected item 
  try{
      const response = await fetch('deleteItem', {
        // call the deleteItem route that is a delete request
          method: 'delete',
        //declare request type
          headers: {'Content-Type': 'application/json'},
        //delcare content to send in header
          body: JSON.stringify({
            //create json object from itemText to send to delete route
            'itemFromJS': itemText
          })
        })
      const data = await response.json()
      //declare response variable we are waiting to recieve from delete route
      console.log(data)
    //log delete route response
      location.reload()
    //refresh page 

  }catch(err){
      console.log(err)
    //if error console log error
  }
}


//loops through items in ejs - line 23 in ejs
async function markComplete(){
  const itemText = this.parentNode.childNodes[1].innerText
  try{
    //css - line through completed items
      const response = await fetch('markComplete', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
        //The JSON.stringify() method converts a JavaScript object or value to a JSON string, optionally replacing values if a replacer function is ...
          body: JSON.stringify({
              'itemFromJS': itemText
          })
        })
      const data = await response.json()
      //declares data variable. awaits response.json from line 100 of server.js
      console.log(data)
    //console log  data from the response 
      location.reload()
    //refreshes the page

  }catch(err){
      console.log(err)
  }
}

//this function has the fetch that will talk to our server.js and call the app.put which will set this item's completed property back to false
async function markUnComplete(){
  const itemText = this.parentNode.childNodes[1].innerText
  try{
    
    //css put a line through it
    //call to server.js on 109
    //fetch('markUnComplete'= looking for name name of the route and not the path?
      const response = await fetch('markUnComplete', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              'itemFromJS': itemText
          })
        })
      //we await the response from our server.js and once the db document is updated to have the property 'completed' set to false, we receive the response
      const data = await response.json()
      console.log(data)
      //refresh the page, and since our db has been updated, our page gets updated on the refresh.
      location.reload()

  }catch(err){
      console.log(err)
  }
}
