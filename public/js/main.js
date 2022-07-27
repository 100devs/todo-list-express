const deleteBtn = document.querySelectorAll('.fa-trash')  //goest into the document and looks for selecors with class of fa-trash -> this will be named deleteBtn
const item = document.querySelectorAll('.item span')  //select on all the .item in the spans
const itemCompleted = document.querySelectorAll('.item span.completed') //any span with class of item AND completed


//the arrays are constructed upon document load and waiting for something to happen. Once we click, whatever we clicked will run
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)  //makes an arraay of every fa-trash class. each element in that array takes the element and adds an event listener to it and on click runs the deleteItem functin (below)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)  //makes an array from the item (above). each element in that array takes an element and adds an event listener to it, on click it runs the markComplete function (below)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //makes an array from the itemCompleted (above). each element that
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //parentNode would be ul and childNode would be li in a list; the innerText would be the text inside the list ; going into the ul and into the li and getting the text to change; childNodes[1] is the childNode located at index 1
    try{ //what we will be doing once deleteItem is actived
        const response = await fetch('deleteItem', {
            method: 'delete', //using the CRUD delete
            headers: {'Content-Type': 'application/json'}, //explains what type of file it will get in return
            body: JSON.stringify({  //converts an object to a JSON string
              'itemFromJS': itemText  //this is what is being turned into JSON string ; itemFromJS is from serverJS
            }) //itemFormJS is the name given to thte itemText ; it is the key and value is itemText; (we pick the name itemFromJS and the itemText is from above const) similar ex. 
          })
        const data = await response.json() //console logs the information above (response)
        console.log(data) //console logs the data
        location.reload() //reloads the page so it shows your updates ; automatic refresh

    }catch(err){  //console logs any errors
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put', //using the CRUD put
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