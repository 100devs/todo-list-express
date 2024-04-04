//this js will be grabbed by any page rendered by the ejs

//declare variables for elements, well here it's actually nodelists
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//This creates an array for each element that had the class of 'fa-trash', and then uses a forEach loop to setup click listeners that will invoke the deleteItem function when those elements are clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//This creates an array of elements for any span element that was a descendant of a 'item' classed element, and using the forEach loop applies a click listener that will trigger markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//This creates an array of elements of any span element that had a class of 'completed' and were descendants of elements that had a class of 'item'
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//This function will be invoked when the user clicks on an element that has the 'fa-trash' class, which looks like a trash can
async function deleteItem(){
    //itemText is the result of clicking the trash icon(this) looking at it's parentNode (here a list item), selecting the second element's ([1]) in that list item's text node (sorry for wording)
    const itemText = this.parentNode.childNodes[1].innerText
    //using a try catch we create a promise called response from an awaited fetch call to the deleteItem route, and we pass it a specific request which is made up of the below data which is how the api will make the deleteOne method call (using this altered request object), also after the response from this fetch call we set a variable === json format and tell the code to wait for the return. We console.log that json converted response data, and then we tell the user to be reloaded aka app.get('/') after this method is finished invoking
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
}

//This function will invoke when a user clicks on a span of a list item that
async function markComplete(){
    //variable which pulls out the text from the span at the 2nd element position, of the list item (parentNode) of the span (this) we clicked on
    const itemText = this.parentNode.childNodes[1].innerText
    //try block which setups up a variable to === the return promise object of an awaited fetch call to the 'markComplete' route, and passes a specific request which will be used with the updateOne method in the api
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //create a variable with the response converted to json, wait for it
        const data = await response.json()
        //log it when it's done
        console.log(data)
        //app.get('/') basically; a refresh of the page after this method has finished invoking.
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//this function will be invoked when any span with a class of 'completed' within an element that has a class of 'item' is clicked.
async function markUnComplete(){
    //variable which === the text inside the 2nd sibling element to the element we clicked, both residing in the same parent
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block to attempt to save the returned promised object from an awaited fetch call to the api route of markUnComplete, passing in a specific request body
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //varaible which holds the conversion of the response of the fetch call into json, wait for it
        const data = await response.json()
        //log that converted response
        console.log(data)
        //app.get('/') shortcut to refresh page after this method has finished invoking
        location.reload()

    }catch(err){
        console.log(err)
    }
}
