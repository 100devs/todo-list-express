//targetting span icons
const deleteBtn = document.querySelectorAll('.fa-trash')
//spain within the item class
const item = document.querySelectorAll('.item span')
//span within the item class with class completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//if a delete button is clicked from span (any of the buttons since array) go to function delete item
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//if a delete button is clicked from li (any of the li since array) go to function markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//if item is clicked child of li (span.completed) go to function markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//need to be saync since there is a fetch item
async function deleteItem(){
    //parentnode ul li's innerText (a child can be a node text too)
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending fetch with delete method as json
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                //sending value to /deleteItem route
              'itemFromJS': itemText
            })
          })
        //method on the Response object that lets you extract a JSON object from the response. The method returns a promise, so you have to wait for the JSON: await response. json() .
        const data = await response.json()
        console.log(data)
        //refresh this ho
        location.reload()
          //if above fails run this error instead
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //json.stringify send object data as string to server
            body: JSON.stringify({
                //value of itemFromJS 
                'itemFromJS': itemText
            })
          })
        //hol up for the data here
        const data = await response.json()
        console.log(data)
        location.reload()
          //if error run this console.log instead
    }catch(err){
        console.log(err)
    }
}

//async go ahead and parse on while I work on this fetch here
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    //try dis fetch first
    try{ //first await the fetch to server as I "put" this value from itemFromJS there
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //since we are awaiting our fetch we need to await our response.json() for data
        const data = await response.json()
        console.log(data)
        //reload current url for me (wait isnt this refreshing before data is coming back?? )
        location.reload()

    }catch(err){
        console.log(err)
    }
}