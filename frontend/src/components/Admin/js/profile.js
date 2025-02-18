document.addEventListener('DOMContentLoaded', () => {
    // Load the saved profile data (if any) when the page is loaded
    loadProfileData();

    const saveButton = document.querySelector('#save-button'); // Select by ID

    saveButton.addEventListener('click', saveProfile);
});

function saveProfile(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the input values
    const fullName = document.querySelector("input[name='full-name']").value;
    const username = document.querySelector("input[name='username']").value;
    const email = document.querySelector("input[name='email']").value;
    const department = document.querySelector("select[name='department']").value;
    const gender = document.querySelector("select[name='gender']").value;
    const phone = document.querySelector("input[name='phone']").value;
    const address = document.querySelector("input[name='address']").value;
    const city = document.querySelector("input[name='city']").value;
    const state = document.querySelector("input[name='state']").value;
    const postalCode = document.querySelector("input[name='postal-code']").value;

    // Prepare data for localStorage
    const profileData = {
        fullName,
        username,
        email,
        department,
        gender,
        phone,
        address,
        city,
        state,
        postalCode
    };

    // Save the profile data to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));

    alert('Profile updated successfully!');
}

// Function to load profile data from localStorage
function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    
    if (savedData) {
        const profileData = JSON.parse(savedData);

        // Populate the form fields with saved data
        document.querySelector("input[name='full-name']").value = profileData.fullName || '';
        document.querySelector("input[name='username']").value = profileData.username || '';
        document.querySelector("input[name='email']").value = profileData.email || '';
        document.querySelector("select[name='department']").value = profileData.department || '';
        document.querySelector("select[name='gender']").value = profileData.gender || '';
        document.querySelector("input[name='phone']").value = profileData.phone || '';
        document.querySelector("input[name='address']").value = profileData.address || '';
        document.querySelector("input[name='city']").value = profileData.city || '';
        document.querySelector("input[name='state']").value = profileData.state || '';
        document.querySelector("input[name='postal-code']").value = profileData.postalCode || '';
    }
}







