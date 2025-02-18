

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
    const priceRange = document.getElementById("priceRange");
    const maxPriceLabel = document.getElementById("maxPriceLabel");

    priceRange.addEventListener("input", function () {
        maxPriceLabel.innerText = `₹${priceRange.value}`;
        fetchFilteredProducts();
    });

    searchInput.addEventListener("input", function () {
        fetchFilteredProducts();
    });

    async function fetchFilteredProducts() {
        const query = searchInput.value.trim();
        const maxPrice = priceRange.value; // ✅ Get max price from slider

        // ✅ Extract category from URL
        const pathSegments = window.location.pathname.split("/").filter(Boolean);
        let category = pathSegments[pathSegments.length - 1].replace(".html", "").toLowerCase();
        if (!["men", "woman", "kids", "couple"].includes(category)) {
            category = "all";
        }

        try {
            const res = await fetch(`http://localhost:3000/api/search?q=${query}&category=${category}&maxPrice=${maxPrice}`);
            const data = await res.json();

            if (data.success) {
                renderSearchResults(data.data);
            } else {
                console.log("No results found.");
            }
        } catch (error) {
            console.log("Search error:", error);
        }
    }
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
                         onclick="addToCart('${product._id}', '${product.productName}', ${product.finalPrice}, 'http://localhost:3000/${product.images.length > 0 ? product.images[0] : 'uploads/default.jpg'}')">
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


function addToCart(productId) {
    console.log(`Product ${productId} added to cart`);
}


const fetchNavbar = async () => {
    try {
        // const token = getCookie("token");  // 🍪 Token from cookies
        // console.log("Token from Cookie:", token);

        // if (!token) {
        //     console.log("No token found!");
        //     return;
        // }

        const res = await fetch("http://localhost:3000/api/navbar", {
            // headers: { Authorization: `Bearer ${token}` },
            // credentials: "include"  // 🛡️ Ensures cookies are sent
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
        
     
    } catch (error) {
        console.log("Error fetching navbar:", error);
    }
};


const fetchProfile = async () => {
    try {
        const token = getCookie("token");  // 🍪 Token from cookies
        console.log("Token from Cookie:", token);
    
        if (!token) {
            console.log("No token found!");
            return;
        }
    
        const res = await fetch("http://localhost:3000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include"  // 🛡️ Ensures cookies are sent
        });
    
        const data = await res.json();
        console.log("Navbar Data:", data); // ✅ Debugging API response
        document.getElementById("profile").innerHTML = `Hello ${data.user.fullName}`;
        document.getElementById("userMail").innerHTML = ` ${data.user.email}`;
    } catch (error) {
        console.log("Error fetching profile:", error);
    }
    }


document.addEventListener("DOMContentLoaded", fetchNavbar,fetchProfile);
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
            const res = await fetch("http://localhost:3000/api/getAllProduct");
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
                           <button class="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50" 
    onclick='addToWishlist(
        "${product._id}", 
        "${product.productName.replace(/"/g, '&quot;')}", 
        ${product.finalPrice}, 
        "http://localhost:3000/${product.images.length > 0 ? product.images[0] : 'uploads/default.jpg'}",
        "${product.category || ''}", 
        ${JSON.stringify(product.colors || [])}, 
        ${JSON.stringify(product.sizes || [])}
    )'>
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
                 <button class="bg-blue-500 text-white px-4 py-2 mt-3 w-full rounded-lg hover:bg-blue-600 transition transform hover:scale-105" 
    onclick='addToCart(
        "${product._id}", 
        "${product.productName.replace(/"/g, '&quot;')}", 
        ${product.finalPrice}, 
        "http://localhost:3000/${product.images.length > 0 ? product.images[0] : 'uploads/default.jpg'}",
        ${product.price || 0}, 
        "${product.description.replace(/"/g, '&quot;') || ''}", 
        "${product.category || ''}", 
        ${product.discount || 0}, 
        ${JSON.stringify(product.colors || [])}, 
        ${JSON.stringify(product.sizes || [])}
    )'>
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




  
    function addToWishlist(productId, productName, finalPrice, imageUrl, category, colors, sizes) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
        // Check if product already exists in wishlist
        const existingProduct = wishlist.find(item => item.id === productId);
        if (!existingProduct) {
            wishlist.push({ 
                id: productId, 
                name: productName, 
                finalPrice: finalPrice, 
                image: imageUrl, 
                category: category, 
                sizes: sizes, 
                colors: colors
            });
        }
    
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistCount();
    }
    
    // Update wishlist count
    function updateWishlistCount() {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        document.getElementById("favorite-count").innerText = wishlist.length;
    }
    
    // Ensure wishlist count updates on page load
    document.addEventListener("DOMContentLoaded", function () {
        updateWishlistCount();
    });
    
    
    function isUserLoggedIn() {
        return getCookie("token") !== null;  // Agar token hai toh user logged in hai
    }


async function addToCart(productId, productName, finalPrice, imageUrl, price, description, category, discount, colors, sizes) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (isUserLoggedIn()) {
        try {
            const token = getCookie("token");
            const res = await fetch("http://localhost:3000/api/createCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    cart: [{
                        id: productId,
                        name: productName,
                        price: price,
                        finalPrice: finalPrice,
                        image: imageUrl,
                        description: description,
                        category: category,
                        sizes: sizes,
                        colors: colors,
                        discount: discount,
                        quantity: 1
                    }]
                })
            });

            const data = await res.json();
            if (data.success) {
                console.log("Product added to backend cart:", data);
                updateCartCount();
            } else {
                console.log("Failed to add product to backend cart:", data.message);
            }
        } catch (error) {
            console.log("Error adding product to backend cart:", error);
        }
    } else {
        // Store in localStorage if user is not logged in
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: price,
                finalPrice: finalPrice,
                image: imageUrl,
                description: description,
                category: category,
                sizes: sizes,
                colors: colors,
                discount: discount,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }
}


    
async function syncCartToBackend() {
    if (!isUserLoggedIn()) return;

    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length === 0) return;

    try {
        const token = getCookie("token");
        const res = await fetch("http://localhost:3000/api/createCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ cart: localCart })
        });

        const data = await res.json();
        if (data.success) {
            console.log("Local cart synced to backend!");
            localStorage.removeItem("cart");
        }
    } catch (error) {
        console.log("Error syncing cart:", error);
    }
}

// Call syncCartToBackend() when user logs in
document.addEventListener("DOMContentLoaded", function () {
    syncCartToBackend();
    updateCartCount();
});

    
    // ✅ Call sync function when page loads (if user is logged in)
    document.addEventListener("DOMContentLoaded", function () {
        syncCartToBackend();
        updateCartCount();
    });
    

        
    // ✅ Update cart count from backend if user is logged in
    async function updateCartCount() {
        if (isUserLoggedIn()) {
            try {
                const token = getCookie("token");
                const res = await fetch("http://localhost:3000/api/cart/count", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    document.getElementById("cart-count").innerText = data.count;
                    return;
                }
            } catch (error) {
                console.log("Error fetching cart count from backend:", error);
            }
        }
    
        // Fallback: Use localStorage if user is not logged in
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cart-count").innerText = totalQuantity;
    }

    document.addEventListener("DOMContentLoaded", fetchProducts);



