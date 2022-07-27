
//Declare variable for delete button and access element with favicon trash icon in index.ejs
const deleteBtn = document.querySelectorAll('.fa-trash')
//declare variable for item and access item element from index.ejs
const item = document.querySelectorAll('.item span')
//declare variable for completed item and access item elements with class of completed from index.ejs
const itemCompleted = document.querySelectorAll('.item span.completed')


//access all delete buttons  as an array
Array.from(deleteBtn).forEach((element)=>{
    //add event listener to each delete button (click) and relevant function
    element.addEventListener('click', deleteItem)
})


//access all task items as an array
Array.from(item).forEach((element)=>{
    //add event listener to each item (click) and relevant function
    element.addEventListener('click', markComplete)
})


//access all completed items as an array
Array.from(itemCompleted).forEach((element)=>{
    //add event listener to each completed item (click) and relevant function
    element.addEventListener('click', markUnComplete)
})


//get function ready for delete item, and wait for relevant data, declare as deleteItem
async function deleteItem(){
    //declare text in item as variable, access inner text as child node of parent elemtn
    const itemText = this.parentNode.childNodes[1].innerText
    //attempt to reach out and
    try{
        //save promise response as a waiter for delete item json object
        const response = await fetch('deleteItem', {
            //set delete method to object
            method: 'delete',
            //listen for json content
            headers: {'Content-Type': 'application/json'},
            //convert body of object to json format as a string
            body: JSON.stringify({
                //save key with itemText value (body text?)
              'itemFromJS': itemText
            })
          })
        //save response as json data
        const data = await response.json()
        //pass data to console and print
        console.log(data)
        //reload page without deleted item
        location.reload()
          //if fails
    }catch(err){
        //grab error, pass to console and print
        console.log(err)
    }
}

//declare complete function and tell it to wait for a promise
async function markComplete(){
    //target item text through parent element as child node
    const itemText = this.parentNode.childNodes[1].innerText
    //attempt to
    try{
        //declare response as variable, and wait for info from markComplete and JSON promise
        const response = await fetch('markComplete', {
            //specify that promise that we are listening for has a put method
            method: 'put',
            //specify that it is waiting for a json application format
            headers: {'Content-Type': 'application/json'},
            //specify that it wants the JSON object keys as strings
            body: JSON.stringify({
                //specify response body as 'itemFromJS' :itemText key value pair
                'itemFromJS': itemText
            })
          })
          //save json response as data
        const data = await response.json()
        //pass data to console and print
        console.log(data)
        //reload page with updated item
        location.reload()
          //if promise fails
    }catch(err){
        //pass error to console and print
        console.log(err)
    }
}

//declare uncomplete update function and wait for response
async function markUnComplete(){
    //save text from task as itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    //attempt to reach out and
    try{
        //declare response variable and ask for data through markUncomplete route as a jSON object
        const response = await fetch('markUnComplete', {
            //say it wants an object with a method that is put
            method: 'put',
            //say it wants it as a JSON object
            headers: {'Content-Type': 'application/json'},
            //set the response body as a json object with strings
            body: JSON.stringify({
                //declare response body as 'item.... : ....
                'itemFromJS': itemText

            })
          })
        
        //declare variable and save response as json
        const data = await response.json()
        //pass response to console and log in terminal
        console.log(data)
        //reload page with updated task
        location.reload()
          //if promise fails
    }catch(err){
        //grab error and pass into console, print in terminal
        console.log(err)
    }
}