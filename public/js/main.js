//deletebutton is a constant variable, information of which selects all the elements with the class of .fa-trash 
//item selects all the elements with the class of item and within such class targets all the spans. 
//targets all the completed class within the span element that are enclosed within the item class 

const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//converts the deleteBtn element into an array and loops around it, in which all the instances develop the eventlistener ability to be clicked preceding by aformentioned functions such as deleteitm , mark cmplete and markuncomplete. 

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


// following asynchronous function defines the deleteItem function which targets the inner text of the form?? It then creates a fetch request to the server with the delete method and the header bit telling it that it's a json request. it further converts the itemFromJS data to string and then waits for the server to hear the response. After the response it logs the data on console and then refreshes the page for a new get request for the updated site. 

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


//updates the checkbox to completed by sending an update or a put request to the server

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

//same as above but marks as incomplete , maybe deselects the checkbox


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