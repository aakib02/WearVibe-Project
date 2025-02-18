document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    console.log("Login form submitted!");

    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Get error message elements
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Clear previous error messages
    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');

    let isValid = true;

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.classList.remove('hidden');
        isValid = false;
    }

    // Validate password
    if (password.length < 6) {
        passwordError.classList.remove('hidden');
        isValid = false;
    }

    if (!isValid) return; 


    const formdata = { email, password };
    console.log("Form Data:", formdata);

    try {
        console.log("Before fetch:", JSON.stringify(formdata));
        const response = await fetch('http://localhost:3000/api/loginUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formdata),
        });

        console.log("After fetch, waiting for response...");
        const data = await response.json();
        console.log("Server Response:", data);

        if (response.ok) {
            alert('Login successful!');

            document.cookie = `token=${data.data.token}; path=/; max-age=3600; secure; samesite=strict`;

            if (data.data.role === 'customer') {
                window.location.href = "/frontend/all.html";
            } else if (data.data.role === 'admin') {
                window.location.href = "admindash.html";
            } else if (data.data.role === 'vendor') {
                window.location.href = "vendordash.html";
            } else {
                alert("Unknown role! Cannot redirect.");
            }
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Something went wrong. Please try again.");
    }
});

