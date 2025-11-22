// ELEMENTS
const introPage = document.querySelector('.intro-page');
const landingPage = document.querySelector('.landing-page');
const questionPage = document.querySelector('.question-page');
const outroPage = document.querySelector('.outro-page');

const introBtn = document.getElementById("intro-btn");
const startBtn = document.getElementById("start-btn");
const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.getElementById("noBtn");

const outroTitle = document.getElementById("outro-title");
const outroMessage = document.getElementById("outro-message");

// --- Intro typing effect ---
const introText = "Gwen… naa koy e-ingon, pindota sa continue 💖";
let index = 0;
function typeIntro(){
    const elem = document.getElementById("intro-text");
    if(index < introText.length){
        elem.textContent += introText.charAt(index);
        index++;
        setTimeout(typeIntro, 50);
    }
}
typeIntro();

// --- Page switcher ---
function showPage(hide, show){
    hide.classList.add("fade-out");
    setTimeout(()=>{
        hide.style.display = "none";
        show.style.display = "block";
        show.classList.add("fade-in");
    }, 300);
}

introBtn.onclick = ()=>showPage(introPage, landingPage);
startBtn.onclick = ()=>showPage(landingPage, questionPage);

// --- Popup function ---
function showPopup(message, callback){
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 10);

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(()=>{
            popup.remove();
            if(callback) callback();
        },300);
    }, 1500);
}

// --- Send answer to database ---
function sendAnswer(ans){
    fetch("save_answer.php", {
        method: "POST",
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: "answer=" + encodeURIComponent(ans)
    })
    .then(res=>res.text())
    .then(data=>console.log("Answer saved:", data))
    .catch(err=>console.error(err));
}

// --- YES button ---
yesBtn.onclick = ()=>{
    sendAnswer("YES");
    showPopup("You clicked YES 💖", ()=>{
        showPage(questionPage, outroPage);
        outroTitle.textContent="Thank You ❤️";
        outroMessage.textContent="Sorry if ing atoo ko haa love you sabtonn jud tika";
        startHearts();
    });
};

// --- NO button dodge + click ---
// --- NO button dodge + click (centered) ---
let attempts = 0;
const noTexts = ["Are you sure? 😭","Please no 😣","Don't click me 😭","Wait wait 😫","PLEASE 😔"];
let lastHover = 0;

noBtn.addEventListener("mouseover", () => {
    const now = Date.now();
    if (now - lastHover < 600) return; // throttle hover
    lastHover = now;

    if (attempts < 5) {
        noBtn.textContent = noTexts[attempts];
        attempts++;

        // Centered base
        const centerX = window.innerWidth / 2 - noBtn.offsetWidth / 2;
        const centerY = window.innerHeight / 2 - noBtn.offsetHeight / 2;

        // Small random offset around center
        const offsetX = (Math.random() - 0.5) * 100; // max ±50px
        const offsetY = (Math.random() - 0.5) * 100; // max ±50px

        noBtn.style.left = (centerX + offsetX) + "px";
        noBtn.style.top = (centerY + offsetY) + "px";
    }
});



noBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(attempts < 5) return; // still dodging
    sendAnswer("NO");
    showPopup("You clicked NO 😭", ()=>{
        showPage(questionPage, outroPage);
        outroTitle.textContent="It's Okay 😢";
        outroMessage.textContent="if insist jud ka sge i respect it";
        startHearts();
    });
});

// --- Heart animation ---
function startHearts(){
    const container = document.getElementById("heart-animation");
    setInterval(()=>{
        let heart = document.createElement("div");
        heart.textContent = "💖";
        heart.style.position = "absolute";
        heart.style.left = Math.random()*window.innerWidth+"px";
        heart.style.fontSize = (25 + Math.random()*25) + "px";
        heart.style.opacity = Math.random();
        container.appendChild(heart);

        setTimeout(()=>{
            heart.style.transform = `translateY(-250px) rotate(${Math.random()*360}deg) scale(${0.8+Math.random()})`;
            heart.style.opacity = 0;
        }, 100);

        setTimeout(()=>heart.remove(), 2600);
    }, 200);
}
