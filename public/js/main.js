const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span') // listen for slicks on span that have class item
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{ //smurf
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // goes through and adds smurf to each span, will call markComplete function depending on which u click
    element.addEventListener('click', markComplete) // markComplete runs on click
})

Array.from(itemCompleted).forEach((element)=>{ // smurf
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // click this (trashcan) go from span to LI, look at first shild node that has text, get pizza
    try{
        const response = await fetch('deleteItem', { // make fretch to server that has route of deleteItem
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText // get pizza
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
    const itemText = this.parentNode.childNodes[1].innerText // child node of li ejs, span on line 28 ejs, grab its inner text. clicked span, went up to LI then back to span string of "get pizza"
    try{
        const response = await fetch('markComplete', { // make fetch put method and send along item text, mark complete is route
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // needs to have itemFromJS on server side get pizza
            })
          })
        const data = await response.json()
        console.log(data) // console log mark complete
        location.reload() // refreshes page and triggers get 

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