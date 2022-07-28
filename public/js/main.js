//GROUP ALL ELEMENTS CONTAINING "FA-TRASH" INTO A CONSTANT
const deleteBtn = document.querySelectorAll('.fa-trash')

// GROUP ALL SPANS FROM CLASS ITEM INTO A CONSTANT
const item = document.querySelectorAll('.item span')

//GROUP ALL SPANS WITH THE CLASS SPAN.COMPLETED WITHIN THE CLASS ITEM INTO A CONSTANT
const itemCompleted = document.querySelectorAll('.item span.completed')


//ADD AN EVENT LISTENER WITH THE FUNCTION "deleteItem" FOR EVERY "deleteBtn"
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})


//ADD AN EVENT LISTENER WITH THE FUNCTION "markComplete" FOR EVERY "item"
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})


//ADD AN EVENT LISTENER WITH THE FUNCTION "markUnComplete" FOR EVERY "itemCompleted"
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})


async function deleteItem() {

    //SELECT THE TEXT
    const itemText = this.parentNode.childNodes[1].innerText
    try {

        //FETCH "deleteItem" FROM SERVER.JS
        const response = await fetch('deleteItem', {

            //METHOD USED
            method: 'delete',

            //CONTENT USED
            headers: { 'Content-Type': 'application/json' },

            //CONVERT JSON TO STRING AND SENDS IT TO SERVER.JS
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        //ASSIGN THE RESPONSE TO A CONSTANT TO HAVE BETTER VISIBILITY WHEN USED BELOW
        const data = await response.json()

        //LOG THE RESPONSE
        console.log(data)

        //REFRESH
        location.reload()


        //LOG ANY ERRORS
    } catch (err) {
        console.log(err)
    }
}

async function markComplete() {

    //SELECT THE TEXT
    const itemText = this.parentNode.childNodes[1].innerText
    try {

        //FETCH "markComplete" FROM SERVER.JS
        const response = await fetch('markComplete', {

            //METHOD USED
            method: 'put',

            //CONTENT USED
            headers: { 'Content-Type': 'application/json' },

            //CONVERT JSON TO STRING AND SENDS IT TO SERVER.JS
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        //ASSIGN THE RESPONSE TO A CONSTANT TO HAVE BETTER VISIBILITY WHEN USED BELOW
        const data = await response.json()

        //LOG THE RESPONSE
        console.log(data)

        //REFRESH
        location.reload()


        //LOG ANY ERRORS
    } catch (err) {
        console.log(err)
    }
}

async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {

        //FETCH "markUnComplete" FROM SERVER.JS
        const response = await fetch('markUnComplete', {

            //METHOD USED
            method: 'put',

            //CONTENT USED
            headers: { 'Content-Type': 'application/json' },

            //CONVERT JSON TO STRING AND SENDS IT TO SERVER.JS
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        //ASSIGN THE RESPONSE TO A CONSTANT TO HAVE BETTER VISIBILITY WHEN USED BELOW
        const data = await response.json()

        //LOG THE RESPONSE
        console.log(data)

        //REFRESH
        location.reload()


        //LOG ANY ERRORS
    } catch (err) {
        console.log(err)
    }
}