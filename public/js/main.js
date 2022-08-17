const deleteBtn = document.querySelectorAll('.fa-trash') 
const shadowDelete = document.querySelectorAll('.fa-trash-restore-alt') 
const item = document.querySelectorAll('.item span') 
const itemCompleted = document.querySelectorAll('.item span.completed') 

Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem) 
}) 

Array.from(shadowDelete).forEach((element)=>{ 
    element.addEventListener('click', shadowDeleteItem) 
}) 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) 
}) 

Array.from(itemCompleted).forEach((element)=>{ 
    element.addEventListener('click', markUnComplete) 
}) 

async function deleteItem(){ 
    const itemText = this.parentNode.childNodes[1].innerText 
    try{ 
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

async function shadowDeleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText 
    try{ 
        const response = await fetch('shadowDelete', { 
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