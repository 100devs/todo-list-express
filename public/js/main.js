//variable deletebtn is attached too all fa-trash  
const deleteBtn = document.querySelectorAll('.fa-trash')
//variable item attached to all item spans
const item = document.querySelectorAll('.item span')
//variable item completed targetted on item span.completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// take array from deletebtn and for each element 
Array.from(deleteBtn).forEach((element)=>{
    // add click event deleteItem
    element.addEventListener('click', deleteItem)
})

//take array item and for each element in item
Array.from(item).forEach((element)=>{
    // add click event markComplete
    element.addEventListener('click', markComplete)
})

//take array from itemCompleted and for each element in itemCompeleted
Array.from(itemCompleted).forEach((element)=>{
    //add click event markUnComplete
    element.addEventListener('click', markUnComplete)
})

//function deleteItem is async
async function deleteItem(){
    //itemText the innertest of childNode[1] and ParentNode
    const itemText = this.parentNode.childNodes[1].innerText
    //try..catch: try this function, catch error if it doesn't work
    try{
        //response awaits delete item being run, fetch delete Item, return
        const response = await fetch('deleteItem', {
            //CRUD method 'delete'
            method: 'delete',
            //information returned will be in json for header
            headers: {'Content-Type': 'application/json'},
            // body javascirpt will be converted to JSON with stringify
            body: JSON.stringify({
                //javascript convereted is itemsFromJS => itemText
              'itemFromJS': itemText
            })
          })
          //data runs once response.json  runs
        const data = await response.json()
        //log the data
        console.log(data)
        //refresh page
        location.reload()
    //catch object
    }catch(err){
        //log error
        console.log(err)
    }
}

//above applied to markComplete
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            //update request
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

//above applied to markUnComplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            //update request
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