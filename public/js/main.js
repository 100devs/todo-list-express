// 2-4 define important variables needed by the rest of the script.
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// 7-9 create an array out of all the items on the page with a class of '.fa-trash' and add an event listener to call the deleteItem function from lines 22-40 whenever one of those items is clicked.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// 11-19 create an array from all elements on the page with the .item class and the span selector, then assign an event listener to call the markComplete function from 43-60 on click.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// 17-19 create an array from all the elements with the .item class and the span.completed tags, then assigns an event listener to call the markUncomplete function from 63-80 on click.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// 22-40 are an asynchronous function that sends a delete request to the deleteItem endpoint of our server when the event listener is triggered.  These lines also console log the deletion and any errors that occur.
async function deleteItem(){
    // Line 24 defines itemText as the text of the ToDo item that was clicked.
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

//  43-60 send the put request to the markComplete endpoint of our server when the event listener is triggered, console log the data from the response, and handle any errors that occur.
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

// 63-80 also send a put request to the server, but this time it's to the markUnComplete endpoint.  They also console log the data sent and catch and print any errors that occur.
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