

const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return cookieValue;
    }
    return null;
};
document.addEventListener("DOMContentLoaded", () => {
    const token = getCookie("token");  // 🍪 Token from cookies


    if (!token) {
        alert("You need to login first!");
        return;
    }

    fetch("http://localhost:3000/api/getVendorProduct", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    })
        .then(response => response.json())
        .then(products => {
            populateTable(products),
                console.log(products);
        })
        .catch(error => console.error("Error fetching products:", error));
});

function deleteProduct(productId) {
    console.log(productId);
    const token = getCookie("token"); // 🍪 Token from cookies

    if (!token) {
        alert("You need to login first!");
        return;
    }

    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch(`http://localhost:3000/api/deleteVendorProduct/${productId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // 🔄 Page reload karega taaki deleted product list se hat jaye
        })
        .catch(error => console.error("Error deleting product:", error));
}





document.addEventListener("DOMContentLoaded", () => {
    const token = getCookie("token");

    if (!token) {
        alert("You need to login first!");
        return;
    }

    // 🔥 Edit Button Click Handler
    document.addEventListener("click", async (event) => {
        if (event.target.closest(".edit-btn")) {
            const row = event.target.closest("tr"); 
            const productId = row.dataset.id; 

            try {
                const response = await fetch(`http://localhost:3000/api/getVendorProductById/${productId}`,{
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const product = await response.json();

                if (!product) {
                    alert("Product not found!");
                    return;
                }

                // Modal show karo
                document.getElementById("editModal").classList.remove("hidden");

                // 📝 Form fields populate karo
                document.getElementById("editProductId").value = product._id;
                document.getElementById("editProductName").value = product.productName || "";
                document.getElementById("editDescription").value = product.description || "";
                document.getElementById("editCategory").value = product.category || "";
                document.getElementById("editBrand").value = product.brand || "";
                document.getElementById("editPrice").value = product.price || 0;
                document.getElementById("editDiscount").value = product.discount || 0;
                document.getElementById("editFinalPrice").value = product.finalPrice || product.price;
                document.getElementById("editStock").value = product.stock || 0;
                document.getElementById("editSize").value = product.size || "";
                document.getElementById("editColors").value = product.colors ? product.colors.join(", ") : "";

                // 🖼️ Images preview update karo
                const previewDiv = document.getElementById("editPreview");
                previewDiv.innerHTML = "";
                if (product.images && product.images.length > 0) {
                    product.images.forEach(image => {
                        const img = document.createElement("img");
                        img.src = `http://localhost:3000/${image}`;
                        img.classList.add("w-20", "h-20", "object-cover", "rounded-lg", "border", "border-gray-300", "shadow-md");
                        previewDiv.appendChild(img);
                    });
                }

            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        }
    });

    // 🔥 Form Submit Handler




    document.getElementById("editForm").addEventListener("submit", function (event) {
        event.preventDefault();
    
        const token = getCookie("token");  
        if (!token) {
            alert("You need to login first!");
            return;
        }
    
        const productId = document.getElementById("editProductId").value;
        const formData = new FormData();
    
        // 📝 Add form fields
        formData.append("productName", document.getElementById("editProductName").value);
        formData.append("description", document.getElementById("editDescription").value);
        formData.append("category", document.getElementById("editCategory").value);
        formData.append("brand", document.getElementById("editBrand").value);
        formData.append("price", document.getElementById("editPrice").value);
        formData.append("discount", document.getElementById("editDiscount").value);
        formData.append("finalPrice", document.getElementById("editFinalPrice").value);
        formData.append("stock", document.getElementById("editStock").value);
        formData.append("size", document.getElementById("editSize").value);
        formData.append("colors", document.getElementById("editColors").value);
    
        // 🖼 Add Multiple Images
        const imageInput = document.getElementById("editImages");
        if (imageInput.files.length > 0) {
            for (let i = 0; i < imageInput.files.length; i++) {
                formData.append("images", imageInput.files[i]); 
            }
        }
       
    
        fetch(`http://localhost:3000/api/editVendorProduct/${productId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}` // ❌ DO NOT ADD 'Content-Type'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data); 
            alert(data.message);
            closeModal(); 
            location.reload();
        })
        .catch(error => console.error("Error updating product:", error));
    });
    
    

});

// ❌ Close Modal Function
function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}





function populateTable(products) {
    console.log(products,'yesss');
    const tbody = document.querySelector("tbody"); // Table body select karo
    tbody.innerHTML = ""; // Purane rows hatao

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 py-4">No products found.</td></tr>`;
        return;
    }

    products.forEach(product => {
        const row = document.createElement("tr");
        row.classList.add("hover:bg-gray-50");
        row.dataset.id = product._id;  // ✅ Yeh line ensure karega ki productId row me set ho
    
        row.innerHTML = `
        <td class="px-4 py-3">
            <div class="flex items-center space-x-3">
               <img src="http://localhost:3000/${product.images.length > 0 ? product.images[0] : 'uploads/default.jpg'}" 
                 alt="${product.productName}" class="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-md">
                <div>
                    <p class="font-medium">${product.productName}</p>
                    <p class="text-sm text-gray-500">SKU: ${product._id.slice(-6)}</p>
                </div>
            </div>
        </td>
        <td class="px-4 py-3">${product.category}</td>
        <td class="px-4 py-3">
            <span class="px-2 py-1 bg-${product.stock > 10 ? 'green' : 'red'}-100 text-${product.stock > 10 ? 'green' : 'red'}-800 rounded-full text-sm">
                ${product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
        </td>
        <td class="px-4 py-3 text-right">₹${product.price}</td>
        <td class="px-4 py-3 flex justify-center space-x-2">
            <button class="p-2 hover:bg-gray-100 rounded-lg edit-btn">
                <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg text-red-500" onclick="deleteProduct('${product._id}')">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </td>
        `;
    
        tbody.appendChild(row);
    });
    
}
