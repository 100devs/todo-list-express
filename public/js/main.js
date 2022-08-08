const deleteBtn = document.querySelectorAll('.fa-trash')// a variable for a delete button. the document method querySelectorAll() returns a static element. helpful to reduce redudant code
const item = document.querySelectorAll('.item span')// a variable for class 'item' and the span tag. the document method querySelectorAll() returns a static element. helpful to reduce redudant code
const itemCompleted = document.querySelectorAll('.item span.completed')// a variable for class 'item' and the span tag with class 'completed'. the document method querySelectorAll() returns a static element. helpful to reduce redudant code

Array.from(deleteBtn).forEach((element)=>{//we make an array from the (deleteBtn) the objects in the array come from looping through every element.
    element.addEventListener('click', deleteItem)//the smurf or eventlistner will trigger when the user clicks on the deleteItem. 
})

Array.from(item).forEach((element)=>{//an array from (item) the objects in the array come from looping through every element.
    element.addEventListener('click', markComplete)// the eventlistner will trigger when the user clicks on (markComplete)
})

Array.from(itemCompleted).forEach((element)=>{//an array from (itemCompleted). the objects in the array come from looping through every element.
    element.addEventListener('click', markUnComplete)// the eventlistner will trigger when the user clicks on (markUnComplete)
})

async function deleteItem(){//async keyword enable asynchronous, promise-based behavior to be written in a cleaner style, and avoiding callback hell. an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText//a variable using const named itemText. parentNode and childNode are part of the DOM. values are 1,3,6,9.. skipping evens. this const was made to reduce redundant code.
    try{//aka try block. a try block is excuted first then the catch
        const response = await fetch('deleteItem', {//variable declared with const named response. the Fetch API accesses resources across the network. with it we can make HTTP requests, downolad and upload files. inside the fetch() is the resource(url string || request object) which is named 'deleteItem'. fetch() starts a request and returns a promise. await syntax simplifies the work with promises..
            method: 'delete',//HTTP DELETE
            headers: {'Content-Type': 'application/json'},////Content-type is an HTTP header that is used to indicate the media type of the resource and in the case of responses, it tells the browser about what actually content type of the returned content is.
            body: JSON.stringify({//JSON string created from object
              'itemFromJS': itemText//value = 'itemFromJS' is what will be converted into a JSON string. replacer='itemText' an altering function or an array used as a selected filter for the stringify
            })
          })
        const data = await response.json()//variable declared with const named data. response.json() is a method on the response object that lets you extract a JSON object from the response. the method returns a promise, so you have to wait for the JSON: await reponse.json().. returns a promise resolved to a JSON object.
        console.log(data)//our data will appear on the terminal
        location.reload()//URL refresh

    }catch(err){//statement that is executed if an expection is thrown in the try block
        console.log(err)//an err message will appear on the terminal
    }
}

async function markComplete(){//async keyword enable asynchronous, promise-based behavior to be written in a cleaner style, and avoiding callback hell. an asynchronous function called markCompleted
    const itemText = this.parentNode.childNodes[1].innerText//a variable using const named itemText. parentNode and childNode are part of the DOM. values are 1,3,6,9.. skipping evens. this const was made to reduce redundant code.
    try{//aka try block. a try block is excuted first then the catch
        const response = await fetch('markComplete', {//variable delacred with const named response. the Fetch API accesses resources across the network. with it we can make HTTP requests, downolad and upload files. inside the fetch() is the resource(url string || request object) which is named 'markComplete'. fetch() starts a request and returns a promise. await syntax fits great with fetch() becuase it simplifies the work with promises.
            method: 'put',//agrument2 of the fetch api, an option,  HTTP PUT(update)
            headers: {'Content-Type': 'application/json'},//Content-type is an HTTP header that is used to indicate the media type of the resource and in the case of responses, it tells the browser about what actually content type of the returned content is. We are using PUT so our client will tell the server to send back 'application/json' JSON
            body: JSON.stringify({//JSON string will be created.an object to string.
                'itemFromJS': itemText//value = 'itemFromJS' is what will be converted into a JSON string. replacer='itemText' an altering function or an array used as a selected filter for the stringify
            })
          })
        const data = await response.json()//variable declared with const named data. response.json() is a method on the response object that lets you extract a JSON object from the response. the method returns a promise, so you have to wait for the JSON: await reponse.json().. returns a promise resolved to a JSON object. 
        console.log(data)//our data will appear on the terminal
        location.reload()//method refreshes the current URL.

    }catch(err){//statement that is executed if an expection is thrown in the try block
        console.log(err)//an err message will appear on the terminal
    }
}

async function markUnComplete(){//async keyword enable asynchronous, promise-based behavior to be written in a cleaner style, and avoiding callback hell. an asynchronous function called markUnCompleted
    const itemText = this.parentNode.childNodes[1].innerText//a variable using const named itemText. parentNode and childNode are part of the DOM. values are 1,3,6,9.. skipping evens. this const was made to reduce redundant code.
    try{//try block
        const response = await fetch('markUnComplete', {//variable delacred with const named response. the Fetch API accesses resources across the network. with it we can make HTTP requests, downolad and upload files. inside the fetch() is the resource(url string || request object) which is named 'markUnComplete'. fetch() starts a request and returns a promise. await syntax fits great with fetch() becuase it simplifies the work with promises.
            method: 'put',//HTTP PUT
            headers: {'Content-Type': 'application/json'},//Content-type is an HTTP header that is used to indicate the media type of the resource and in the case of responses, it tells the browser about what actually content type of the returned content is. We are using PUT so our client will tell the server to send back 'application/json' JSON
            body: JSON.stringify({//JSON string created from object
                'itemFromJS': itemText//value = 'itemFromJS' is what will be converted into a JSON string. replacer='itemText' an altering function or an array used as a selected filter for the stringify
            })
          })
        const data = await response.json()//variable declared with const named data. response.json() is a method on the response object that lets you extract a JSON object from the response. the method returns a promise, so you have to wait for the JSON: await reponse.json().. returns a promise resolved to a JSON object.
        console.log(data)//data will appear on terminal
        location.reload()//url refresh

    }catch(err){//catch block
        console.log(err)//an err message will appear on the terminal
    }
}