var categoriesTemplate = document.getElementById('categories-template').textContent;
var compiledCategories = Handlebars.compile(categoriesTemplate);
var categoriesPlaceholder = document.getElementById('categories-placeholder');

fetch('https://wiki-shop.onrender.com/categories')
    .then(res => res.json())
    .then(data => {
        var content = compiledCategories({ categories : data}) ;
        categoriesPlaceholder.innerHTML = content;
    })
    .catch(error => console.log(error))



function toggleMobileMenu(menu){
    menu.classList.toggle('open');
}


