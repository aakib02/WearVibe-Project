const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return cookieValue;
    }
    return null;
};


async function fetchCartData() {
    try {
        const token = getCookie("token"); // Token se user ki authentication karein
        const res = await fetch("http://localhost:3000/api/getCart", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        console.log(data);

        if (data.success && Array.isArray(data.cart)) {
   // ✅ Total MRP Calculation (Original Price)
   const totalMRP = data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// ✅ Total Amount Calculation (Final Price after Discount)
const totalAmount = data.cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);

// ✅ Total Discount Calculation
const totalDiscount = totalMRP - totalAmount;

// ✅ HTML mein values update karna
document.getElementById("totalMRP").innerText = `₹${totalMRP.toFixed(2)}`;
document.getElementById("totalDiscount").innerText = `-₹${totalDiscount.toFixed(2)}`;
document.getElementById("totalAmount").innerText = `₹${totalAmount.toFixed(2)}`;
           
        }
    } catch (error) {
        console.log("Error fetching cart data:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchCartData();
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


document.getElementById('codOption').addEventListener('change', function() {
    let codAvailable = false; // Change this dynamically as needed
    document.getElementById('codMessage').classList.toggle('hidden', codAvailable);
});


async function startPayment() {
    try {
        const res = await fetch("http://localhost:3000/api/createOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 500, currency: "INR" }) // Amount ₹500
        });

        const { order } = await res.json();
    
  
        const options = {
            key: "rzp_test_7fj2aHwMfwBL0b", // Razorpay Key
            amount: order.amount,
            currency: order.currency,
            name: "WearVibe",
            description: "Fashion Purchase",
            order_id: order.id,
            handler: async function (response) {
                await verifyPayment(response);
            },
            prefill: { email: "aakibt554@gmail.com", contact: "7357322673" }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Payment failed:", error);
    }
}

async function verifyPayment(response) {
    const verifyRes = await fetch("http://localhost:3000/api/payment/verifyPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
    });

    const data = await verifyRes.json();
    if (data.success) {
        alert("Payment Successful! 🎉");
        window.location.href = "/order-success.html";
    } else {
        alert("Payment Failed! ❌");
    }
}
