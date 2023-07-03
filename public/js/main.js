// get elements from the html and store them in the variables 
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// iterate through deleteBtn and add click event for each of them, that will fire a deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// iterate through item and add click event for each of them, that will fire a markComplete function

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// iterate through itemCompleted and add click event for each of them, that will fire a markUnComplete function

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// async fucntio means that you don't have to wait for it to be finished, the goblin can came back and grab the resaults 

async function deleteItem(){
    // go to the parent element of the element cliced and grab the innerText of first child 
    const itemText = this.parentNode.childNodes[1].innerText

    // start a try-catch block in case of errors
    try{
        // await meangs you should wait until the promise is solved 
        const response = await fetch('deleteItem', {
            // declaring a method we want, and type of data we're using
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // we need to await for everyitnh to be complited so we can res with someting, in this case json file
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

