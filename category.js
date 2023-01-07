
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

var filterTemplate = document.getElementById('filter-template').textContent;
var compiledFilters = Handlebars.compile(filterTemplate);
var filterPlaceholder = document.getElementById('filter-placeholder');

fetch('https://wiki-shop.onrender.com/categories/'+categoryId+'/subcategories')
    .then(res => res.json())
    .then(data => {
        var content = compiledFilters({ subcategories : data}) ;
        filterPlaceholder.innerHTML = content;
    })
    .catch(error => console.log(error))

    if (document.getElementById('').checked) {
        rate_value = document.getElementById('r1').value;
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
        