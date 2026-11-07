# ShopEase

ShopEase is a beginner-friendly, front-end e-commerce demonstration built with HTML, CSS, and vanilla JavaScript. It includes a customer storefront with product browsing, a shopping cart, wishlist, and demo checkout, along with a separate Demo Admin Dashboard for managing the local product catalog and viewing demo orders.

This project is intended for learning and demonstration, including a CodeAlpha internship submission. It has no backend, and its login, admin features, and data storage are not secure production services.

## Features

### Customer storefront

- Browse the product catalog, including product images, prices, and descriptions.
- Search products by name and filter by product category.
- Open a product details view.
- Add products to a shopping cart, change item quantities, and remove items.
- Save products to a wishlist, add them to the cart, or remove them from the wishlist.
- Create a demo account and log in using browser `localStorage`.
- Complete a demo checkout with customer and delivery details.
- View a demo order confirmation and previous orders, including order details.
- Persist the cart, wishlist, product catalog, account, and order history in browser storage.

### Demo Admin Dashboard

- View the number of products and orders, plus the total value of recorded demo orders.
- Add products with a name, category, price, image URL, and description.
- Edit or delete products in the catalog.
- Review completed demo orders.
- Persist product and order data in browser `localStorage`.

The dashboard is a demonstration only. It does not have secure admin authentication.

## Technologies

- **HTML** — page structure and forms
- **CSS** — layout, styling, and responsive presentation
- **JavaScript** — storefront, cart, wishlist, checkout, and dashboard interactions
- **Browser storage** — `localStorage` and `sessionStorage` for demonstration data

## Project structure

All project files are in the root folder:

```text
Code Alpha_E-commerce/
├── index.html          # Customer storefront, cart, wishlist, and checkout
├── admin.html          # Demo Admin Dashboard page
├── login.html          # Demo login page
├── signup.html         # Demo account registration page
├── order-sucess.html   # Demo order confirmation page (filename as provided)
├── README.md           # Project documentation
├── style.css           # Styles shared by the pages
├── script.js           # Storefront and customer interaction logic
├── admin.js            # Demo dashboard and product management logic
└── product-data.js     # Default demonstration product catalog
```

## Run the project with VS Code Live Server

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. In the VS Code Explorer, right-click `index.html` and choose **Open with Live Server**.
4. The storefront opens in your browser. Use the navigation links to browse the store or open the Demo Admin Dashboard.

Running the site through Live Server provides a local web origin for browser storage and page navigation. No build step or backend setup is required.

## Customer usage

1. Browse the products on the storefront. Use the search field or category buttons to narrow the catalog.
2. Select a product to view its details, or choose **Add to Cart**.
3. Use the wishlist control to save or remove products. The wishlist section also lets you add saved products to the cart.
4. In the cart, use **+**, **−**, or **Remove** to adjust items.
5. Select **Proceed to Checkout**, enter your name, email, Indian mobile number, and delivery address, then choose **Place Demo Order**.
6. Review the confirmation page. Completed demo orders also appear in **Order History** on the storefront.
7. To register or log in, open `signup.html` or `login.html` from the same Live Server origin; the two pages link to each other. Use **Back to Shopping** to return to the storefront. Account handling is for demonstration only; shopping and checkout are not secure or backend-authenticated.

## Demo Admin Dashboard usage

1. Open **Demo Admin Dashboard** from the storefront navigation.
2. Use **Manage Products** to add an item. Provide a product name, category, price, image URL, and description.
3. Select **Edit** beside a product to update it, or **Delete** to remove it from the local catalog.
4. View the summary counts and totals, and see completed demo checkouts in **Customer Orders**.
5. Use **Back to Store** to return to the storefront.

There is no admin sign-in or role protection. Anyone who can open the page in this browser can use its demo controls.

## Screenshots

Replace these placeholders with screenshots captured from your running project before submission:

- **Storefront:** `[Add storefront screenshot here]`
- **Product details and cart:** `[Add product details/cart screenshot here]`
- **Demo Admin Dashboard:** `[Add dashboard screenshot here]`
- **Order confirmation:** `[Add order confirmation screenshot here]`

## Limitations

- The project is front-end only. There is no backend, API, or server-side database.
- Login and registration store demonstration account information in browser `localStorage`; this is not secure authentication and must not be used for real credentials.
- Admin functions are not protected by secure authentication or authorization.
- Products and orders are saved only in the current browser's storage and are not shared across browsers or devices. Clearing browser data can remove them.
- Checkout is for demonstration only. The available payment option is demo Cash on Delivery; no real payment gateway or payment processing is connected.
- Checkout and order confirmation do not contact a shipping service or send an actual confirmation email.
- Product images use external image URLs and may require an internet connection.

Do not enter real passwords, payment information, or sensitive customer or business data.

## Future enhancements

- Add a secure backend, database, and server-side validation.
- Implement real authentication and authorization for customer and admin roles.
- Integrate a payment provider in a properly secured environment.
- Add order status management, inventory tracking, and shipping updates.
- Add product sorting, richer filters, and improved catalog administration.
- Add automated tests and deployment configuration.

---

**Project:** ShopEase  
**Submission context:** CodeAlpha internship demonstration
