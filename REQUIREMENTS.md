# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application.

## API Endpoints

### Products

| End points                           | Description           | token | role check |          body          |
| :----------------------------------- | :-------------------- | :---: | :--------: | :--------------------: |
| GET `localhost:3000/products`        | get all products data |   ✖   |     ✖      |           ✖            |
| GET `localhost:3000/products/:id`    | get product info.     |   ✖   |     ✖      |           ✖            |
| POST `localhost:3000/products/`      | create a product      |   ✔   |     ✔      |    name&stock&price    |
| PUT `localhost:3000/products/`       | update a product      |   ✔   |     ✔      | name\|\|stock\|\|price |
| DELETE `localhost:3000/products/:id` | delete a product      |   ✔   |     ✔      |           ✖            |

### Customers

| End points                            | Description               | token | ID check |                        body                        |
| :------------------------------------ | :------------------------ | :---: | :------: | :------------------------------------------------: |
| POST `localhost:3000/customers/auth`  | log in and get back token |   ✖   |    ✖     |                 email && password                  |
| GET `localhost:3000/customers`        | get all customers data    | ✖ ##  |    ✖     |                         ✖                          |
| GET `localhost:3000/customers/:id`    | get customer info.        | ✖ ##  |    ✖     |                         ✖                          |
| POST `localhost:3000/customers/`      | add a customer            |   ✖   |    ✖     |     first_name & last_name? & password & email     |
| PUT `localhost:3000/customers/`       | update a customer         |   ✔   |    ✔     | first_name \|\| last_name \|\| password \|\| email |
| DELETE `localhost:3000/customers/:id` | delete a customer         |   ✔   |    ✔     |                         ✖                          |

### Orders

| End points                                                  | Description            | token | ID check |      body       |
| :---------------------------------------------------------- | :--------------------- | :---: | :------: | :-------------: |
| GET `localhost:3000/customer/:id/orders`                    | get all orders data    |   ✖   |    ✖     |        ✖        |
| GET `localhost:3000/customer/:id/orders/:id`                | get order info.        |   ✖   |    ✖     |        ✖        |
| POST `localhost:3000/customer/:id/orders/:id`               | add an order           |   ✔   |    ✔     |        ✖        |
| PUT `localhost:3000/customer/:id/orders/:id`                | update an order        |   ✔   |    ✔     | isOpen(boolean) |
| DELETE `localhost:3000/customer/:id/orders/:id`             | delete an order        |   ✔   |    ✔     |        ✖        |
| GET `localhost:3000/customer/:id/orders/:id/products`       | get all order products |   ✖   |    ✖     |        ✖        |
| GET `localhost:3000/customer/:id/orders/:id/product/:id`    | get order product      |   ✖   |    ✖     |        ✖        |
| PUT `localhost:3000/customer/:id/orders/:id/product/:id`    | update order product   |   ✔   |    ✔     |    quantity     |
| DELETE `localhost:3000/customer/:id/orders/:id/product/:id` | delete order product   |   ✔   |    ✔     |        ✖        |
| POST `localhost:3000/customer/:id/orders/:id/product/:id`   | add order product      |   ✔   |    ✔     |        ✖        |

**(updating & deleting and adding) a product to order routes will check order status first ,and will be rejected if order is closed.**

### Admins

| End points                         | Description               | token | ID check | role check |        body        |
| :--------------------------------- | :------------------------ | :---: | :------: | :--------: | :----------------: |
| POST `localhost:3000/admins/auth`  | log in and get back token |   ✖   |    ✖     |     ✖      |  name & password   |
| GET `localhost:3000/admins/`       | get all admins data       |   ✔   |    ✖     |     ✔      |         ✖          |
| GET `localhost:3000/admins/:id`    | get admin info.           |   ✖   |    ✖     |     ✖      |         ✖          |
| POST `localhost:3000/admins/`      | add an admin              |   ✔   |    ✖     |     ✔      |  name & password   |
| PUT `localhost:3000/admins/:id`    | update an admin           |   ✔   |    ✔     |     ✖      | name \|\| password |
| DELETE `localhost:3000/admins/:id` | delete an admin           |   ✔   |    ✔     |     ✖      |         ✖          |

_only super admin can get all admins data and add an admin_

**creating an admin will check first for name availability**

## Data Shapes

### Product

| column | data type           |
| ------ | ------------------- |
| id     | integer primary key |
| name   | varchar(50)         |
| price  | decimal             |
| stock  | integer             |

#### customers

| column     | data type           |
| ---------- | ------------------- |
| id         | integer primary key |
| first_name | varchar(50)         |
| last_name  | varchar(50)         |
| email      | varchar(250)        |
| password   | varchar(250)        |

#### Orders

| column      | data type                        |
| ----------- | -------------------------------- |
| id          | integer primary key              |
| customer_id | INTEGER REFERENCES customers(id) |
| status      | varchar(50)                      |

### Admins

| column   | data type           |
| -------- | ------------------- |
| id       | integer primary key |
| name     | varchar(50)         |
| role     | varchar(20)         |
| password | varchar(250)        |

### Order_Products

| column     | data type                       |
| ---------- | ------------------------------- |
| id         | integer primary key             |
| quantity   | integer                         |
| product_id | INTEGER REFERENCES products(id) |
| order_id   | INTEGER REFERENCES orders(id)   |
