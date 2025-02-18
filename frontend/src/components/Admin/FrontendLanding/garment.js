let cart = [];
let wishlist = [];  // Array to store wishlist items
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const cartIcon = document.getElementById('cart-icon');
const wishlistIcon = document.getElementById('wishlist-icon');
const cartModal = document.getElementById('cart-modal');
const wishlistModal = document.getElementById('wishlist-modal'); // Added for wishlist modal
const cartItemsList = document.getElementById('cart-items-list');
const wishlistItemsList = document.getElementById('wishlist-items-list'); // Added for wishlist items list
const closeCartButton = document.getElementById('close-cart');
const closeWishlistButton = document.getElementById('close-wishlist'); // Added for closing wishlist modal

// Elements for Add to Cart and Add to Wishlist buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const addToWishlistButtons = document.querySelectorAll('.wishlist-heart');

// Function to update the cart count in the navbar
function updateCartCount() {
    cartCount.innerText = cart.length;
}

// Function to update the wishlist count in the navbar
function updateWishlistCount() {
    wishlistCount.innerText = wishlist.length;
}

// Add event listener for "Add to Cart" button
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productName = e.target.dataset.product;
        const productPrice = e.target.dataset.price;

        // Add item to the cart
        cart.push({ name: productName, price: productPrice });
        updateCartCount(); // Update the cart count in navbar
    });
});

// // Add event listener for "Add to Wishlist" button
// addToWishlistButtons.forEach(button => {
// //     button.addEventListener('click', (e) => {
// //         const productName = e.target.closest('button').previousElementSibling.dataset.product; // Get product name from the button's data-product

// //         // Add item to the wishlist (if it's not already in the wishlist)
// //         if (!wishlist.includes(productName)) {
// //             wishlist.push(productName);
// //             updateWishlistCount(); // Update the wishlist count in navbar
// //         }
// //     });
// // });
//const addToWishlistButtons = document.querySelectorAll('.wishlist-heart');  // Ensure these buttons exist in the DOM

addToWishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productName = e.target.closest('button').previousElementSibling.dataset.product;  // Get product name

        // Retrieve the current wishlist from localStorage or initialize it
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        // If the product is not already in the wishlist, add it
        if (!wishlist.includes(productName)) {
            wishlist.push(productName);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));  // Save the updated wishlist to localStorage
            console.log("Wishlist Updated:", wishlist);  // Debugging: Check updated wishlist
        }
    });
});
// Event listener for cart icon click (to show the cart modal)
cartIcon.addEventListener('click', () => {
    // Show the cart modal
    cartModal.classList.remove('hidden');

    // Update the cart modal with the added items
    cartItemsList.innerHTML = ''; // Clear previous items
    cart.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.innerText = `${item.name} - $${item.price}`;
        cartItemsList.appendChild(itemElement);
    });
});

// Event listener for wishlist icon click (to show the wishlist modal)
wishlistIcon.addEventListener('click', () => {
    // Show the wishlist modal
    wishlistModal.classList.remove('hidden');

    // Update the wishlist modal with the added items
    wishlistItemsList.innerHTML = ''; // Clear previous items
    wishlist.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.innerText = item; // Display only the product name in wishlist
        wishlistItemsList.appendChild(itemElement);
    });
});

// Event listener for closing the cart modal
closeCartButton.addEventListener('click', () => {
    cartModal.classList.add('hidden'); // Close the cart modal
});

// Event listener for closing the wishlist modal
closeWishlistButton.addEventListener('click', () => {
    wishlistModal.classList.add('hidden'); // Close the wishlist modal
});




