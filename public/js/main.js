const deleteBtn = document.querySelectorAll('.fa-trash')    //assign all trashcan icons to deleteBtn variable
const item = document.querySelectorAll('.item span')        //selects all the <span> elements that are descendants of elements with the class "item" in the current document.
const itemCompleted = document.querySelectorAll('.item span.completed') //select all elements with the class "completed" within <span> elements inside elements with the class "item"

Array.from(deleteBtn).forEach((element)=>{  //classic, adding a smurf onto each deletebtn element
    element.addEventListener('click', deleteItem)//Event handler/callback is the deleteItem function
})

Array.from(item).forEach((element)=>{   //array of all spans under item class parent have an event listener that once clicked runs mark complete
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{  //array for all the spans that have the COMPLETED class descending from the parent with item class has the event listener that runs mark uncomplete
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){    //asynch function so has try catch blocks, this is useful because there can be many errors so we want to know where an error occurs
    const itemText = this.parentNode.childNodes[1].innerText    //goes up to li(parent element with .item class), select appropriate childnode and grabs the innertext assigned to itemText, it's [1] and not 0 because stuff like spaces can be classed as an element/node?
    try{
        const response = await fetch('deleteItem', {//req to the deleteItem in server.js
            method: 'delete',   //send the method of delete...so it knows that it's a delete
            headers: {'Content-Type': 'application/json'},  //we need to specify headers so the server knows the content type of the request which will be json
            body: JSON.stringify({  //body property of the req is turned into JSON, has the property of itemFromJS, the value is the inner text grabbed from the selected item
              'itemFromJS': itemText //itemfromJS is what's put into the request to the database db.collection('todos').deleteOne({thing: request.body.itemFromJS})
            })
          })
        const data = await response.json() //if response fulfilled, return as json, and console log data
        console.log(data)
        location.reload()   //reload at the end

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText    //grab text of from selected element/node
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
}

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
}