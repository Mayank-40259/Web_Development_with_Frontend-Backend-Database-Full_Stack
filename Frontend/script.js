const contactForm = document.getElementById('contact-form');
const statusMsg = document.getElementById('form-status');

// लोकल कंप्यूटर पर एक्सप्रेस सर्वर का एड्रेस (पोर्ट 5000)
//const LIVE_BACKEND_URL = 'http://localhost:5000';
// इसे अपनी script.js की लाइन 5 में बदलें

const LIVE_BACKEND_URL = 'https://vercel.app';


if (contactForm && statusMsg) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const messageInput = contactForm.querySelector('textarea');

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        statusMsg.classList.remove('hidden');
        statusMsg.innerText = "⏳ Sending your message to server...";
        statusMsg.className = "status-msg info"; 

        try {
            // सही URL पर POST रिक्वेस्ट भेजना
            const response = await fetch(`${LIVE_BACKEND_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                statusMsg.innerText = "🎉 Success! Your message has been saved to the MySQL database.";
                statusMsg.className = "status-msg success"; 
                contactForm.reset(); 
            } else {
                statusMsg.innerText = "❌ Error: " + (data.error || "Could not save data.");
                statusMsg.className = "status-msg error"; 
            }
        } catch (error) {
            console.error("Submission Error:", error);
            statusMsg.innerText = "❌ Connection failed. Check if serverless function or database is running.";
            statusMsg.className = "status-msg error";
        }

        setTimeout(() => {
            statusMsg.classList.add('hidden');
        }, 5000);
    });
}

// Mobile Hamburger Menu Trigger
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
    });
});
