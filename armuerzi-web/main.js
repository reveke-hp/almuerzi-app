let mealsState = []
let user = {}
let ruta = 'login' // login, register, orders

//funcion para transformar string en html
const stringToHTML = (s) => {
    const parser = new DOMParser() // auxiliar
    const doc = parser.parseFromString(s,'https://vercel.com/hernannicolaus-gmailcom/almuerzi-5or6xszen-hernans-projects') //compando transformador
    return doc.body.firstChild
}



//creo plantilla de elementos a renderizar
const renderItem = (item) =>{
    const element = stringToHTML(`<li data-id="${item._id}">${item.name}</li>`) 
    //escuchador de elementos
    element.addEventListener('click',()=>{
        const mealsList = document.getElementById('meals-list') // busco meals-list
        Array.from(mealsList.children).forEach(x=> x.classList.remove('selected'))
        element.classList.add('selected')
        const mealsIdInput = document.getElementById('meals-id')
        mealsIdInput.value = item._id
    })
    return element
}

const renderOrder = (order,meals) =>{
    const meal = meals.find(meal => meal._id === order.meal_id)
    const element = stringToHTML(`<li data-id="${order._id}">${meal.name} - ${order.user_id}</li>`) 
}

const inicializaFormulario = () =>{
    const orderForm = document.getElementById('order')
    orderForm.onsubmit = (e) => { // e de evento
        e.preventDefault() 
        const submit = document.getElementById('submit')
        submit.setAttribute('disabled',true)
        const mealID = document.getElementById('meals-id')
        const mealIdValue = mealID.value
        if (!mealIdValue){
            alert('Debe seleccionar un plato')
            submit.removeAttribute('disable')
            return
        }
        const order = {
            meal_id: mealIdValue,
            user_id: user._id,
        }
        fetch('https://vercel.com/hernannicolaus-gmailcom/almuerzi-5or6xszen-hernans-projects/api/orders',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json' //aclaro al servidor tipo de datos que le envio 
            },
            body: JSON.stringify(order)
        }).then(x => x.json())
            .then(respuesta =>{
                const renderOrder = renderOrder(respuesta, mealsState)
                const ordersList = document.getElementById('orders-list')
                ordersList.appendChild(renderOrder)
                submit.removeAttribute('disabled')
            })
    }
}

const inicializaDatos = () =>{
    fetch('https://vercel.com/hernannicolaus-gmailcom/almuerzi-5or6xszen-hernans-projects/api/meals')
    .then(response => response.json())
    .then(data =>{
        mealsState = data
        const mealsList = document.getElementById('meals-list') // busco meals-list
        const submit = document.getElementById('submit') // busco boton submit
        const listItems = data.map(renderItem)
        mealsList.removeChild(mealsList.firstElementChild()) //remuevo hijos
        listItems.forEach(element => mealsList.appendChild(element)) // agrego elementos a la plantilla
        submit.removeAttribute('disabled') // elimino el atributo del boton
        fetch('URL')
            .then(response => response.json)
            .then(ordersData =>{
                const orderList = document.getElementById('orders-list')
                const listOrders = ordersData.map(ordersData => renderOrder)
                orderList.removeChild(orderList.firstElementChild)
                listOrders.forEach(element => ordersList.appendChild(element))
            })
    })
}

const renderApp = () =>{
    const token = localStorage.getItem('token')
    if (token) {
        user = JSON.parse(localStorage.getItem('user'))
        return renderOrders()
    }
    renderLogin()
}

const renderOrders = () =>{
    const ordersView = document.getElementById('orders-view')
    document.getElementById('app').innerHTML = ordersView.innerHTML
    inicializaFormulario()
    inicializaDatos()
}

const renderLogin = () =>{
    const loginTemplate = document.getElementById('login-template')
    document.getElementById('app').innerHTML = loginTemplate.innerHTML

    const loginForm = document.getElementById('login-form')
    loginForm.onsubmit = (e) =>{
        e.preventDefault() // el evento se previene para que la pagina no se vea refrescada
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        fetch('https://vercel.com/hernannicolaus-gmailcom/almuerzi-5or6xszen-hernans-projects/api/auth/login',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({email,password})
        }).then(x => x.json())
          .then(respuesta => {
            localStorage.setItem('token',respuesta.token) // guardo el elemento dentro del localstorage
            ruta = 'orders'
            return respuesta.token
          })
          .then(x =>{
            fetch('https://vercel.com/hernannicolaus-gmailcom/almuerzi-5or6xszen-hernans-projects/api/auth/me',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                }
            })
          })
          .then(x =>x.json())
          .then(fetchedUser => {
            localStorage.setItem('user',fetchedUser)
            user = fetchedUser
            renderOrders()
          })
    }
}

window.onload = () =>{
    renderApp()

}