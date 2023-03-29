//variable that holds all the classes .fa-trash.
const deleteBtn = document.querySelectorAll('.fa-trash')
//variable that holds all the classes .item and span.
const item = document.querySelectorAll('.item span')
//variable that holds all the classes .item and span.completed.
const itemCompleted = document.querySelectorAll('.item span.completed')

//Created an array from deleteBtn and goes to each element in the array and adds a click event to run the deleteItem function.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Created an array from item and goes to each element in the array and adds a click event to run the markComplete function.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Created an array from itemCompleted and goes to each element in the array and adds a click event to run the unComplete function.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//deleteItem function that is asyncronous
async function deleteItem(){
    //stores the childNodes innerText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a delete request by passing deleteItem as the URL
        //and request payload as an object containing itemFromJS
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //await for the response and reload the page when done.
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//markComplete function that is asyncronous
async function markComplete(){
        //stores the childNodes innerText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a update request by passing markComplete as the URL
        //and request payload as an object containing itemFromJS
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
                    //await for the response and reload the page when done.
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//markUnComplete function that is asyncronous
async function markUnComplete(){
        //stores the childNodes innerText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a update request by passing markUnComplete as the URL
        //and request payload as an object containing itemFromJS
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
                    //await for the response and reload the page when done.
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}