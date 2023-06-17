//setting variables for elements
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//puts all the trash cans into an array and adds an event listener on each trash can
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//puts all the spans into an array and adds an event listener on each one
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//puts all the spans with completed class into an array and adds an event listener on each one
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//makes delete request to the server
async function deleteItem(){
    //grabs the info from the appropriate span
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
        //refreshes the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//makes put request to the server
async function markComplete(){
    //grabs the info from the appropriate span
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
        //refreshes the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//makes put request to the server
async function markUnComplete(){
    //grabs the info from the appropriate span
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
        //refreshes the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}