// this finds every item in html with class '.fa-trash' and assign it to a variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// this finds every item in html with class '.item span' and assign it to a variable
const item = document.querySelectorAll('.item span')
// this finds every item in html with class '.item span.completed' and assign it to a variable
const itemCompleted = document.querySelectorAll('.item span.completed')

//this add an eventlistner to every trash button and fires a function deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//this add an eventlistner to every item and fires a function markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//this add an eventlistner to every complatedItem and fires a function markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//Async function that fired as someone click the trash can and it get the task text and sends it  to the server as /deleteItem route with a method of delete
async function deleteItem(){
    //get task text next to the trash icon
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Send fetch request to server
        const response = await fetch('deleteItem', {
            //specifeing what method we using
            method: 'delete',
            //specifying the Content-Type of the request 
            headers: {'Content-Type': 'application/json'},
            //data we sending
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        //refresh after everything went okey
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//async function that fired as someone click the task, it get that task text and send it to the server as /markComplete route with a method of put
async function markComplete(){
     //get task text
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
//async function that fired as someone click the task, it get that task text and send it to the server as /markUnComplete route with a method of put
async function markUnComplete(){
    //get task text
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