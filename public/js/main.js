const deleteBtn = document.querySelectorAll('.fa-trash') //assign groups of similar elements, identified by class names to a variable
const item = document.querySelectorAll('.item span')   //I clarified event handler attachment with :first-of-type selection. assign to this var all span children of elements with class of item
const itemCompleted = document.querySelectorAll('.item span.completed')//assign to this var all span with class "completed" that are children of elements with class of item

Array.from(deleteBtn).forEach((element)=>{ //turn into array to use array method and efficiently add event listeners. Similar ethos as event delegation
    element.addEventListener('click', e => deleteItem(e)) //call a particular function based on the element groupings
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', e => markComplete(e))
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', e => markUnComplete(e))
})

async function deleteItem(e){
    console.log('am I running?')
    const itemText = e.target.parentElement.querySelector('span:first-of-type').innerText
    // const itemText = this.parentNode.childNodes[1].innerText //grab name of item using nodes. 
        /**  Selection by node didn't work for me. I rewrote using e.target and passed e to each function */

    console.log(`item text ${itemText}`) //this doesn't run
    // So you click the trash icon, it goes up one level and sees parent node is the list item element.
    // then looks for the first childNode which would be the span containing the item name
    // then grabs that item name (the innerText property of that span)
    try{ //this block contains statements that could throw an exception
        const response = await fetch('/deleteItem', { //async delete req contains fetch req of method: delete
            method: 'delete',
            headers: {'Content-Type': 'application/json'}, //tell what format data will be sent
            body: JSON.stringify({ //turn the following object being passed as response body into JSON
              'itemFromJS': itemText //make value of the property "itemFromJS" of this req equal to the itemText grabbed up in line 18
            })
          })
        const data = await response.json() //handle response as JSON obj
        console.log(data) //show the data in the console. I assume this was a check to see if working.
          //so this prints the response that's received which from server.js you can see is going to tell you the todo was deleted
        // this prints to browser console. but both this message and the message printing to terminal originates from the server side.
        location.reload() //refresh the page, effectively sending a new get/read req. So that the user can see the changes (here, the deleted item won't be rendered in the list)

    }catch(err){ //catch block handles any exceptions and takes control if any occur from any of the statements in try block
        console.log(err)
    }
}

async function markComplete(e){ //callback for when any elements in "items" array is clicked
    const itemText = e.target.parentElement.querySelector('span:first-of-type').innerText
    // const itemText = this.parentNode.childNodes[1].innerText //as above, line 18
    try{
        const response = await fetch('/markComplete', { //sent req to the path "markComplete"
            method: 'put', //a put req, specifically
            headers: {'Content-Type': 'application/json'}, //tell the server to expect a json obj
            body: JSON.stringify({//turn your req into JSON format
                'itemFromJS': itemText //same as line 27
            })
          })
        const data = await response.json() //as above
        console.log(data)
        location.reload() //again as above, your location reload lets user see the effects of their click by refreshing page/sending a new get req after operation is executed

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(e){ //callback associated with the itemCompleted array
    const itemText = e.target.parentElement.querySelector('span:first-of-type').innerText

    // const itemText = this.parentNode.childNodes[1].innerText //as above, line 18
    try{
        const response = await fetch('/markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() //again as above, your location reload lets user see the effects of their click by refreshing page/sending a new get req after operation is executed

    }catch(err){
        console.log(err)
    }
}