
//get all classes with .fa-trash to add a trash icon to
const deleteBtn = document.querySelectorAll('.fa-trash')
//get all spans inside .item class to use for db searches
const item = document.querySelectorAll('.item span')
//get all spans that have .completed to set the class in the html for the css styling to strike through
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array from the nodelist  and add deleteItem event listeners to each
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//creates an array from the nodelist  and add markComplete event listeners to each
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//creates an array from the nodelist  and add MarkUnComplete event listeners to each
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


async function deleteItem(){
    //this - object that was tied to event listener, 
    //prentnode - parent of that object, childnodes[1] - the span and grab inner text 
    const itemText = this.parentNode.childNodes[1].innerText

    try{
        const response = await fetch('deleteItem', {
            //method we are calling on the server
            method: 'delete',

            //content of the request will send json data
            headers: {'Content-Type': 'application/json'},
            
            // convert JavaScript value to a JSON string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //wait for data to get returned from the response
        const data = await response.json()
        //log the data we receive
        console.log(data)
        //reload the page
        location.reload()

    }catch(err){
        //if there was an error sending the delete request - log to console
        console.log(err)
    }
}

async function markComplete(){
    //this - object that was tied to event listener, 
    //prentnode - parent of that object, childnodes[1] - the span and grab inner text 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            //send put request to update
            method: 'put',
             //content of the request will send json data
            headers: {'Content-Type': 'application/json'},
            //convert JavaScript value to a JSON string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
            //wait for data to get returned from the response
            const data = await response.json()
            //log the data we receive
            console.log(data)
            //reload the page
            location.reload()

    }catch(err){
        //if there was an error sending the delete request - log to console
        console.log(err)
    }
}

async function markUnComplete(){
    //this - object that was tied to event listener, 
    //prentnode - parent of that object, childnodes[1] - the span and grab inner text 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            //send put request to put
            method: 'put',
            //content of the request will send json data
            headers: {'Content-Type': 'application/json'},
            //convert js to json
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //wait for data to get returned from the response
        const data = await response.json()
        //log the data we receive
        console.log(data)
        //reload the page
        location.reload()

    }catch(err){
        //if there was an error sending the delete request - log to console
        console.log(err)
    }
}

