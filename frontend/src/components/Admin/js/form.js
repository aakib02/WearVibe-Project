document.getElementById("price").addEventListener("input", calculateFinalPrice);
document.getElementById("discount").addEventListener("input", calculateFinalPrice);


const fetchBrands = async () => {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        alert("Authentication failed! Please login again.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/getVendorBrand", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // 👈 Token bhejna zaroori hai
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        console.log(data.data, 'brand data');

        const brandSelect = document.getElementById("brand");
        brandSelect.innerHTML = '<option value="">Select Brand</option>'; // Reset dropdown

        data.data.forEach(brand => {
            const option = document.createElement("option");
            option.value = brand.name;  // Assuming API returns array of brand objects
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching brands:", error);
    }
};

// Call fetchBrands on page load
document.addEventListener("DOMContentLoaded", fetchBrands);







function calculateFinalPrice() {
    const price = parseFloat(document.getElementById("price").value) || 0;
    const discount = parseFloat(document.getElementById("discount").value) || 0;
    
    if (price > 0 && discount >= 0 && discount <= 100) {
        const discountAmount = (price * discount) / 100;
        const finalPrice = price - discountAmount;
        document.getElementById("finalPrice").value = finalPrice.toFixed(2);
    } else {
        document.getElementById("finalPrice").value = price.toFixed(2);
    }
}



document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("sizeDropdownToggle");
    const dropdown = document.getElementById("sizeDropdown");
    const selectedSizes = document.getElementById("selectedSizes");
    const checkboxes = document.querySelectorAll(".size-checkbox");
    const dropdownIcon = document.getElementById("dropdownIcon");

    toggle.addEventListener("click", function () {
        dropdown.classList.toggle("hidden");
        dropdownIcon.classList.toggle("rotate-180");
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            let selected = [];
            checkboxes.forEach(cb => {
                if (cb.checked) selected.push(cb.value);
            });
            selectedSizes.textContent = selected.length > 0 ? selected.join(", ") : "Select Sizes";
        });
    });

    document.addEventListener("click", function (event) {
        if (!toggle.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add("hidden");
            dropdownIcon.classList.remove("rotate-180");
        }
    });
});







document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 

    const formData = new FormData();

    formData.append("productName", document.getElementById("productName").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("discount", document.getElementById("discount").value);
    formData.append("finalPrice", document.getElementById("finalPrice").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("brand", document.getElementById("brand").value);
    // formData.append("sizes", document.getElementById("sizes").value);
    formData.append("colors", document.getElementById("colors").value);
    formData.append("stock", document.getElementById("stock").value);


 // ✅ **Selected Sizes 
 const selectedSizes = [];
 document.querySelectorAll(".size-checkbox:checked").forEach(checkbox => {
     selectedSizes.push(checkbox.value);
 });

 formData.append("sizes", JSON.stringify(selectedSizes)); 



//    token get from cookies 
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        alert("Authentication failed! Please login again.");
        return;
    }

    const files = fileInput.files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
    }







    try {
        const response = await fetch("http://localhost:3000/api/createProduct", {
            method: "POST",
            body: formData,
            credentials: "include", 
            headers: {
                "Authorization": `Bearer ${token}`, 
            }
        });

        const result = await response.json();
        console.log("Server Response:", result);

        if (response.ok) {
            alert("Product created successfully!");
            document.getElementById("productForm").reset();
            preview.innerHTML = "";
        } else {
            alert("Error creating product");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
