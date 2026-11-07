let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("shopEaseWishlist")) || [];
let orderHistory = JSON.parse(localStorage.getItem("shopEaseOrders")) || [];
let products = [];
let selectedProduct = null;
const genericProductFallback = "assets/product-fallback.svg";

function setProductImage(image, source, fallbackSource) {
    image.dataset.originalSrc = source || fallbackSource;
    image.dataset.fallbackSrc = fallbackSource || genericProductFallback;
    image.dataset.fallbackApplied = "false";
    image.onerror = function() {
        if (this.dataset.fallbackApplied === "true") {
            return;
        }

        this.dataset.fallbackApplied = "true";
        this.src = this.dataset.fallbackSrc;
    };
    image.src = source || image.dataset.fallbackSrc;
}

function showMessage() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");

    cartItems.innerHTML = "";
    const cartCount = document.getElementById("cart-count");

const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

cartCount.textContent = itemCount;

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const li = document.createElement("li");

        const itemText = document.createElement("span");
        itemText.textContent =
            `${item.name} - ₹${item.price} × ${item.quantity} `;

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "−";
        decreaseButton.addEventListener("click", () => {
            changeQuantity(index, -1);
        });

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.addEventListener("click", () => {
            changeQuantity(index, 1);
        });

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            removeFromCart(index);
        });

        li.appendChild(itemText);
        li.appendChild(decreaseButton);
        li.appendChild(increaseButton);
        li.appendChild(removeButton);

        cartItems.appendChild(li);
    });

    totalElement.textContent = `Total: ₹${total}`;

    localStorage.setItem("shopEaseCart", JSON.stringify(cart));
    updateOrderSummary();
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

function toggleWishlist(productCard) {
    const productName = productCard.dataset.name;
    const wishlistIndex = wishlist.findIndex(item => item.name === productName);

    if (wishlistIndex === -1) {
        const image = productCard.querySelector("img");
        wishlist.push({
            name: productName,
            price: Number(productCard.dataset.price),
            image: image.dataset.originalSrc || image.src,
            imageAlt: image.alt,
            fallbackImage: image.dataset.fallbackSrc,
            description: productCard.dataset.description
        });
    } else {
        wishlist.splice(wishlistIndex, 1);
    }

    saveWishlist();
    displayWishlist();
}

function saveWishlist() {
    localStorage.setItem("shopEaseWishlist", JSON.stringify(wishlist));
}

function displayWishlist() {
    const wishlistItems = document.getElementById("wishlist-items");
    const emptyMessage = document.getElementById("empty-wishlist-message");
    const wishlistCount = document.getElementById("wishlist-count");
    const sectionCount = document.getElementById("wishlist-count-section");

    wishlistItems.innerHTML = "";
    wishlistCount.textContent = wishlist.length;
    sectionCount.textContent = wishlist.length;
    emptyMessage.hidden = wishlist.length > 0;

    wishlist.forEach(item => {
        const card = document.createElement("article");
        card.className = "wishlist-card";

        const image = document.createElement("img");
        image.alt = item.imageAlt;
        setProductImage(
            image,
            item.image,
            item.fallbackImage || genericProductFallback
        );

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = `Price: ₹${item.price}`;

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.textContent = "Add to Cart";
        addButton.addEventListener("click", () => {
            addToCart(item.name, item.price);
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "wishlist-remove";
        removeButton.textContent = "Remove from Wishlist";
        removeButton.addEventListener("click", () => {
            removeFromWishlist(item.name);
        });

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(addButton);
        card.appendChild(removeButton);
        wishlistItems.appendChild(card);
    });

    document.querySelectorAll(".product-card").forEach(productCard => {
        const isSaved = wishlist.some(
            item => item.name === productCard.dataset.name
        );
        const button = productCard.querySelector(".wishlist-toggle");

        button.textContent = isSaved
            ? "♥ Remove from Wishlist"
            : "♡ Add to Wishlist";
        button.setAttribute("aria-pressed", isSaved);
        button.classList.toggle("saved", isSaved);
    });
}

function removeFromWishlist(productName) {
    wishlist = wishlist.filter(item => item.name !== productName);
    saveWishlist();
    displayWishlist();
}

function initializeProductCatalog() {
    products = window.loadShopEaseProducts();

    const previousImages = window.shopEasePreviousDefaultImages;
    wishlist.forEach(item => {
        const defaultProduct = window.shopEaseDefaultProducts.find(
            product => product.name === item.name
        );
        const oldImageUrls = defaultProduct &&
            previousImages[defaultProduct.id];

        if (defaultProduct && oldImageUrls && oldImageUrls.includes(item.image)) {
            item.image = defaultProduct.image;
            item.fallbackImage = defaultProduct.fallbackImage;
            saveWishlist();
        }
    });

    renderProductCatalog();
    renderCategoryFilters();
}

function renderProductCatalog() {
    const productContainer = document.querySelector(".product-container");
    productContainer.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.productId = product.id;
        card.dataset.name = product.name;
        card.dataset.category = product.category;
        card.dataset.price = product.price;
        card.dataset.description = product.description;
        card.dataset.fallbackImage =
            product.fallbackImage || genericProductFallback;

        const detailsLink = document.createElement("a");
        detailsLink.href = "#product-detail";
        detailsLink.className = "product-details-trigger";
        detailsLink.setAttribute("aria-label", `View ${product.name} details`);
        detailsLink.addEventListener("click", event => {
            event.preventDefault();
            showProductDetails(card);
        });

        const image = document.createElement("img");
        image.alt = product.imageAlt || product.name;
        setProductImage(
            image,
            product.image,
            card.dataset.fallbackImage
        );

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = `Price: ₹${product.price}`;

        detailsLink.appendChild(image);
        detailsLink.appendChild(name);
        detailsLink.appendChild(price);

        const wishlistButton = document.createElement("button");
        wishlistButton.type = "button";
        wishlistButton.className = "wishlist-toggle";
        wishlistButton.addEventListener("click", () => toggleWishlist(card));

        const cartButton = document.createElement("button");
        cartButton.type = "button";
        cartButton.textContent = "Add to Cart";
        cartButton.addEventListener("click", () => {
            addToCart(product.name, Number(product.price));
        });

        card.appendChild(detailsLink);
        card.appendChild(wishlistButton);
        card.appendChild(cartButton);
        productContainer.appendChild(card);
    });
}

function renderCategoryFilters() {
    const filterContainer = document.querySelector(".category-filters");
    filterContainer.innerHTML = "";

    const categories = ["All", ...new Set(products.map(product => product.category))];
    categories.forEach((category, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = index === 0
            ? "category-filter active"
            : "category-filter";
        button.dataset.category = index === 0 ? "all" : category;
        button.setAttribute("aria-pressed", String(index === 0));
        button.textContent = index === 0
            ? category
            : category.replace(/\b\w/g, character => character.toUpperCase());
        button.addEventListener("click", () => filterByCategory(button));
        filterContainer.appendChild(button);
    });
}

function displayOrderHistory() {
    const historyList = document.getElementById("order-history-items");
    const emptyMessage = document.getElementById("empty-order-history-message");

    historyList.innerHTML = "";
    emptyMessage.hidden = orderHistory.length > 0;

    orderHistory.slice().reverse().forEach(order => {
        const card = document.createElement("article");
        card.className = "order-history-card";

        const heading = document.createElement("h3");
        heading.textContent = `Order ${order.id}`;

        const date = document.createElement("p");
        date.textContent = `Placed: ${new Date(order.placedAt).toLocaleString()}`;

        const productList = document.createElement("ul");
        order.items.forEach(item => {
            const product = document.createElement("li");
            product.textContent = `${item.name} × ${item.quantity}`;
            productList.appendChild(product);
        });

        const total = document.createElement("p");
        total.className = "order-history-total";
        total.textContent = `Total: ₹${order.total}`;

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.textContent = "View Details";

        const details = document.createElement("div");
        details.className = "order-history-details";
        details.hidden = true;
        detailsButton.setAttribute("aria-expanded", "false");
        detailsButton.addEventListener("click", () => {
            details.hidden = !details.hidden;
            detailsButton.textContent = details.hidden
                ? "View Details"
                : "Hide Details";
            detailsButton.setAttribute("aria-expanded", String(!details.hidden));
        });

        [
            `Customer: ${order.name}`,
            `Email: ${order.email}`,
            `Phone: ${order.phone}`,
            `Delivery address: ${order.address}`,
            `Payment method: ${order.paymentMethod} (demo only)`
        ].forEach(text => {
            const detail = document.createElement("p");
            detail.textContent = text;
            details.appendChild(detail);
        });

        const detailItems = document.createElement("ul");
        order.items.forEach(item => {
            const detailItem = document.createElement("li");
            detailItem.textContent =
                `${item.name} — ${item.quantity} × ₹${item.unitPrice} = ₹${item.lineTotal}`;
            detailItems.appendChild(detailItem);
        });
        details.appendChild(detailItems);

        card.appendChild(heading);
        card.appendChild(date);
        card.appendChild(productList);
        card.appendChild(total);
        card.appendChild(detailsButton);
        card.appendChild(details);
        historyList.appendChild(card);
    });
}

function showProductDetails(productCard) {
    selectedProduct = productCard;

    const image = productCard.querySelector("img");
    const detailImage = document.getElementById("detail-image");
    detailImage.alt = image.alt;
    setProductImage(
        detailImage,
        image.dataset.originalSrc || image.src,
        productCard.dataset.fallbackImage ||
            image.dataset.fallbackSrc ||
            genericProductFallback
    );
    document.getElementById("detail-name").textContent =
        productCard.dataset.name;
    document.getElementById("detail-price").textContent =
        `₹${productCard.dataset.price}`;
    document.getElementById("detail-description").textContent =
        productCard.dataset.description;

    document.getElementById("product-listing").hidden = true;
    document.getElementById("product-detail").hidden = false;
    document.getElementById("product-detail").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function showProductListing() {
    document.getElementById("product-detail").hidden = true;
    document.getElementById("product-listing").hidden = false;

    if (selectedProduct) {
        selectedProduct.querySelector(".product-details-trigger").focus();
    }
}

function addSelectedProductToCart() {
    if (!selectedProduct) {
        return;
    }

    addToCart(
        selectedProduct.dataset.name,
        Number(selectedProduct.dataset.price)
    );
}

function searchProducts() {
    const searchText = document
        .getElementById("search")
        .value.trim()
        .toLowerCase();

    const products = document.querySelectorAll(".product-card");
    const activeCategory = document.querySelector(".category-filter.active")
        .dataset.category;
    let visibleProducts = 0;

    products.forEach(product => {
        const productName = product
            .querySelector("h3")
            .textContent
            .toLowerCase();
        const matchesSearch = productName.includes(searchText);
        const matchesCategory =
            activeCategory === "all" ||
            product.dataset.category === activeCategory;
        const isVisible = matchesSearch && matchesCategory;

        product.style.display = isVisible ? "" : "none";
        if (isVisible) {
            visibleProducts++;
        }
    });

    document.getElementById("no-products-message").hidden =
        visibleProducts > 0;
}

function filterByCategory(selectedButton) {
    document.querySelectorAll(".category-filter").forEach(button => {
        const isSelected = button === selectedButton;
        button.classList.toggle("active", isSelected);
        button.setAttribute("aria-pressed", isSelected);
    });

    searchProducts();
}
initializeProductCatalog();
displayCart();
displayWishlist();
displayOrderHistory();
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add products first.");
        return;
    }

    document.getElementById("checkout-error").hidden = true;
    document.getElementById("checkout-form").style.display = "block";
    updateOrderSummary();

    document.getElementById("checkout-form").scrollIntoView({
        behavior: "smooth"
    });
}
document.getElementById("customer-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const nameField = document.getElementById("customer-name");
    const emailField = document.getElementById("customer-email");
    const phoneField = document.getElementById("customer-phone");
    const addressField = document.getElementById("customer-address");
    const checkoutError = document.getElementById("checkout-error");

    checkoutError.hidden = true;
    nameField.setCustomValidity(
        nameField.value.trim() ? "" : "Please enter your full name."
    );
    addressField.setCustomValidity(
        addressField.value.trim() ? "" : "Please enter your delivery address."
    );
    phoneField.setCustomValidity(
        /^(?:\+91(?: |-)?)?[6-9]\d{9}$/.test(phoneField.value.trim())
            ? ""
            : "Enter a valid 10-digit Indian mobile number, optionally with +91."
    );

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (cart.length === 0) {
        checkoutError.textContent =
            "Your cart is empty. Add a product before placing an order.";
        checkoutError.hidden = false;
        return;
    }

    const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity
    }));
    const total = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const order = {
        id: generateOrderId(),
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        phone: phoneField.value.trim(),
        address: addressField.value.trim(),
        paymentMethod: document.getElementById("payment-method").value,
        items: orderItems,
        total: total,
        placedAt: new Date().toISOString()
    };

    const previousOrders = localStorage.getItem("shopEaseOrders");
    try {
        sessionStorage.setItem("shopEaseOrder", JSON.stringify(order));
        localStorage.setItem(
            "shopEaseOrders",
            JSON.stringify([...orderHistory, order])
        );
        localStorage.setItem("shopEaseCart", JSON.stringify([]));
        orderHistory.push(order);
    } catch (error) {
        try {
            if (previousOrders === null) {
                localStorage.removeItem("shopEaseOrders");
            } else {
                localStorage.setItem("shopEaseOrders", previousOrders);
            }
            sessionStorage.removeItem("shopEaseOrder");
        } catch (rollbackError) {
            console.error("Unable to restore order storage after checkout failed.", rollbackError);
        }
        checkoutError.textContent =
            "We couldn't save your demo order in this browser. Your cart has not been cleared. Please check your browser storage settings and try again.";
        checkoutError.hidden = false;
        console.error("Unable to save the demo order.", error);
        return;
    }

    cart = [];
    window.location.href = "order-sucess.html";
});

function generateOrderId() {
    let orderId;

    do {
        const randomPart = window.crypto && window.crypto.randomUUID
            ? window.crypto.randomUUID().toUpperCase()
            : Math.random().toString(36).slice(2, 10).toUpperCase();

        orderId = `SE-${Date.now().toString(36).toUpperCase()}-${randomPart}`;
    } while (orderHistory.some(order => order.id === orderId));

    return orderId;
}

function updateOrderSummary() {
    const summaryItems = document.getElementById("summary-items");
    const summaryTotal = document.getElementById("summary-total");

    if (!summaryItems || !summaryTotal) return;

    summaryItems.innerHTML = "";

    let total = 0;
    const table = document.createElement("table");
    table.className = "order-summary-table";
    const tableHead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["Product", "Qty", "Unit price", "Subtotal"].forEach(label => {
        const heading = document.createElement("th");
        heading.scope = "col";
        heading.textContent = label;
        headerRow.appendChild(heading);
    });

    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement("tr");
        [
            item.name,
            item.quantity,
            `₹${item.price}`,
            `₹${itemTotal}`
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    summaryItems.appendChild(table);
    summaryTotal.textContent = `Total: ₹${total}`;
}

const savedAccount = JSON.parse(
    localStorage.getItem("shopEaseUser")
);

const loggedInUser = JSON.parse(
    localStorage.getItem("shopEaseSession")
);

const welcomeUser = document.getElementById("welcomeUser");
const loginLink = document.getElementById("loginLink");
const logoutButton = document.getElementById("logoutButton");
const isLoggedIn = Boolean(
    loggedInUser &&
    savedAccount &&
    loggedInUser.email === savedAccount.email
);

if (isLoggedIn) {
    welcomeUser.textContent = "Welcome, " + savedAccount.name + "!";
    loginLink.hidden = true;
    logoutButton.hidden = false;
} else {
    welcomeUser.textContent = "Welcome, Guest!";
    loginLink.hidden = false;
    logoutButton.hidden = true;
}

logoutButton
.addEventListener("click", function() {

    // Removes the login session only. shopEaseUser (the account) stays.
    localStorage.removeItem("shopEaseSession");

    alert("You have logged out successfully!");

    window.location.href = "login.html";
});
