// Here we are declaring variables to refer to groups of DOM elements. This will help dynamically add/remove event listeners as entries change.

const deleteBtn = document.querySelectorAll('.fa-trash') // this declares a constant variable 'deleteBtn' to more easily/dryly point to ALL of the DOM elements with class "fa-trash"
const item = document.querySelectorAll('.item span') // similar to previous line, but the variable is 'item' to grab all the spans that are within a parent element with the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // very similar to line 2, but more specific - this const 'itemCompleted' only points to 'items' of which the span also has the class of "completed"


// Here we are creating the event listeners for each of the different collections of DOM elements we pointed to above.

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) /* this code block takes the deleteBtn const which is initially a static NodeList, and turns those elements into an array. 
The forEach method then loops through each element and creates an event listener on each one. The listener is waiting for a click, 
and will then perform the deleteItem function
*/

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) /* this block does the same thing as the previous one, but for the 'item' group instead, and points to a different function - markComplete */

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) /* this block does the same thing as the previous one, but for the 'itemCompleted' group instead, and points to a different function - markUnComplete */


// Here we will define our functions which are being called by the event listeners defined above.

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
} /* this function runs asynchronously when one of our trash cans is clicked.
1. we declare itemText and assign to it the string of text from the trash can's parent node(the <li>)'s first childNode (the <span>).
2. our try block looks for a valid response from the server. We send a request to the 'deleteItem' path, which (hopefully) the server is set up to hear.
    2a. we send it as a 'delete' request, with a header notifying the server that the content type is application/JSON data, and the body is given as a 
    JSON string containing our itemText variable as a value to the key listed as 'itemFromJS' - it's up to the server to know what to do with that data,
    or rather, it's up to us to make sure we've CODED the server-side to understand that request and respond appropriately.
3. once the fetch is done, the server's response is stored in our variable that we have called 'response' We declare a new variable, which waits for that 'response' to be parsed as JSON
4. we console.log the data, and reload the page to end the function.
5. Our catch block will fire in case of any error / bad response.
*/

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}/* This function is very similar to the one above. 
Key differences: 
    1. the route is 'markComplete' rather than 'deleteItem'
    2. the method is 'put' rather than delete, since we are updating rather than... deleting

Everything else ON THIS END is the same, like word for word. Because the SERVER SIDE code is what has to RESPOND differently. 
*/

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
} /* This function is EVEN MORE SIMILAR to the one above it! In this case, the literal only difference is the route - 'markUnComplete'. 
    The server-side code handles that distinction accordingly to do effectively the oppposite thing, but the client side code is nearly identical. 
    Fascinating stuff!
*/