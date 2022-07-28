const deleteBtn     = document.querySelectorAll('.fa-trash')
const item          = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
    //select all of these 

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //add the deleteBtns into an event listener cause we gonna do stuff
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //add all items to an event listener cause we gonna do stuff
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //add all complete items into an event listener cause we gonna do stuff
})

async function deleteItem(){ //oooh we gonna delete some stuffs
    const itemText = this.parentNode.childNodes[1].innerText //direct reference - grab parent, then child, second one, then text - don't do this use classes (ids, datatags etc) you animal
    try{
        const response = await fetch('deleteItem', { //this happens back
            method : 'delete', //labeling is fun
            headers: {'Content-Type': 'application/json'}, //make it into JSON
            body   : JSON.stringify({ //make it a string
              'itemFromJS': itemText //ties into our server.js delete
            })
          })
        const data = await response.json() //we waited, now we need to read it
        console.log(data) //we got it back!
        location.reload() //refresh the page

    }catch(err){ //something failed :c
        console.log(err) //here's what failed
    }
}

async function markComplete(){ //we updating some stuffs
    const itemText = this.parentNode.childNodes[1].innerText //see above for the notes - they match up from the deleteItem function
    try{
        const response = await fetch('markComplete', { //things happen
            method : 'put', //different method
            headers: {'Content-Type': 'application/json'}, //make sure it's JSON 
            body   : JSON.stringify({ //make it a string
                'itemFromJS': itemText //links us to the server.js
            })
          })
        const data = await response.json() //we waited now we reading it
        console.log(data) //woooah response
        location.reload() //refreshhhh

    }catch(err){ // 😿
        console.log(err) //here's what to fix
    }
}

async function markUnComplete(){ //same as above but complete to uncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method : 'put',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({
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