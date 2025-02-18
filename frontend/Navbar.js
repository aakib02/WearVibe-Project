const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return cookieValue;
    }
    return null;
};

const fetchNavbar = async () => {
    try {
    

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
            .map(link => `<li><a href="${link.path}" class="hover:underline">${link.name}</a></li>`)
            .join("");
        // document.getElementById("profile").innerHTML = ` (${data.user.fullName})`;
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
    console.log("profile data :", data); // ✅ Debugging API response
    document.getElementById("profile").innerHTML = ` (${data.user.fullName})`;
} catch (error) {
    console.log("Error fetching profile:", error);
}
}

document.addEventListener("DOMContentLoaded", fetchNavbar,fetchProfile);
