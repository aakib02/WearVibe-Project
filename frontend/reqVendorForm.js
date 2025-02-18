document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.querySelector('input[name="phone"]');
    const zipInput = document.querySelector('input[name="zip"]');
    const emailInput = document.querySelector('input[name="email"]');
    const form = document.getElementById("productForm");

    // Token get from cookies
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        alert("Authentication failed! Please login again.");
        return;
    }

    // Function to allow only numbers
    function allowOnlyNumbers(event) {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }

    // Phone Number Validation (Only 10 digits)
    phoneInput.addEventListener("keypress", allowOnlyNumbers);
    phoneInput.addEventListener("input", function () {
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    // ZIP/Postal Code Validation (Only 6 digits)
    zipInput.addEventListener("keypress", allowOnlyNumbers);
    zipInput.addEventListener("input", function () {
        if (this.value.length > 6) {
            this.value = this.value.slice(0, 6);
        }
    });

    // Email Validation (Basic Format Check)
    emailInput.addEventListener("input", function () {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.value)) {
            this.setCustomValidity("Please enter a valid email address");
        } else {
            this.setCustomValidity("");
        }
    });

    // Form Submission Handler
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default submission

        // Validate Phone Number
        if (phoneInput.value.length !== 10) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        // Validate ZIP Code
        if (zipInput.value.length !== 6) {
            alert("ZIP/Postal code must be exactly 6 digits.");
            return;
        }

        // Validate Email Format
        if (!emailInput.checkValidity()) {
            alert("Please enter a valid email address.");
            return;
        }

        // Collect all form data into an object
        const formData = {
            vendorName: form.vendorName.value,
            businessName: form.businessName.value,
            email: form.email.value,
            phone: form.phone.value,
            BusinessAddress: form.BusinessAddress.value,
            city: form.city.value,
            state: form.state.value,
            zip: form.zip.value,
            gstNumber: form.gstNumber.value,
            taxId: form.taxId.value,
            brandName: form.brandName.value,
        };

    

        try {
            const response = await fetch("http://localhost:3000/api/createVendor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData), // Sending JSON data
            });

            const result = await response.json();
// console.log(result);
            if (response.ok) {
                alert("Vendor request submitted successfully!");
                form.reset(); // Reset form after successful submission
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit vendor request.");
        }
    });
});
