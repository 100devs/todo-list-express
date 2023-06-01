const deleteBtn = document.querySelectorAll('.fa-trash')//variable on ejs and dom
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // array and for each element create eventlistener
}) 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // unsets and sets list array and for each element create eventlistener
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // array and for each element create eventlistener
})

async function deleteItem(){ // async wait for response from db. 
    const itemText = this.parentNode.childNodes[1].innerText //delete the list item
    try{
        const response = await fetch('deleteItem', { //fetch the deleteItem request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText// sends list item to delete in a string to server 
            })
          })
        const data = await response.json() // waits for a response from the server 
        console.log(data)
        location.reload() // client reloads it 

    }catch(err){
        console.log(err) // catchs any errors
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // list item 
    try{
        const response = await fetch('markComplete', { /// fetch request to the server and match complete
            method: 'put', // sends a put request
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // send the item to update
            })
          })
        const data = await response.json() // awaits a response
        console.log(data) // 
        location.reload() // refresh page

    }catch(err){
        console.log(err)
    }
}
// same as above but to set it to incomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // get inner text from the list
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'}, // header type format json
            body: JSON.stringify(
                {
                'itemFromJS': itemText // send innertext as sttring to server as a request
            })
          })
        const data = await response.json() // wait for the server to respond
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}