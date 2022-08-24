const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
//find all of the spans that has the class of item

const itemCompleted = document.querySelectorAll('.item span.completed')


Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// loop through all of the spans that has the class of item and add an event listener to listen to the event. Clicks don't come for free there has to be something that listens. Then it will continue with the mark complete function


Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
    // set item text to the todo you wish todelete

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
        // this grabs the todo

    try{
        const response = await fetch
        ('deleteItem', {
            method: 'delete',
            // delete method
            headers: {'Content-Type': 'application/json'},
            // put this content type on the page
            body: JSON.stringify({
              'itemFromJS': itemText
            //   change this to a json string
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
        const response = await fetch
                    // make a fetch
('markComplete', {
            method: 'put',
                        // with a put method

            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
                  // req leaves client side and goes to server where there isa server set to hear this req
                // item text = latest item marking complete 
            })
          })
        const data = await response.json()
        console.log(data)
          // marks weather it was completed or not  from server.js
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
        // item that was just edited

    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText

                    // This is an object item from Js property: value of item text
            })
          })
        const data = await response.json()
        console.log(data)
        // log the data
        location.reload()

    }catch(err){
        console.log(err)
    }
}