const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{// every selector that has a delete a trash button instantiated create an array and then for each element aka the trash can a individual click event is created
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{// any span that was instantiated in the parent item class--> run through those and add a event listener
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //got to the parent of this this trash can to select the name of 
    try{
        const response = await fetch('deleteItem', { // go to the server js and send this information to the request, and when it comes back reload
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText // add item text to the request body from api send back itemFrom Js and the property of the request
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){//click event linked to clicking a list item completed=false
    const itemText = this.parentNode.childNodes[1].innerText//defines the content of what is being click aka the words in the list item
    try{
        const response = await fetch('markComplete', {//api to servside.Js prop to change the completed from false to true
            method: 'put',//defining the types of mod is being made
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText//adding this property item from JS to the request body
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()// initiating a get request

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText// doing the same as above but only for items whose completed value is set to true
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