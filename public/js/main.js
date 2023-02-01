//making delete button easier to access via a simple variable
//referencing items in the ejs file, with fa being an html tag for font awesome icons
const deleteBtn = document.querySelectorAll('.fa-trash')
//item on to do list
const item = document.querySelectorAll('.item span')
//checkmark I imagine.
const itemCompleted = document.querySelectorAll('.item span.completed')

//turns data into arrays so we can work with it in the below fetch functions?
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//fetch to interact with the server.js file.
async function deleteItem(){
    //has to grab items as nodes, grabbing the actual text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            //important method here
            method: 'delete',
            //how to respond
            headers: {'Content-Type': 'application/json'},
            //converts js to JSON
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