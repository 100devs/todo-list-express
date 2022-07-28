const deleteBtn = document.querySelectorAll('.fa-trash')
// naming convention from DOM
const item = document.querySelectorAll('.item span')
// naming convention from DOM
const itemCompleted = document.querySelectorAll('.item span.completed')
// naming convention from DOM

Array.from(deleteBtn).forEach((element)=>{
    // turn HTMLcollection into array and iterate
    element.addEventListener('click', deleteItem)
    // add event listener to each element
})

Array.from(item).forEach((element)=>{
    // turn HTMLcollection into array and iterate
    element.addEventListener('click', markComplete)
    // add event listener to each element
})

Array.from(itemCompleted).forEach((element)=>{
    // turn HTMLcollection into array and iterate
    element.addEventListener('click', markUnComplete)
    // add event listener to each element

})

async function deleteItem(){
    // Promise for delete item
    const itemText = this.parentNode.childNodes[1].innerText
    // sets the itemText pulling in data using "this"
    try{
    // Resolution phase of promise
        const response = await fetch('deleteItem', {
            method: 'delete',
            // send to db as a delete in CRUD
            headers: {'Content-Type': 'application/json'},
            // needed to signify the data
            body: JSON.stringify({
            // stringify the data
              'itemFromJS': itemText
            // what data to stringify
            })
          })
        const data = await response.json()
        // this is the data you need
        console.log(data)
        // let's check it out on the console
        location.reload()
        // reload the view

    }catch(err){
        console.log(err)
        // if there is an error
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