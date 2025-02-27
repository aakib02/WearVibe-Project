// // URL se product ID extract karo



document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    try {
        const res = await fetch(`http://localhost:3000/api/getProductDetails/${productId}`);
        const data = await res.json();
        const product = data.data;
        console.log(product);
        // Product Name
        document.getElementById("productName").innerText = product.productName;

        // Price & Discount
        document.getElementById("finalPrice").innerText = `₹${product.finalPrice}`;
        document.getElementById("originalPrice").innerText = `₹${product.price}`;
        document.getElementById("discount").innerText = `${product.discount}% off`;

        // Description
        document.getElementById("productDescription").innerText = product.description;

        // Stock Update
        document.getElementById("stockStatus").innerText = `Stock: ${product.stock}`;

        // Colors
        const colorContainer = document.getElementById("colorOptions");
        colorContainer.innerHTML = ""; // Clear old colors
        product.colors[0].split(',').forEach(color => {
            const colorBtn = document.createElement("button");
            colorBtn.classList.add("w-8", "h-8", "rounded-full", "border", "m-1");
            colorBtn.style.backgroundColor = color;
            colorContainer.appendChild(colorBtn);
        });

        // Sizes
        const sizeContainer = document.getElementById("sizeOptions");
        sizeContainer.innerHTML = ""; // Clear old sizes
        product.sizes.forEach(size => {
            const sizeBtn = document.createElement("button");
            sizeBtn.classList.add("w-12", "h-12", "border", "rounded-full", "hover:bg-gray-100", "transition-colors");
            sizeBtn.innerText = size;
            sizeContainer.appendChild(sizeBtn);
        });

        // Main Image Update
        const mainImage = document.getElementById("mainImage");
        mainImage.src = `http://localhost:3000/${product.images[0]}`;

        // Thumbnail Images
        const thumbnailContainer = document.getElementById("thumbnailContainer");
        thumbnailContainer.innerHTML = "";
        product.images.forEach(image => {
            const imgElement = document.createElement("img");
            imgElement.src = `http://localhost:3000/${image}`;
            imgElement.classList.add("thumbnail", "rounded", "cursor-pointer", "hover:opacity-75", "transition-opacity", "w-full", "h-48", "object-cover");
            imgElement.onclick = function () {
                changeMainImage(imgElement.src);
            };
            thumbnailContainer.appendChild(imgElement);
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
    }
});

// Function to change main image
function changeMainImage(src) {
    document.getElementById("mainImage").src = src;
}
