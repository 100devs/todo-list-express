const deleteBtn = document.querySelectorAll('.fa-trash')// creates variable and assigns all DOM elements with class to variable
const item = document.querySelectorAll('.item span')// creates variable and assigns all DOM elements that are spans with parent of class item
const itemCompleted = document.querySelectorAll('.item span.completed')//creates variable and assigns all DOM elementsthat are spans & class of completed with parent of class item

Array.from(deleteBtn).forEach((element)=>{ //creates an array from elements assigned to variable and looping through each one...
    element.addEventListener('click', deleteItem)// adds event listener to current element on each iteration of foreach
})//closes forEach loop

Array.from(item).forEach((element)=>{//creates an array from elements assigned to variable and looping through each one...
    element.addEventListener('click', markComplete)// adds event listener to current element on each iteration of foreach
})//closes forEach loop

Array.from(itemCompleted).forEach((element)=>{//creates an array from elements assigned to variable and looping through each one...
    element.addEventListener('click', markUnComplete)// adds event listener to current element on each iteration of foreach
})//closes forEach loop

async function deleteItem(){ //defines async function for triggered by event listener
    const itemText = this.parentNode.childNodes[1].innerText// creates a var and assigns to it the text from the li from which the event originated
    try{//opening a try block to do something
        const response = await fetch('deleteItem', { //creates var and assigns a fetch that is awaited with route of 'deleteItem'
            method: 'delete', //sets CRUD method
            headers: {'Content-Type': 'application/json'}, //sets content type in http header
            body: JSON.stringify({ //sets body to json format
              'itemFromJS': itemText // passes text from the event into the key/property of 'itemFromJS' in the body
            })//closes JSON.stringfy operation
          })//closes fetch
        const data = await response.json() //after response is retruned succesfully convert to json and assign to data variable
        console.log(data)//console logs response    
        location.reload()// refreshes page because data has changed 

    }catch(err){ //opening catch block to handle try rejections/errors
        console.log(err) //console.log error
    }//close catch
}//closes async function body

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText// creates a var and assigns to it the text from the li from which the event originated
    try{//opening a try block to do something
        const response = await fetch('markComplete', {//creates var and assigns a fetch that is awaited with route of 'markUnComplete'
            method: 'put',//sets CRUD method
            headers: {'Content-Type': 'application/json'},//sets content type in http header
            body: JSON.stringify({//sets body to json format
                'itemFromJS': itemText// passes text from the event into the key/property of 'itemFromJS' in the body
            })//closes JSON.stringfy operation
          })//closes fetch
        const data = await response.json()//after response is retruned succesfully convert to json and assign to data variable
        console.log(data)//console logs response
        location.reload()// refreshes page because data has changed 

    }catch(err){//opening catch block to handle try rejections/errors
        console.log(err)//console.log error
    }
}//closes async function body

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText// creates a var and assigns to it the text from the li from which the event originated
    try{//opening a try block to do something
        const response = await fetch('markUnComplete', {//creates var and assigns a fetch that is awaited with route of 'markUnComplete'
            method: 'put',//sets CRUD method
            headers: {'Content-Type': 'application/json'},//sets content type in http header
            body: JSON.stringify({//sets body to json format
                'itemFromJS': itemText// passes text from the event into the key/property of 'itemFromJS' in the body
            })//closes JSON.stringfy operation
          })//closes fetch
        const data = await response.json()//after response is retruned succesfully convert to json and assign to data variable
        console.log(data)//console logs response
        location.reload()// refreshes page because data has changed 

    }catch(err){//opening catch block to handle try rejections/errors
        console.log(err)//console.log error
    }//close catch
}//closes async function body