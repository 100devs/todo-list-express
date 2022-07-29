//Looks for classes and elements specified in the parentheses. Select all these items!
const deleteBtn     = document.querySelectorAll('.fa-trash')
const item          = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem)//add the deleteBtns into an event listener so we can do stuff
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)//add all items to an event listener cause we're going to do things!
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)//add all complete items into an event listener cause we're gonna do stuff
})

async function deleteItem(){ // we gonna be deleting stuff! async tells system to wait.
    const itemText = this.parentNode.childNodes[1].innerText //itemText here is the content inside of the element that is inside of the childnode[1] of this parentNode (a direct reference... pathed reference because you grab parent then child then element, then text. BUT if DOM changes, it can break. So better to grab by data tag/class. You animal.)
    try{ //if anything here fails, go straight to catch. be graceful.)
        const response = await fetch('deleteItem', { //this happens back
            method : 'delete', //labelling!
            headers: {'Content-Type': 'application/json'}, //set up headers. Makes sure it's parsed as JSON
            body   : JSON.stringify({ //set up body. Make it a string.
              'itemFromJS': itemText //same as server.js line 83. These names have to match! It's how they're tied in.
            })
          })
        const data = await response.json() //great, we've waited. Let's convert to JSON.
        console.log(data) //We get data back and logged!
        location.reload() //refresh the page (to be more lightweight, change it locally and replace only those elements)

    }catch(err){ //womp womp something failed
        console.log(err) //here's what failed
    }
}

async function markComplete(){ //we update things to be completed
    const itemText = this.parentNode.childNodes[1].innerText //see above, line 19, for notes. itemText is the direct reference
    try{
        const response = await fetch('markComplete', { //things happening
            method : 'put', //using PUT method
            headers: {'Content-Type': 'application/json'}, //making suree it's JSON
            body   : JSON.stringify({ //turning things into strings
                'itemFromJS': itemText //links us to server.js
            })
          })
        const data = await response.json() //we waited, now we're reading it
        console.log(data) //it's a response!
        location.reload() //reload the page!

    }catch(err){ // 😿
        console.log(err) //fix this
    }
}

async function markUnComplete(){ //same as above, but marking items as uncomplete
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