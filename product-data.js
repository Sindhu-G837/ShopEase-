window.shopEaseDefaultProducts = [
    {
        id: "product-1",
        name: "Headphones",
        category: "electronics",
        price: 999,
        description: "Enjoy clear, immersive sound with these comfortable headphones, ideal for music, videos, and everyday listening.",
        image: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&crop=entropy&w=960&h=960&q=90",
        imageAlt: "Headphones",
        fallbackImage: "assets/headphones-fallback.svg"
    },
    {
        id: "product-2",
        name: "Smart Watch",
        category: "electronics",
        price: 1499,
        description: "Track your daily activity and stay connected with this versatile smart watch, designed for convenient everyday use.",
        image: "https://images.unsplash.com/photo-1624096104992-9b4fa3a279dd?auto=format&fit=crop&crop=entropy&w=960&h=960&q=90",
        imageAlt: "Smart Watch",
        fallbackImage: "assets/smart-watch-fallback.svg"
    },
    {
        id: "product-3",
        name: "Backpack",
        category: "accessories",
        price: 799,
        description: "Carry your daily essentials in this practical backpack, with a roomy design for school, work, or travel.",
        image: "https://images.unsplash.com/photo-1622560481979-f5b0174242a0?auto=format&fit=crop&crop=entropy&w=960&h=960&q=90",
        imageAlt: "Backpack",
        fallbackImage: "assets/backpack-fallback.svg"
    }
];

window.shopEasePreviousDefaultImages = {
    "product-1": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=max&w=1000&q=85",
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=max&w=1000&q=85",
        "https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=max&w=1200&q=90"
    ],
    "product-2": [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=max&w=1000&q=85",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=max&w=1000&q=85",
        "https://images.unsplash.com/photo-1624096104992-9b4fa3a279dd?auto=format&fit=max&w=1200&q=90"
    ],
    "product-3": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=max&w=1000&q=85",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=max&w=1000&q=85",
        "https://images.unsplash.com/photo-1622560481979-f5b0174242a0?auto=format&fit=max&w=1200&q=90"
    ]
};

window.loadShopEaseProducts = function() {
    const savedProducts = localStorage.getItem("shopEaseProducts");
    if (savedProducts === null) {
        const defaultProducts = window.shopEaseDefaultProducts.map(
            product => ({ ...product })
        );
        localStorage.setItem("shopEaseProducts", JSON.stringify(defaultProducts));
        return defaultProducts;
    }

    let catalogNeedsSave = false;
    const storedProducts = JSON.parse(savedProducts);
    const products = storedProducts.map(product => {
        const defaultProduct = window.shopEaseDefaultProducts.find(
            item => item.id === product.id
        );
        const previousImages = window.shopEasePreviousDefaultImages[product.id];
        const image = defaultProduct &&
            previousImages &&
            previousImages.includes(product.image)
            ? defaultProduct.image
            : product.image;
        const fallbackImage = product.fallbackImage ||
            (defaultProduct && defaultProduct.fallbackImage) ||
            "assets/product-fallback.svg";

        if (
            image !== product.image ||
            fallbackImage !== product.fallbackImage
        ) {
            catalogNeedsSave = true;
        }

        return { ...product, image, fallbackImage };
    });

    if (catalogNeedsSave) {
        localStorage.setItem("shopEaseProducts", JSON.stringify(products));
    }

    return products;
};
