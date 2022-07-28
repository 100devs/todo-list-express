//Assigns a variable to a class selector of "fa-trash"
const deleteBtn = document.querySelectorAll('.fa-trash')
//Assigns a variable to a class selector of "item" AND tag selector "span"
const item = document.querySelectorAll('.item span')
//Assigns a variable to a class selector of "item" AND tag selector "span" WITH a class selector "completed"
const itemCompleted = document.querySelectorAll('.item span.completed')

//Creates an array from a variable, does a forEach method on the newly created array
Array.from(deleteBtn).forEach((element)=>{
    //Every element that is in the array, once clicked on, will be deleted via deleteItem function (below)
    element.addEventListener('click', deleteItem)
})

//Creates an array from a variable, does a forEach method on the newly created array
Array.from(item).forEach((element)=>{
    //Every element that is in the array, once clicked on, will be marked complete via markComplete function (below)
    element.addEventListener('click', markComplete)
})

//Creates an array from a variable, does a forEach method on the newly created array
Array.from(itemCompleted).forEach((element)=>{
    //Every element that is in the array, once clicked on, will be marked incomplete via markUnComplete function (below)
    element.addEventListener('click', markUnComplete)
})

//Creates an asynchronous function called deleteItem to handle delete operations
async function deleteItem(){
    //Assigns a variable to ...
    //this => element in a deleteBtn array which comes from ejs's fa-trash class (every item list has it)
    //parentNode => li?
    //childNodes[1] is a span with items[i].thing?
    //innerText is the text contained in the span 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Assign a variable to a response from a fetch function with a route of deleteItem (which will interact with server JS)
        const response = await fetch('deleteItem', {
            //Specifies the method that will be utilized in the delete operation 
            method: 'delete',
            //Specifies the content type to expect (server JS will send a json)
            headers: {'Content-Type': 'application/json'},
            //Convert the json to an object
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //Assign a variable that will wait until the above fetch function finishes, then convert the information to json format
        const data = await response.json()
        //Log the contents of the fetch function 
        console.log(data)
        //Reload the page to reflect the changes
        location.reload()
    //In case there is an exception, catch block will execute
    }catch(err){
        //Log the error if it is present
        console.log(err)
    }
}

//Creates an asynchronous function called markComplete to handle update (put) operations
async function markComplete(){
    //Assigns a variable to ...
    //this => element in a deleteBtn array which comes from ejs's fa-trash class (every item list has it)
    //parentNode => li?
    //childNodes[1] is a span with items[i].thing?
    //innerText is the text contained in the span 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Assign a variable to a response from a fetch function with a route of markComplete (which will interact with server JS)
        const response = await fetch('markComplete', {
            //Specifies the method that will be utilized in the update operation 
            method: 'put',
            //Specifies the content type to expect (server JS will send a json)
            headers: {'Content-Type': 'application/json'},
            //Convert the json to an object
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //Assign a variable that will wait until the above fetch function finishes, then convert the information to json format
        const data = await response.json()
        //Log the contents of the fetch function
        console.log(data)
        //Reload the page to reflect the changes
        location.reload()
    //In case there is an exception, catch block will execute
    }catch(err){
        //Log the error if it is present
        console.log(err)
    }
}

//Creates an asynchronous function called markUnComplete to handle update (put) operations
async function markUnComplete(){
    //Assigns a variable to ...
    //this => element in a deleteBtn array which comes from ejs's fa-trash class (every item list has it)
    //parentNode => li?
    //childNodes[1] is a span with items[i].thing?
    //innerText is the text contained in the span 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Assign a variable to a response from a fetch function with a route of markUnComplete (which will interact with server JS)
        const response = await fetch('markUnComplete', {
            //Specifies the method that will be utilized in the update operation 
            method: 'put',
            //Specifies the content type to expect (server JS will send a json)
            headers: {'Content-Type': 'application/json'},
            //Convert the json to an object
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //Assign a variable that will wait until the above fetch function finishes, then convert the information to json format
        const data = await response.json()
        //Log the contents of the fetch function
        console.log(data)
        //Reload the page to reflect the changes
        location.reload()
    //In case there is an exception, catch block will execute
    }catch(err){
        //Log the error if it is present
        console.log(err)
    }
}