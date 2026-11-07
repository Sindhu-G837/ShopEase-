let products = window.loadShopEaseProducts();
let orders = JSON.parse(localStorage.getItem("shopEaseOrders")) || [];

const productForm = document.getElementById("admin-product-form");
const productIdField = document.getElementById("admin-product-id");
const productNameField = document.getElementById("admin-product-name");
const productCategoryField = document.getElementById("admin-product-category");
const productPriceField = document.getElementById("admin-product-price");
const productImageField = document.getElementById("admin-product-image");
const productDescriptionField =
    document.getElementById("admin-product-description");
const productError = document.getElementById("admin-product-error");
const saveProductButton = document.getElementById("admin-save-product");
const cancelEditButton = document.getElementById("admin-cancel-edit");

function renderDashboard() {
    renderStats();
    renderProducts();
    renderOrders();
}

function renderStats() {
    const sales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    document.getElementById("admin-product-count").textContent = products.length;
    document.getElementById("admin-order-count").textContent = orders.length;
    document.getElementById("admin-sales-total").textContent = `₹${sales}`;
}

function renderProducts() {
    const tableBody = document.getElementById("admin-products-table");
    tableBody.replaceChildren();
    document.getElementById("admin-empty-products").hidden = products.length > 0;

    products.forEach(product => {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        name.textContent = product.name;
        const category = document.createElement("td");
        category.textContent = product.category;
        const price = document.createElement("td");
        price.textContent = `₹${product.price}`;
        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "admin-table-button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => startEditingProduct(product.id));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "admin-table-button admin-delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProduct(product.id));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        row.appendChild(name);
        row.appendChild(category);
        row.appendChild(price);
        row.appendChild(actions);
        tableBody.appendChild(row);
    });
}

function renderOrders() {
    const tableBody = document.getElementById("admin-orders-table");
    tableBody.replaceChildren();
    document.getElementById("admin-empty-orders").hidden = orders.length > 0;

    orders.slice().reverse().forEach(order => {
        const row = document.createElement("tr");
        [
            order.id,
            order.name,
            new Date(order.placedAt).toLocaleString(),
            `₹${order.total}`
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

function startEditingProduct(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) {
        return;
    }

    productIdField.value = product.id;
    productNameField.value = product.name;
    productCategoryField.value = product.category;
    productPriceField.value = product.price;
    productImageField.value = product.image;
    productDescriptionField.value = product.description;
    saveProductButton.textContent = "Save Changes";
    cancelEditButton.hidden = false;
    productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetProductForm() {
    productForm.reset();
    productIdField.value = "";
    productError.hidden = true;
    saveProductButton.textContent = "Add Product";
    cancelEditButton.hidden = true;
}

function saveProducts() {
    localStorage.setItem("shopEaseProducts", JSON.stringify(products));
}

productForm.addEventListener("submit", event => {
    event.preventDefault();
    productError.hidden = true;

    const imageUrl = productImageField.value.trim();
    let parsedImageUrl;
    try {
        parsedImageUrl = new URL(imageUrl);
    } catch {
        productError.textContent = "Enter a valid product image URL.";
        productError.hidden = false;
        return;
    }

    if (!["http:", "https:"].includes(parsedImageUrl.protocol)) {
        productError.textContent = "Product images must use an http or https URL.";
        productError.hidden = false;
        return;
    }

    const editingId = productIdField.value;
    const name = productNameField.value.trim();
    const duplicateName = products.some(product =>
        product.id !== editingId &&
        product.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicateName) {
        productError.textContent = "A product with this name already exists.";
        productError.hidden = false;
        return;
    }

    const newProductId = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const product = {
        id: editingId || `product-${newProductId}`,
        name,
        category: productCategoryField.value.trim(),
        price: Number(productPriceField.value),
        description: productDescriptionField.value.trim(),
        image: parsedImageUrl.href,
        imageAlt: name,
        fallbackImage: "assets/product-fallback.svg"
    };

    const previousProducts = products;
    if (editingId) {
        products = products.map(item => item.id === editingId ? product : item);
    } else {
        products = [...products, product];
    }

    try {
        saveProducts();
    } catch (error) {
        products = previousProducts;
        productError.textContent =
            "The product could not be saved in this browser. Check storage and try again.";
        productError.hidden = false;
        console.error("Unable to save product catalog.", error);
        return;
    }

    resetProductForm();
    renderDashboard();
});

function deleteProduct(productId) {
    const product = products.find(item => item.id === productId);
    if (!product || !window.confirm(`Delete "${product.name}" from the demo catalog?`)) {
        return;
    }

    const previousProducts = products;
    products = products.filter(item => item.id !== productId);
    try {
        saveProducts();
    } catch (error) {
        products = previousProducts;
        productError.textContent =
            "The product could not be deleted in this browser. Check storage and try again.";
        productError.hidden = false;
        console.error("Unable to delete product.", error);
        return;
    }

    if (productIdField.value === productId) {
        resetProductForm();
    }
    renderDashboard();
}

cancelEditButton.addEventListener("click", resetProductForm);
renderDashboard();
