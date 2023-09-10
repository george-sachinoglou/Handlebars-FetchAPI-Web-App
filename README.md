# Web App (AUEB Course)

We have been given the Web API to access the products of an e-shop. This API allows access to the categories and subcategories of the products, as well as
the products of a chosen category, through appropriate HTTP GET requests to the server https://wiki-shop.onrender.com/. The following requests are supported, the results of which are in JSON format:
* GET /categories: Returns a list of the product categories with attributes:
  * id: integer, primary key
  * title: string
  * img_url: string
* GET /categories/:id/subcategories: Returns a list with the subcategories of a specific product category, which is specified by the :id attribute of the GET path. Every subcategory is defined by the following attributes:
  * id: integer, primary key
  * category_id: integer
  * title: string
* GET /categories/:id/products: Returns a list with the products of a specific category, which is determined by the :id attribute of the GET path. Every product is defined by the following attributes:
  * id: integer, primary key
  * title: string
  * subcategory_id: integer
  * description: string
  * cost: integer
  * image: string (url)

The project is split into four different parts:
* [Part 1: Browse product categories](Part-1-Browse-product-categories)
* [Part 2: Filter products by sub-category](Part-2-Filter-products-by-sub-category)
* [Part 3: Add products to cart](Part-3-Add-products-to-cart)
* [Part 4: View cart](Part-4-View-cart)
  
## Part 1: Browse product categories

The application will support user navigation in the product categories and
the products of each category. Navigation will be implemented entirely on the Web
Browser leveraging the Fetch API to call the WikiShop API. The appearance of the product categories
as well as the products of each category will be done with dynamic HTML generation
code and by attaching it to appropriate places on the web pages. HTML code generation
it will be done using the [Handlebars](https://handlebarsjs.com/guide/) library and appropriate HTML templates.

The home page (index.html) will display the categories data
products available in the store, displaying a description and an image for each category
with the proper layout on the page. The image of each category will embed a hyperlink
to the category page (category.html), where we list the products of the selected category.

The product list of the category.html page will include information about all of the
products of the category, displaying, for each product, the following information: title, description,
product, image and price. The category code will be encoded as a parameter
query on index.html page URLs (eg /category.html?categoryId=1), in a way 
so that when the category.html page is opened, the page's JavaScript code can
have access to the category code through the query parameters of the Browser line addresses (see the relevant Browser API [here](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams#browser_compatibility)).


## Part 2: Filter products by sub-category

Enrich the category.html page that presents the products of the selected category,
with the functionality to filter the products based on the sub-category in which
they belong. Specifically, when category.html is loaded, the
sub-categories of the current category will be also received, using the WikiShop API. The sub-categories will
appear in an appropriate side menu as a list of hyperlinks or radio buttons. While
selecting any sub-category, the products will be filtered and displayed will be
only those belonging to the sub-category (based on their subcategory_id attribute
products). The list of options will also include the "All" option, which will allow the
display of all products in the category. This setting will be defaulted upon
loading the page.

**Note:** Category products will be downloaded only once during loading
of the category.html page using the Fetch API. When selecting a filter,
the list of products will be adjusted for display and appropriate HTML content will be generated without making additional HTTP requests to download the products. 
For your convenience, it is recommended to encode both radio inputs and HTML elements
that describe the products appropriate information such as (product-id, subcategory-id etc.) with
use of HTML data-* attributes (eg data-product-id). These features are accessible
via JS from an HTML element via the dataset attribute (eg element.dataset.productId).

## Part 3: Add products to cart

**User identification**
Successful identification (login) is a prerequisite for adding products to a user's cart. 
Identification will be done through an HTML form (Identification Form), which will appear in an appropriate area of ​​the category.html page
(e.g. on the top right side of the page) and will receive the username and password as input
of the user. The form submission will be done via the Fetch API and will include an
appropriate web service call (Login Service – LS).

Implement the LS service so that it's called using an appropriate HTTP method, to an
appropriately selected URL and to receive from the client the necessary information for the
user identification (username, password). The service will return an appropriate response code,
in case of successful authentication, as well as a JSON object with a unique
login reader which will be in the form:
{ “sessionId”: “1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed” }
The unique code will be generated with the help of the uuid library. Depending on the code
response, an appropriate message will be displayed to the user in the area of the Form
Identification.

For implementation simplicity, in case of reloading the category.html page, the user's authentication state will be lost and identification will be once again required
in order to be able to add products to the cart.

### **Add product to cart**
Enrich the category.html page with the ability to add products to the cart
of the user's purchases. Specifically, each displayed product on the page will include a
button (e.g. Buy button) which, when pressed, calls the appropriate web service (Cart Item Service - CIS),
which will then add one unit of the product to the current user's shopping cart. If
the "Buy" button is pressed again for a product already in the user's cart, the quantity
of the product in the cart will be increased by one.

Implement the CIS service so that it's called using an appropriate HTTP method, to an
appropriately selected URL and to receive from the client the necessary data (data
product, username, sessionId) to add a specific product to the shopping cart
of the corresponding user. The service will check if the specific username corresponds to the
sessionId in order to prevent products from being added by non-identified users. 
The service will return an appropriate response code according to
its outcome. The product data sent by the Customer by calling the service
CIS, will also be utilized within the framework of Part 4.

Since successful user authentication is a prerequisite for adding products to
basket, in case the user is not identified, pressing the Buy button
will show an error message (eg "Please login to add products to cart").

### **Display product amount**
The total number of products available in the current user's shopping cart will
appear in an appropriate area of ​​the category.html page (Shopping Cart area) 
and will be renewed with the addition of a product. In case of reloading
the category.html page the number of products in the user's cart will be taken from
the server immediately after the successful authentication of the user.

The number of products will be retrieved by calling an appropriate web service (Cart Size
Service – CSS). Implement the CSS service so that it is called using proper HTTP
method, to an appropriately selected URL and to receive from the customer the necessary data
to get the shopping cart size of a selected user (username, sessionId).
On successful execution it will return a JSON object of the form { “size”: 10 },
where the size attribute will correspond to the number of products in the user's cart.

### **Admissions**
When implementing CIS, LS, and CSS web services, make the following assumptions:

* the implementation of the above CIS, LS and CSS services will be done on the Node.js platform
using the express framework,

* the server will maintain a shopping cart for each user, which will be maintained
when the user navigates the pages of the application,

* users' shopping carts will be lost when the server is restarted,
  * baskets will only be kept if the server has
    access to a real database,
    > For our database we used [MongoDB](https://www.mongodb.com/)

* when starting the application, it will automatically create a series of users with
specific usernames and passwords, in order to be able to demonstrate
functionality of the application,
> We instead created the users manually by adding their credentials to the database.

## Part 4: View cart

>⚠️ Part 4 was not implemented

Add the appropriate link to the "Shopping Cart" area, which will lead to the page
cart.html, which will display the contents of a specific users' shopping cart. 
Identification of the user will be done with appropriate query parameters at the
URL of the page (eg cart.html?username=bzafiris&sessionId=1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed). When loading cart.html, the values ​​of
of the query parameters will be received using JavaScript code (corresponding to PX 1) and
a request will be made to the server in order to download the contents of the users' cart.

The items of the product basket will be displayed in a table format, where each line will
correspond to a product in the cart and will include the data: product name,
product cost, product quantity. Just below the table, you will see the
total cost of the cart. The production of the corresponding HTML content will
done using Handlebars templates.

The contents of the product cart will be retrieved by calling a web service (Cart
Retrieval Service – CRS). Implement CRS to be called using proper HTTP
method, to an appropriately selected URL and to receive from the client the necessary data
(username, sessionId) to view the shopping cart. The service will check if the
specific username corresponds to the sessionId connection identifier, in order to
prevent unauthorized users from accessing the shopping cart.

## Limitations/implementation details

>### Architecture: 
>The application is based on the Client-Server architecture. The
>Client section will be implemented as a series of HTML pages that will embed
>JavaScript code. The server will be implemented as a Node.js application, which
>will be called by the Client via hyperlinks or HTTP requests using Fetch
>API

