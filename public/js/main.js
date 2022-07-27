const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//varibles that sleceted html quary in this case using it on the ejs 

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//running a loop on the event listner the item element delete 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//another loop for the event listenr when item is marked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//another loop for the event listner when item is unmarked

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
}
//running an aysnc fucntion for the deleteItem function
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
}
//not to sure what this async fucntion is doing but it feels like it is using the fetch method for our sever to changed the quary params
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
//seems like the same thing is happing here so im assuming this fucntion is being used to change the response sent to the server to update the element 