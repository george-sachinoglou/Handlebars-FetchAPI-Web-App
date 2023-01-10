var URLvar = window.location.search;
var params = new URLSearchParams(URLvar);
var categoryId = parseInt(params.get("categoryId"));
var productsTemplate = document.getElementById('products-template').textContent;
var compiledProducts = Handlebars.compile(productsTemplate);
var productsPlaceholder = document.getElementById('products-placeholder');
var filterTemplate = document.getElementById('filter-template').textContent;
var compiledFilters = Handlebars.compile(filterTemplate);
var filterPlaceholder = document.getElementById('filter-placeholder');
var loginform = document.getElementById('login');
var buyform = document.getElementById('buyform');
var loggedin = document.getElementById('loggedin');
var httpstatus = document.getElementById('httpstatus');

fetch('https://wiki-shop.onrender.com/categories/'+categoryId+'/products')
    .then(res => res.json())
    .then(data => {
        var content = compiledProducts({ products : data})
        productsPlaceholder.innerHTML = content;
        let buybuttons = document.querySelectorAll('.buy');
        buybuttons.forEach(button => { button.addEventListener("click",handleBuy)});
    })
    .catch(error => console.log(error))

fetch('https://wiki-shop.onrender.com/categories/'+categoryId+'/subcategories')
    .then(res => res.json())
    .then(data => {
        var content = compiledFilters({ subcategories : data})
        filterPlaceholder.innerHTML = content;
    })
    .catch(error => console.log(error))

    //login credentials: 
    //u: George, p:1234
    //u: John, p:4321
loginform.onsubmit = event => {
    event.preventDefault();
    var body = { username: event.target.children[0].children["username"].value, 
    password : event.target.children[0].children["password"].value};
    fetch('/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data.sessionId);
        loginform.style.display = "none";
        loggedin.style.display = "inline-block"
        httpstatus.style.display = "inline-block"
        loggedin.innerHTML = data.sessionId;
        httpstatus.innerHTML = data.status;
        if(httpstatus.innerHTML == "S200"){
            document.getElementById("cart").style.display = "inline-block";
            document.getElementById("cartcount").style.display = "inline-block";
            document.getElementById("itemsincart").style.display = "inline-block";
        }
    })
}

function handleBuy(b){
    if(httpstatus.innerHTML != "S200") alert("Please login to add products to cart.")
    else{
        var products = document.querySelectorAll('.pr');
        for(var i in products){
            if(products[i].dataset.productId == b.target.id){
                var body = {pid: b.target.id, ptitle: products[i].dataset.productTitle, pcost: products[i].dataset.productCost, username: document.getElementById("username").value, sessionId: document.getElementById("loggedin").innerHTML}
                break;
            }
         }
        fetch('/buy', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data.msg);
            alert(data.msg);
            if(data.msg == 'Expired sessionID') {
                return;
            }
            
        })
        var body = {username: document.getElementById('username').value}
        fetch('/updatecart', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(data =>{
            console.log("count:" + data.count);
            document.getElementById('cartcount').innerHTML = data.count;
            console.log(document.getElementById('cartcount').innerHTML)
        })
        
            
    }
}

function toggleMobileMenu(menu){
    menu.classList.toggle('open');
}

function getRadioValue(radioObject) {
    var value = null;
    var products = document.getElementsByClassName('pr');
    var subid;
    for (var i=0; i<radioObject.length; i++) {
         if (radioObject[i].checked) {
              value = radioObject[i].value;
              break ;
         }
    }
    if(value != null){
        if(value == "all")
        {
            for(var i in products){
                products[i].style.display = "inline-block";
             }
             return;
        }
        for(var i in products){
            subid = products[i].dataset.subcategoryId;
            if(value == subid){
                products[i].style.display = "inline-block";
            }else{
                products[i].style.display = "none";
            }
            
         }

    }
}

function showCart(){
    alert("cart")
}
        