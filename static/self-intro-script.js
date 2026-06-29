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

// ---- Resume download ----
function downloadResume(){
    const link = document.createElement('a');
    link.href = '/static/resume.pdf'; // put your actual resume file in the same folder, named resume.pdf
    link.download = 'Durga_Chandra_Udhaya_Resume.pdf';
    link.click();
}

// ---- Opinions section ----
const STORAGE_KEY = 'dcu_opinions';

function getOpinions(){
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveOpinions(opinions){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opinions));
}

function renderOpinions(){
    const list = document.getElementById('opinionsList');
    if(!list) return;

    const opinions = getOpinions();
    list.innerHTML = '';

    if(opinions.length === 0){
        list.innerHTML = '<p class="empty-msg">No opinions yet. Be the first to share one!</p>';
        return;
    }

    opinions.slice().reverse().forEach(op => {
        const card = document.createElement('div');
        card.className = 'opinion-card';
        card.innerHTML = `
            <div class="op-name">${escapeHTML(op.name)}</div>
            <div class="op-role">${escapeHTML(op.role)}</div>
            <p>${escapeHTML(op.text)}</p>
        `;
        list.appendChild(card);
    });
}

function escapeHTML(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    renderOpinions();

    const form = document.getElementById('opinionForm');
    if(form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('opName').value.trim();
            const role = document.getElementById('opRole').value;
            const text = document.getElementById('opText').value.trim();

            if(!name || !role || !text) return;

            const opinions = getOpinions();
            opinions.push({ name, role, text });
            saveOpinions(opinions);

            // ---- Send Email via EmailJS ----
            if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    name: name,
                    from_name: name,
                    role: role,
                    message: text,
                    type: 'Opinion'
                }).then(
                    (response) => {
                        console.log('EmailJS Success (Opinion):', response.status, response.text);
                    },
                    (error) => {
                        console.error('EmailJS Error (Opinion):', error);
                    }
                );
            } else {
                console.warn('EmailJS is not configured. Submissions are saved locally but not emailed. Please set EMAILJS_PUBLIC_KEY in self-intro-script.js');
            }

            form.reset();
            renderOpinions();
        });
    }
});
