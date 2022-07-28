//variables for selectors of different classes
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array from the variable, adds an event listener to each via forEach
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//creates an array from the variable, adds an event listener to each via forEach
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//creates an array from the variable, adds an event listener to each via forEach
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//async fxn that will delete items, runs when the trash icon is clicked
async function deleteItem(){
    //constant that specifies which text to target
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //tells which route to follow to interact with server side
        const response = await fetch('deleteItem', {
            //what will occur
            method: 'delete',
            //what type of content is expected from server
            headers: {'Content-Type': 'application/json'},
            //convert json to object
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //wait for the fetch, info is converted to json and assigned to variable
        const data = await response.json()
        //log the response
        console.log(data)
        //reloads the page to display changes
        location.reload()
          //log any errors
    }catch(err){
        console.log(err)
    }
}

//async fxn that handles updates
async function markComplete(){
    //variable that specifies which text to target
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //tells which route to follow to interact with server side
        const response = await fetch('markComplete', {
            //what the interation type will be
            method: 'put',
            //what type of content is expected from server
            headers: {'Content-Type': 'application/json'},
            //convert json to object
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //wait for the fetch, info is converted to json and assigned to variable
        const data = await response.json()
        //log the response
        console.log(data)
        //reload to display changes
        location.reload()

        //log any errors
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