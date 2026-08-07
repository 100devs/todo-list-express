const deleteBtn = document.querySelectorAll('.fa-trash')
// in the ejs the todo item with li has class of item
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// ads a smurf to each of our spans.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    // itemText is a different name for our submitted value (Get Pizza)
    //parentNode is li, childnode is the span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // matches route from our server side js, then we go into the db and deleteOne
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

async function markComplete(){
    // this is the line that grabs the text (ex: get pizza) from the dom 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //makes a fetch request to our route 'markComplete' which is a put(update)
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // makes changes visible to user
        const data = await response.json()
        console.log(data)
        // refreshes which makes a get request which later triggers the gremlin(db listener), goes through 
        //ejs and fulfills the if condition that marks complete and finally goes through html and responds to user.
        location.reload()

    }catch(err){
        console.log(err)
    }
}
// functions the same as Mark Complete
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