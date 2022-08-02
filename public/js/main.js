//creates variable for delete button
const deleteBtn = document.querySelectorAll('.fa-trash')
//creates variable for items
const item = document.querySelectorAll('.item span')
//creates variable for items completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//adds a click event for each element that will file delete function 
Array.from(deleteBtn).forEach((element)=>{
   //adds smurf to listen for a click when someone selects the trash icon
    element.addEventListener('click', deleteItem)
})
//creates an array of items
Array.from(item).forEach((element)=>{
    //adds smurf to listen for a click when someone marks an item as completed.
    element.addEventListener('click', markComplete)
})
//creates array of completed items
Array.from(itemCompleted).forEach((element)=>{
    //adds smurf to listen for a click when someone decides they didn't actually compelete something
    element.addEventListener('click', markUnComplete)
})
//the function to delete something
async function deleteItem(){
    //selects the text of the item to be deleted
    const itemText = this.parentNode.childNodes[1].innerText
  //try block for deleting item
    try{
        //sets up plan for deleting
        const response = await fetch('deleteItem', {
           //the part of CRUD you want, delete
            method: 'delete',
            //makes it json
            headers: {'Content-Type': 'application/json'},
           //make the object
            body: JSON.stringify({
                //get itemText into body of text
              'itemFromJS': itemText
            })
          })
          //convert the response into json
        const data = await response.json()
        //if everything works, shows the data in the console log
        console.log(data)
        //immediately reload from current endpoint
        location.reload()
//looks for an error
    }catch(err){
        //if there's a problem, shows the error in the console log
        console.log(err)
    }
}
//function to mark items as complete
async function markComplete(){
    //selects what item to mark as complete
    const itemText = this.parentNode.childNodes[1].innerText
   //try block for action
    try{
        //sets up plan for marking complete using markcomplete endpoint
        const response = await fetch('markComplete', {
           //what we wanna do from CRUD, update
            method: 'put',
            //default settings
            headers: {'Content-Type': 'application/json'},
            //make the object
            body: JSON.stringify({
              //pass itemText into the body of the text
                'itemFromJS': itemText
            })
          })
        //set up data variable
        const data = await response.json()
        //if everything works, show data in console log
        console.log(data)
        //immediately reload page so you can see it marked as completed
        location.reload()
//if something's wrong, this will activate
    }catch(err){
        //console log will show error
        console.log(err)
    }
}
//function to undo the mark complete
async function markUnComplete(){
   //what text to select to remove the completion status
    const itemText = this.parentNode.childNodes[1].innerText
   //try block for removing completion status
    try{
        //sets up plan for removing completion status
        const response = await fetch('markUnComplete', {
            //the CRUD we want, update
            method: 'put',
            //default settings
            headers: {'Content-Type': 'application/json'},
            //makes the object
            body: JSON.stringify({
                //pass itemText into body of text
                'itemFromJS': itemText
            })
          })
          //set up data variable
        const data = await response.json()
        //if all goes well, console log will show data
        console.log(data)
        //page immediately reloads to show the item is not actually completed
        location.reload()
//if something goes wrong, this will activate
    }catch(err){
       //this will console log the error 
        console.log(err)
    }
}
