const deleteBtn = document.querySelectorAll('.fa-trash') //delete button is linked to the class of fa trash
const item = document.querySelectorAll('.item span') //item span is linked to the class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //commpleted class on items is linked to the class commpleted

//take informatin turns into array and loops through to listen for a click and follows with function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//
async function deleteItem(){
    //node that points to the item that was clicked for deletion
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //makes a fetch for deleted item
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //assigns data response in json format
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //node to item clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //makes a fetch for markComplete item
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //assigns data response in json format
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    //node to item clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //makes a fetch for markUnComplete item
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //assigns data response in json format
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}