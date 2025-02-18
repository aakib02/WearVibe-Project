

const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return cookieValue;
    }
    return null;
};




document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");

    searchInput.addEventListener("input", async function () {
        const query = searchInput.value.trim();

        if (query === "") {
            location.reload();  // ✅ Empty input pe refresh
            return;
        }

        if (query.length < 2) return; // ✅ Short queries avoid karna

        // ✅ Extract category from URL
        const pathSegments = window.location.pathname.split("/").filter(Boolean); // Empty elements remove
        let category = pathSegments[pathSegments.length - 1].replace(".html", "").toLowerCase();

        if (!["men", "woman", "kids", "couple"].includes(category)) {
            category = "all"; // ✅ Default category agar match na ho
        }

        console.log("Detected category:", category); // 🛑 Debugging ke liye

        try {
            const res = await fetch(`http://localhost:3000/api/search?q=${query}&category=${category}`);
            const data = await res.json();

            if (data.success) {
                renderSearchResults(data.data);
            } else {
                console.log("No results found.");
            }
        } catch (error) {
            console.log("Search error:", error);
        }
    });
});


function renderSearchResults(products) {
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = ""; // Clear current results

    if (products.length === 0) {
        productGrid.innerHTML = "<p class='text-gray-500 col-span-4'>No products match your search.</p>";
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <img src="http://localhost:3000/${product.images.length > 0 ? product.images[0] : 'uploads/default.jpg'}" 
                     alt="${product.productName}" class="w-full h-48 object-cover rounded-t-lg">
                <h3 class="font-medium mt-2">${product.productName}</h3>
                <p class="text-sm text-gray-500">${product.category}</p>
                <p class="text-gray-600 text-sm">${product.description.substring(0, 60)}...</p>
                <span class="font-bold text-lg">₹${product.finalPrice}</span>
                ${product.discount ? `<span class="text-red-500 text-xs"> (${product.discount}% OFF)</span>` : ''}
                <button class="bg-blue-500 text-white px-4 py-2 mt-3 w-full rounded-lg hover:bg-blue-600 transition transform hover:scale-105" 
                        onclick="addToCart('${product._id}')">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.innerHTML += productCard;
    });
    searchInput.value = "";
    // 🔄 Refresh the page after search results are displayed
    setTimeout(() => {
        location.reload();
    }, 1500); // 1.5 seconds delay to let the results appear before refresh
}

const fetchNavbar = async () => {
    try {
        const token = getCookie("token");  // 🍪 Token from cookies
        console.log("Token from Cookie:", token);

        if (!token) {
            console.log("No token found!");
            return;
        }

        const res = await fetch("http://localhost:3000/api/navbar", {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include"  // 🛡️ Ensures cookies are sent
        });

        const data = await res.json();
        console.log("Navbar Data:", data); // ✅ Debugging API response

        if (!data.navbarLinks) {
            console.log("Navbar links missing in API response!");
            return;
        }

        const navLinks = document.getElementById("nav-links");

        navLinks.innerHTML = data.navbarLinks
            .map(link => `<li><a href="/frontend${link.path}.html" class="hover:underline" onclick="navigateToPage('${link.path}')">${link.name}</a></li>`)
            .join("");
        
        document.getElementById("profile").innerHTML = `Hello ${data.user.fullName}`;
        document.getElementById("userMail").innerHTML = ` ${data.user.email}`;
    } catch (error) {
        console.log("Error fetching navbar:", error);
    }
};






document.addEventListener("DOMContentLoaded", fetchNavbar);
        document.addEventListener("DOMContentLoaded", function () {
            const slider = document.getElementById("imageSlider");
            const images = slider.getElementsByTagName("img");
            const dots = document.querySelectorAll(".dot");
            let index = 0;
            let interval;

            function updateSlider() {
                slider.style.transform = `translateX(-${index * 100}%)`;
                dots.forEach((dot, i) => {
                    dot.classList.toggle("bg-black", i === index);
                    dot.classList.toggle("bg-gray-300", i !== index);
                });
            }

            function startSlider() {
                interval = setInterval(() => {
                    index = (index + 1) % images.length;
                    updateSlider();
                }, 1000); // Slide every 1 seconds
            }

            function stopSlider() {
                clearInterval(interval);
            }

            dots.forEach((dot, i) => {
                dot.addEventListener("click", () => {
                    index = i;
                    updateSlider();
                });
            });

            slider.parentElement.addEventListener("mouseenter", startSlider);
            slider.parentElement.addEventListener("mouseleave", stopSlider);

            updateSlider(); // Initialize the first dot as active
        });
        


// add to cart  


const cartCount = document.getElementById('cart-count');
const favoriteCount = document.getElementById('favorite-count');

function addToCart() {
    let count = parseInt(cartCount.innerText);
    cartCount.innerText = count + 1;
}

function addToWishlist() {
    let count = parseInt(favoriteCount.innerText);
    favoriteCount.innerText = count + 1;
}

function shareProduct(productName) {
    const url = `https://wa.me/?text=Check out this product: ${productName}`;
    window.open(url, '_blank');
}

// Search functionality for colors
document.getElementById('colorSearch').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const colorButtons = document.querySelectorAll('#colorOptions button');
    colorButtons.forEach(button => {
        const color = button.style.backgroundColor;
        if (color.toLowerCase().includes(searchValue)) {
            button.style.display = 'inline-block';
        } else {
            button.style.display = 'none';
        }
    });
});

// Search functionality for brands
document.getElementById('brandSearch').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const brandLabels = document.querySelectorAll('#brandOptions label');
    brandLabels.forEach(label => {
        const brandText = label.innerText.toLowerCase();
        if (brandText.includes(searchValue)) {
            label.style.display = 'flex';
        } else {
            label.style.display = 'none';
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const avatarButton = document.getElementById("avatarButton");
    const userDropdown = document.getElementById("userDropdown");

    avatarButton.addEventListener("click", function () {
        userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
        if (!avatarButton.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.add("hidden");
        }
    });
});




 const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/getManProduct");
            const data = await res.json();
                 console.log(data.data,"data aa gya hai...");
            const Product = data.data     
            if (!data.data || !Array.isArray(data.data)) {
                console.log("Invalid product data received.");
                return;
            }

            const productGrid = document.getElementById("product-grid");
            productGrid.innerHTML = ""; // Clear existing content

            Product.forEach(product => {
                console.log(product.images,"hii");
                const productCard = `
                    <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                        <div class="relative overflow-hidden">
<div class="relative w-full h-64 overflow-hidden">
    <!-- First Image (Default) -->
    <img src="http://localhost:3000/${product.images.length > 0 ? product.images[0] : 'uploads/default.jpg'}" 
         alt="Product Image" 
         class="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 opacity-100 hover:opacity-0">
         
    <!-- Second Image (On Hover) -->
    <img src="http://localhost:3000/${product.images.length > 1 ? product.images[1] : product.images[0]}" 
         alt="Product Image" 
         class="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 opacity-0 hover:opacity-100">
</div>



                            <div class="absolute top-3 right-3 flex flex-col gap-2">
                                <button class="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50" onclick="addToWishlist()">
                                    <span class="material-symbols-outlined text-red-500">favorite</span>
                                </button>
                                <button class="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50" onclick="shareProduct('${product.name}')">
                                    <span class="material-symbols-outlined">share</span>
                                </button>
                            </div>
                            ${product.discount ? `<div class="absolute top-3 left-3"><span class="bg-red-500 text-white px-2 py-1 rounded-full text-xs">-${product.discount}%</span></div>` : ''}
                        </div>
                        <div class="p-4">
                            <div class="flex items-center gap-1 mb-2">
                                ${Array(5).fill().map((_, i) => `<span class="material-symbols-outlined text-${i < product.ratings ? 'yellow' : 'gray'}-400 text-sm">star</span>`).join('')}
                              
                            </div>
                            <h3 class="font-medium">${product.description}</h3>
                            <p class="text-sm text-gray-500">${product.category}</p>
                          
                            <div class="flex items-center justify-between mt-3">
                                <div class="space-x-0.5">
                                    <span class="font-bold text-lg">₹${product.finalPrice}</span>
                                    ${product.price ? `<span class="text-sm text-gray-500 line-through">₹${product.price}</span>` : ''}
                                      <span class="text-amber-500 text-xs"> %(${product.discount} OFF)</span>
                                </div>
                            </div>
                            <div class="flex gap-2 mt-3">
                                ${product.sizes.map(size => `<button class="w-8 h-8 rounded-full border hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center text-sm">${size}</button>`).join('')}
                            </div>
                            <button class="bg-blue-500 text-white px-4 py-2 mt-3 w-full rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105" onclick="addToCart()">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                productGrid.innerHTML += productCard;
            });
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };

    document.addEventListener("DOMContentLoaded", fetchProducts);



