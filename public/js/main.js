const deleteBtn = document.querySelectorAll('.fa-trash') //variables for easy reading takes all items with class fa trash
const item = document.querySelectorAll('.item span') // all spans inside elements with class item
const itemCompleted = document.querySelectorAll('.item span.completed') // all spans with class completed in the elements with class item

Array.from(deleteBtn).forEach((element)=>{ // all the elements with class fa trash are now in an array and looping
    element.addEventListener('click', deleteItem) // and now have an event listener and calliing deleteitem
})

Array.from(item).forEach((element)=>{ // creating an array from item and looping 
    element.addEventListener('click', markComplete) // event listener calling for markcomoplete
})

Array.from(itemCompleted).forEach((element)=>{ // same as above
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //assignin  a variable to the text from the choldnode that is span
    try{
        const response = await fetch('deleteItem', { //awaiting response of feych of the deleteitem route
            method: 'delete', // crud method 
            headers: {'Content-Type': 'application/json'}, // speicifies the type of content as json which will be returned
            body: JSON.stringify({ // convert converts a javascipt value to json string
              'itemFromJS': itemText // text retruned is set as itemtext
            })
          })
        const data = await response.json() // waiting for json to be coverted
        console.log(data)
        location.reload() // reload the page to show updated dom

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText// assign a variable to the text taken from the span of li
    try{
        const response = await fetch('markComplete', { // awatign response of fetch fn of markcomplete
            method: 'put', // crud method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({// converts json to string
                'itemFromJS': itemText//text retruned is set as itemtext
            })
          })
        const data = await response.json()// waiting for json to convert
        console.log(data)
        location.reload() //refresh

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // extract text from span of li
    try{
        const response = await fetch('markUnComplete', {
            method: 'put', // crud method
            headers: {'Content-Type': 'application/json'}, // type of response expected
            body: JSON.stringify({// converting js value to json
                'itemFromJS': itemText // setting text receieved as itemfromjs
            })
          })
        const data = await response.json() // waiting for json to convert
        console.log(data)
        location.reload()// refresh

    }catch(err){
        console.log(err)
    }
}