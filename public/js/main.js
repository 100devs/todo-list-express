//variable that targets all font awesome trash icons with class of .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//variable that targets all span html tags where the parent has the class of .item
const item = document.querySelectorAll('.item span')
//variable that targets all span html tags with class of .completed, inside a parent with the class of .item
const itemCompleted = document.querySelectorAll('.item span.completed')

//querySelector creates a node list
//creating an array from all items with .fa-trash class, loop through them with forEach
Array.from(deleteBtn).forEach((element)=>{
    //add event listener to each to wait for a click, and on click run function delete item
    element.addEventListener('click', deleteItem)
})

//creating an array from all items of span html tags where parent has class of .item, loop through with forEach
Array.from(item).forEach((element)=>{
    //add event listener to each item and wait for click, on click run function markComplete
    element.addEventListener('click', markComplete)
})

//creating an array from all span html tags with class of .completed, inside a parent with the class of .item, loop 
Array.from(itemCompleted).forEach((element)=>{
    ////add event listener to each item and wait for click, on click run function markUnComplete
    element.addEventListener('click', markUnComplete)
})


//a node is an html element like a span, div, li in the dom
async function deleteItem(){
    //itemText  grabs first item in the li's innertext
    const itemText = this.parentNode.childNodes[1].innerText
    //try/catch is cleaner way to handle errors. Without, would crash page. In try block, if it kicks back error, just pass error to catch function, do what catch function tells you to do, and move on
    try{
        //creating response variable, fetch sends a request, to deleteItem the endpoint where sending data to
        const response = await fetch('deleteItem', {
            //?????
            method: 'delete',
            //header telling server recieving request "hey im sending json" (headers -- basics of http. Informational to pass between server and client)
            headers: {'Content-Type': 'application/json'},
            //json object
            body: JSON.stringify({
                //?????
              'itemFromJS': itemText
            })
          })
        //waiting for response from server, parsing it as json
        const data = await response.json()
        //log data to console in browser
        console.log(data)
        //reload page
        location.reload()
    //if error log to console
    }catch(err){
        console.log(err)
    }
}


async function markComplete(){
    //grabs the first item in the li's inner text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //creating response variable, fetch sends a request to the endpoint markComplete
        const response = await fetch('markComplete', {
            //update
            method: 'put',
            //header telling server recieving request "hey im sending json"
            headers: {'Content-Type': 'application/json'},
            //json object
            body: JSON.stringify({
                //itemFromJS value is innerText variable
                'itemFromJS': itemText
            })
          })
        //waiting for response from server, parsing it as json
        const data = await response.json()
        //console log data response
        console.log(data)
        //refresh
        location.reload()
    //console log error if error
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    //itemText variable is inner text of first li
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch sends a response to endpoint markUnComplete
        const response = await fetch('markUnComplete', {
            //update
            method: 'put',
            //header telling server recieving request "hey im sending json"
            headers: {'Content-Type': 'application/json'},
            //json object
            body: JSON.stringify({
                //itemFromJS value is itemText variable
                'itemFromJS': itemText
            })
          })
        //waiting for response from server, parsing it as json
        const data = await response.json()
        //console log the response data
        console.log(data)
        //refresh
        location.reload()
    //if there is an error
    }catch(err){
        //console log the error
        console.log(err)
    }
}