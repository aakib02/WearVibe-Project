document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Form submission prevent karein
    console.log("Form submitted!"); // Debugging log

    // Clear previous error messages
    document.getElementById('fullNameError').classList.add('hidden');
    document.getElementById('emailError').classList.add('hidden');
    document.getElementById('passwordError').classList.add('hidden');
    document.getElementById('confirmPasswordError').classList.add('hidden');

    // Get form values correctly
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const formdata = { fullName, email, password, confirmPassword };
    console.log(formdata); // Debugging log

    // Validate full name
    if (!fullName) {
        document.getElementById('fullNameError').classList.remove('hidden');
        return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').classList.remove('hidden');
        return;
    }

    // Validate password
    if (password.length < 6) {
        document.getElementById('passwordError').classList.remove('hidden');
        return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').classList.remove('hidden');
        return;
    }

    // ✅ **Async/Await ke saath fetch request**
    try {
        const response = await fetch('http://localhost:3000/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formdata)
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (data.success) {
            alert("Registration successful! ✅");
        } else {
            alert("Registration failed: " + data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong! ❌");
    }
});
