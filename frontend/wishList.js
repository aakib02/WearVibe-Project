
    const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return cookieValue;
    }
    return null;
};








 function isUserLoggedIn() {
        return getCookie("token") !== null;  
    }
async function fetchCartData() {
    if (isUserLoggedIn()) {
        try {
            const token = getCookie("token"); 
            const res = await fetch("http://localhost:3000/api/getWishList", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log(data,'receive wishlist');
            if (data.success) {
                displayCartData(data.wishList);
            } else {
                console.log("Failed to fetch cart:", data.message);
            }
        } catch (error) {
            console.log("Error fetching cart data:", error);
        }
    } else {
        displayCartData(JSON.parse(localStorage.getItem("wishList")) || []);
    }
}

function displayCartData(wishList) {
    console.log("Cart data received in displayCartData:", wishList);
    const cartContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    cartContainer.innerHTML = ""; // Clear existing cart

    if (!wishList || wishList.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-16">
                <span class="material-symbols-outlined text-6xl text-gray-300">shopping_cart</span>
                <p class="mt-4 text-lg text-gray-500">Your cart is empty</p>
            </div>
        `;
        subtotalElement.innerText = "₹0.00";
        totalElement.innerText = "₹15.00";
        return;
    }

    let subtotal = 0;

    wishList.forEach((item, index) => {
        let itemTotal = item.finalPrice
        * item.quantity;
        subtotal += itemTotal;

        let colors = Array.isArray(item.colors) ? item.colors.join(", ") : "Not specified";
        let sizes = Array.isArray(item.sizes) ? item.sizes.join(", ") : "Not specified";

        cartContainer.innerHTML += `
            <div class="flex items-center justify-between border-b py-3">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="flex-grow px-4">
                    <h3 class="font-semibold">${item.name}</h3>
                    <p class="text-sm text-gray-500">${item.description || "No description available"}</p>
                    <p class="text-sm"><strong>Category:</strong> ${item.category || "Unknown"}</p>
                    <p class="text-sm"><strong>Colors:</strong> ${colors}</p>
                    <p class="text-sm"><strong>Sizes:</strong> ${sizes}</p>
                    <p class="text-sm"> <span class="text-lg font-bold">₹${item.finalPrice} </span>  <span class="line-through">${item.price}</span>   <span class="text-red-400  "> ${item.discount}% off </span></p>
                    <div class="flex items-center space-x-2 mt-2">
                        <button class="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300" onclick="updateCartQuantity('${item._id}', 'decrement', ${index})">-</button>
                        <span id="cart-item-${item._id}-quantity">${item.quantity}</span>
                        <button class="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300" onclick="updateCartQuantity('${item._id}', 'increment', ${index})">+</button>
                    </div>
                    <p class="text-sm text-green-600"><strong>Total Price:</strong> ₹${itemTotal}</p>
                </div>
                <button id="" class="text-red-500 hover:text-red-700" onclick="removeFromCart('${item._id}', ${index})">Remove</button>
            </div>
        `;
    });

    let shipping = 10.00;
    let tax = 5.00;
    let total = subtotal + shipping + tax;

    subtotalElement.innerText = `₹${subtotal.toFixed(2)}`;
    totalElement.innerText = `₹${total.toFixed(2)}`;
}

// Page load hone par cart data fetch karein
document.addEventListener("DOMContentLoaded", function () {
    fetchCartData();
});


function removeFromCart(productId, index) {
    if (isUserLoggedIn()) {
        removeItemFromBackend(productId);
    } else {
        removeItemFromLocalStorage(index);
    }
}

function removeItemFromBackend(productId) {
    const token = getCookie("token");
    console.log(productId);

    fetch(`http://localhost:3000/api/removeFromWishList/${productId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log("Item removed from backend successfully!");
            fetchCartData();
        } else {
            console.log("Failed to remove item from backend:", data.message);
        }
    })
    .catch(error => console.log("Error removing item from backend:", error));
}

function removeItemFromLocalStorage(index) {
    let wishList = JSON.parse(localStorage.getItem("wishList")) || [];
    if (index < 0 || index >= wishList.length) {
        console.log("Invalid index:", index);
        return;
    }
    wishList.splice(index, 1);
    localStorage.setItem("wishList", JSON.stringify(wishList));
    displayCartData(wishList);
}

function updateCartCount(count) {
    let cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}


document.getElementById("Checkout").addEventListener("click", function () {
    if (!isUserLoggedIn()) {
        window.location.href = "/frontend/src/components/Admin/login.html"; 
    } else {
        window.location.href = "address.html";
    }
});




async function updateCartQuantity(productId, action,index) {
    if (!isUserLoggedIn()) {
        updateLocalCartQuantity(productId, action,index);
        return;
    }

    try {
        const token = getCookie("token");
        const res = await fetch("http://localhost:3000/api/updateWishList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ productId, action }) // action: "increment" or "decrement"
        });
        const data = await res.json();
        if (data.success) {
            console.log(`Product ${action}ed in backend wishList`, data);
            // updateCartCount();
            fetchCartData(); // ✅ UI refresh
        
        } else {
            console.log("Failed to update wishlist quantity:", data.message);
        }
    } catch (error) {
        console.log("Error updating wishlist quantity:", error);
    }
  
}

function updateLocalCartQuantity(productId, action,index) {
    console.log(index,action);
    let wishList = JSON.parse(localStorage.getItem("wishList")) || [];

    if (index >= 0 && index < wishList.length) {
        if (action === "increment") {
            wishList[index].quantity += 1;
        } else if (action === "decrement") {
            if (wishList[index].quantity > 1) {
                wishList[index].quantity -= 1;
            } else {
                wishList.splice(index, 1); // Remove if quantity reaches 0
            }
        }

        localStorage.setItem("wishList", JSON.stringify(wishList));
        fetchCartData(); // Refresh cart UI
    }
}


