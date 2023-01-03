
var URLvar = window.location.search;

var params = new URLSearchParams(URLvar);
var categoryId = parseInt(params.get("categoryId"));

var productsTemplate = document.getElementById('products-template').textContent;
var compiledProducts = Handlebars.compile(productsTemplate);
var productsPlaceholder = document.getElementById('products-placeholder');

fetch('https://wiki-shop.onrender.com/categories/'+categoryId+'/products')
    .then(res => res.json())
    .then(data => {
        var content = compiledProducts({ products : data}) ;
        productsPlaceholder.innerHTML = content;
    })
    .catch(error => console.log(error))

function toggleMobileMenu(menu){
    menu.classList.toggle('open');
}