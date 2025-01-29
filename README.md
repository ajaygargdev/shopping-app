# Shopping Application

A Shopping application consists of a **frontend** and a **backend** using **Nodejs**. This Application allows user to add, remove product to cart, Change quantity of product in cart. Also can add,remove update product to application. Cart will sync realtime with other user as well as same user on other browser/system.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Features](#features)
3. [Project Setup](#project-setup)
   - [Frontend Setup](#frontend-setup)
   - [Backend Setup](#backend-setup)
4. [API Documentation](#api-documentation)
5. [Folder Structure](#folder-structure)

---

## Technologies Used

- **Backend**:
  - Node.js
  - MongoDB
  - Express
  - Web Socket
  - HTML Tamplate (EJS)

---

## Features

- Application is secure using authentication(Jwt Token).
- Manage products on Application Using CURD operations.
- User can add/remove/modify Cart.
- Realtime update Cart that is opened on different browser/device

---

## Project Setup

### Prerequisites:

    Node.js (v18 or above)

### Clone the repository:

- Clone git repository:

  ```bash
  git clone https://github.com/ajaygargdev/library-system.git
  ```

### Application Setup

1. Navigate to the `shopping-app` folder:

   ```bash
   cd shopping-app

   ```

2. Install the required dependencies:

   ```bash
   npm install

   ```

3. Set up environment variables:

   - Navigate to .env file in the back-end directory and add the following variables:

   ```env
        MONGO_URI=mongodb://localhost:27017/shopping-app
        JWT_SECRET=mysecretkey
        PORT=8000
        COOKIE_SECRET=mysecretkey
        SOCKET_PORT=8001

   ```

4. Start the React frontend:

   ```bash
   npm start
   ```

The Backend app will be running at http://localhost:8000.

## Application Routes

1. /

   - This is thie home page route for application user can buy product here.
   - If user in not authenticated, User will redirect to **/login**

2. /register

   - This route is for register to the application the cedential provided here will we used for buy product

3. /logout

   - This route is to logout from application. After logout user will be redirect to **/login**

4. /products

   - This route is for manage product in application.
   - This route can be navigate from menu.
   - This is secure route, User need to login to access this page.
   - user can use options **Add New Product**, **Edit**, **Delete** to perform CURD operations here

5. /products/new

   - This is secure route.
   - user can navigate it from **/product** by clicking on **Add New Product** button.
   - After add new product it will redirect to **/product**.

6. /products/edit/:id

   - id is required to navigate to modify product otherwise page will show error.
   - user can navigate it from **/product** by clicking on **Edit** button.
   - After modify product it will redirect to **/product**

7. /cart
   - This route can navigate from **/** route.
   - User can update quantity here using **+/-** button
   - User has option to remove product from cart using **Remove** button

## API Documentation

1. POST /api/auth/register

   - Description: Add user.
   - Request Body:

     ```json
     {
       "userName": "John doe",
       "email": "john@gmail.com",
       "password": "password"
     }
     ```

   - Response:
     - success: redirect to **/login**
     - error:
       - If any value is missing or username/password length is less then 8. Redirect to **/register** with error **All values are requied**.
       - If any other exception. Redirect to **/register** with error.

2. POST /api/auth/login

   - Description: Authnticate user.
   - Request Body:

     ```json
     {
       "email": "john@gmail.com",
       "password": "password"
     }
     ```

   - Response:
     - success: Jwt TOken will be added to signed cookie with key **token** and redirect to **/**
     - error:
       - If any value is missing. Redirect to **/login** with error **All values are requied**.
       - If email/password is wrong. Redirect to **/login** with error **Invalid email or password**
       - If any other exception. Redirect to **/login** with error.

3. POST /api/products

   - Description: Add new product to application.
   - Request:

     #### Headers

     - `Content-Type: multipart/form-data`

     #### Cookie

     - `token: <signed_cookie_Jwt_token>`

     #### Body (Form Data)

     - `name: <product_name>`,
     - `description: <product_description>`,
     - `price: <price>`,
     - `quantity: <quantity>`,
     - `image: <product_image>`

     ```json

     ```

   - Response:
     - success: redirect to **/products**
     - error:
       - If any value is missing. Redirect to **/products/new** with error **All values are requied**.
       - If any other exception. Redirect to **/products/new** with error.

4. PUT /api/products/:id or POST /api/products/:id?\_method=PUT

   - Description: update product of given id is url.
   - Request:

     #### Headers

     - `Content-Type: multipart/form-data`

     #### Cookie

     - `token: <signed_cookie_Jwt_token>`

     #### Body (Form Data)

     - `name: <product_name>`,
     - `description: <product_description>`,
     - `price: <price>`,
     - `quantity: <quantity>`,
     - `image: <product_image>`

     ```json

     ```

   - Response:
     - success: redirect to **/products**
     - error:
       - If any value is missing except image. Redirect to **/products/edit/:id** with error **All values are requied**.
       - If any other exception. Redirect to **/products/edit/:id** with error.

5. DELETE /api/products/:id or POST /api/products/:id?\_method=DELETE

   - Description: DELETE product of given id is url.
   - Request:

     #### Cookie

     - `token: <signed_cookie_Jwt_token>`

   - Response:
     - success: redirect to **/products**
     - error:
       - If any exception. Redirect to **/products** with error.

6. POST /api/cart

   - Description: Add product to cart.
   - Request:

     #### Cookie

     - `token: <signed_cookie_Jwt_token>`

     #### Body

     ```json
     {
       "productId": 1
     }
     ```

   - Response:
     - success: broadcast socket event to sync quantity and product in cart and redirect to **/**
     - error:
       - If any exception. Redirect to **/** with error.

7. PUT /api/cart/:id?\_qty=1 or POST /api/cart/:id?\_method=PUT&\_qty=1

   - Description: increase/decrease quantity of product in cart.
   - Request:
     #### Cookie
     - `token: <signed_cookie_Jwt_token>`
   - Response:
     - success: broadcast socket event to sync quantity and product in cart and redirect to **/cart**
     - error:
       - If any exception. Redirect to **/cart** with error.

8. DELETE /api/cart/:id?from=cart or POST /api/cart/:id?_method=DELETE&from=cart
   - Description: Remove product from cart.
   - Request:
     #### Cookie
     - `token: <signed_cookie_Jwt_token>`
   - Response:
     - success: broadcast socket event to sync quantity and product in cart. Also redirect to url inside query string  key **from** if key **from** is not exist redirect to **/** 
     - error:
       - If any exception. Redirect tto url inside query string key **from** if key **from** is not exist redirect to **/** with error.

## Folder Structure

        /Shopping-app
        ├── /
        ├── /src
        │   ├── /controller
        │   ├── /logger
        │   ├── /middleware
        │   ├── /model
        │   ├── /routes
        │   ├── /service
        │   ├── /static
        │   │   ├── /styles
        │   │   └── /uploads        
        │   ├── /views
        │   │   ├── /cart        
        │   │   ├── /partial
        │   │   ├── /products
        │   │   ├── index.ejs        
        │   │   ├── login.ejs
        │   │   └── register.ejs
        │   ├── constents.js
        │   ├── databaseServer.js
        │   ├── index.js
        │   ├── server.js
        │   └── webSocketServer.js 
        ├── .env                    
        ├── index.js
        ├── package-lock.json
        ├── package.json
        └── README.md