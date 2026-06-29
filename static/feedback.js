// ---- EmailJS Configuration (Replace with your actual keys from https://dashboard.emailjs.com/) ----
const EMAILJS_PUBLIC_KEY = 'YXTHGeEXMlW93U1Xf'; 
const EMAILJS_SERVICE_ID = 'service_f476xxr'; 
const EMAILJS_TEMPLATE_ID = 'template_jz22u06'; 

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
    });
}

const KEY = "dcu_feedback";

function getFeedback() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveFeedback(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

function renderFeedback() {
    const list = document.getElementById("feedbackList");
    list.innerHTML = "";

    const data = getFeedback();

    if (data.length === 0) {
        list.innerHTML = "<p class='empty-msg'>No feedback yet.</p>";
        return;
    }

    data.reverse().forEach(item => {
        const div = document.createElement("div");
        div.className = "opinion-card";
        div.innerHTML = `
            <div class="op-name">${item.name}</div>
            <div class="op-role">${item.role}</div>
            <p>${item.message}</p>
        `;
        list.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderFeedback();

    document.getElementById("feedbackForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const role = document.getElementById("role").value;
        const message = document.getElementById("message").value.trim();

        if (!name || !role || !message) return;

        const data = getFeedback();
        data.push({ name, role, message });
        saveFeedback(data);

        // ---- Send Email via EmailJS ----
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                name: name,
                from_name: name,
                role: role,
                message: message,
                type: 'Feedback'
            }).then(
                (response) => {
                    console.log('EmailJS Success (Feedback):', response.status, response.text);
                },
                (error) => {
                    console.error('EmailJS Error (Feedback):', error);
                }
            );
        } else {
            console.warn('EmailJS is not configured. Submissions are saved locally but not emailed. Please set EMAILJS_PUBLIC_KEY in feedback.js');
        }

        e.target.reset();
        renderFeedback();
    });
});