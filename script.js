// --- GLOBAL STATE ---
let isSkipped = false;

// --- LIGHTBOX ZOOM LOGIC ---
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (lb && img) {
        img.src = src;
        lb.classList.add('active');
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('active');
}

// Initialize zoom on all scrap photos
function initScrapbookZoom() {
    document.querySelectorAll('.scrap-photo').forEach(photo => {
        // Skip zooming for photos explicitly marked as no-zoom
        if (photo.classList.contains('no-zoom')) return;

        photo.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent page flip
            openLightbox(photo.src);
        });
    });
}

// Run init once DOM or rooms load
document.addEventListener('DOMContentLoaded', initScrapbookZoom);

function showBookMessage(element, text) {
    let bubble = document.getElementById('bookBubble');
    if (!bubble) {
        bubble = document.createElement('div');
        bubble.id = 'bookBubble';
        bubble.className = 'book-bubble';
        document.body.appendChild(bubble);
    }

    const rect = element.getBoundingClientRect();
    bubble.innerText = text;
    bubble.style.top = (rect.top - 60) + 'px';
    bubble.style.left = (rect.left + rect.width / 2 - 100) + 'px';
    bubble.classList.add('active');

    setTimeout(() => {
        bubble.classList.remove('active');
    }, 3000);
}

// --- STAGE 1: BIRTHDAY IDE ---
const codePlaceholder = document.getElementById('codePlaceholder');
const langSymbol = document.getElementById('langSymbol');

const scripts = [
    {
        symbol: '[++]', lines: [
            '<span class="key">#include</span> <span class="str">&lt;iostream&gt;</span>',
            '<span class="key">int</span> <span class="func">main</span>() {',
            '    std::<span class="pre">cout</span> &lt;&lt; <span class="str">"Happy Birthday!"</span> &lt;&lt; std::endl;',
            '    <span class="key">return</span> 0;',
            '}'
        ]
    },
    {
        symbol: '[PY]', lines: [
            '<span class="key">def</span> <span class="func">wish</span>():',
            '    <span class="func">print</span>(<span class="str">"Happy Birthday, Senior Dev Azan!"</span>)',
            '',
            '<span class="func">wish</span>()'
        ]
    },
    {
        symbol: '[JS]', lines: [
            '<span class="key">const</span> <span class="func">celebrate</span> = () =&gt; {',
            '    console.<span class="func">log</span>(<span class="str">"Azan.age++;"</span>);',
            '    console.<span class="func">log</span>(<span class="str">"Happy Birthday!"</span>);',
            '};',
            '',
            '<span class="func">celebrate</span>();'
        ]
    },
    {
        symbol: '[HT]', lines: [
            '<span class="pre">&lt;h1&gt;</span>Happy Birthday, Azan!<span class="pre">&lt;/h1&gt;</span>',
            '<span class="pre">&lt;p&gt;</span>Senior Developer Status Confirmed.<span class="pre">&lt;/p&gt;</span>',
            '<span class="pre">&lt;button</span> <span class="key">class</span>=<span class="str">"party"</span><span class="pre">&gt;</span>Celebrate!<span class="pre">&lt;/button&gt;</span>'
        ]
    }
];

async function typeScript(scriptObj, isLast) {
    if (isSkipped) return;
    langSymbol.innerText = scriptObj.symbol;
    codePlaceholder.innerHTML = '';
    for (let lineText of scriptObj.lines) {
        if (isSkipped) return;
        const lineDiv = document.createElement('div');
        codePlaceholder.appendChild(lineDiv);
        lineDiv.innerHTML = lineText + '<span class="cursor">|</span>';
        await new Promise(r => setTimeout(r, 100));
        lineDiv.querySelector('.cursor')?.remove();
    }
    await new Promise(r => setTimeout(r, 800));
    if (!isLast && !isSkipped) {
        await gsap.to(codePlaceholder, { opacity: 0, duration: 0.2 });
        codePlaceholder.innerHTML = '';
        gsap.set(codePlaceholder, { opacity: 1 });
    }
}

async function startGreeting() {
    gsap.to('#ideWindow', { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" });
    await new Promise(r => setTimeout(r, 1000));
    for (let i = 0; i < scripts.length; i++) {
        if (isSkipped) break;
        await typeScript(scripts[i], i === scripts.length - 1);
    }
    if (!isSkipped) {
        const btn = document.getElementById('compileBtn');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        gsap.from(btn, { scale: 0.5, duration: 0.5, ease: "back.out" });
    }
}

function skipIDE() {
    isSkipped = true;
    revealBirthdayMsg();
}

// --- TRANSITION: REVEAL BIRTHDAY MESSAGE ---
function revealBirthdayMsg() {
    const ide = document.getElementById('ideWindow');
    const msg = document.getElementById('birthdayMsg');

    gsap.to(ide, {
        scale: 0, opacity: 0, duration: 0.8, ease: "back.in", onComplete: () => {
            ide.style.display = 'none';
            msg.style.display = 'block';
            gsap.to(msg, { opacity: 1, duration: 1 });

            gsap.from('.fancy-text', { scale: 0.5, opacity: 0, duration: 1, ease: "back.out" });

            // IMMEDIATE FESTIVITIES
            createBalloons();
            createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
            createPartyPoppers();

            // Start Nickname Sequence
            runNicknameSequence();
        }
    });
}

async function runNicknameSequence() {
    const container = document.querySelector('.nickname-text');
    gsap.set(container, { opacity: 1 });

    const nicknames = [
        { text: "Azan", size: "6rem", reveal: "horizontal" },
        { text: "Ai intern", size: "3.5rem", link: "https://www.instagram.com/p/DQ9FugECLrY/", reveal: "vertical" },
        { text: "Molester", size: "4rem", reveal: "zoom" },
        { text: "Dark Comedy King", size: "3.5rem", reveal: "horizontal-reverse" }
    ];

    for (let name of nicknames) {
        container.style.fontSize = name.size;
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';
        if (name.link) {
            const a = document.createElement('a');
            a.href = name.link; a.target = "_blank"; a.className = "intern-link";
            wrapper.appendChild(a);
        }
        container.appendChild(wrapper);
        const targetEl = wrapper.querySelector('a') || wrapper;

        let animIn = { opacity: 0 };
        if (name.reveal === "horizontal") animIn.x = -50;
        else if (name.reveal === "horizontal-reverse") animIn.x = 50;
        else if (name.reveal === "vertical") animIn.y = 30;
        else if (name.reveal === "zoom") animIn.scale = 0.8;

        gsap.fromTo(wrapper, animIn, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.3 });
        for (let char of name.text) {
            targetEl.innerHTML += char;
            await new Promise(r => setTimeout(r, 40));
        }
        await new Promise(r => setTimeout(r, 600));
        const chars = name.text.split('');
        while (chars.length > 0) {
            chars.pop();
            targetEl.innerHTML = chars.join('');
            await new Promise(r => setTimeout(r, 25));
        }
        await gsap.to(wrapper, { opacity: 0, duration: 0.2 });
    }
    showHeartfeltMsg();
}

function showHeartfeltMsg() {
    const box = document.getElementById('heartfeltMsg');
    box.style.display = 'block';
    const lines = [
        "Hope this birthday is better than your previous birthdays...",
        "I wanted to make it really special this time."
    ];
    let currentLine = 0;
    const typeLine = () => {
        if (currentLine < lines.length) {
            const p = document.createElement('p');
            box.appendChild(p);
            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < lines[currentLine].length) {
                    p.innerHTML += lines[currentLine].charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(interval);
                    currentLine++;
                    setTimeout(typeLine, 1000);
                }
            }, 50);
        } else {
            gsap.to('.proceed-btn', { opacity: 1, y: 0, duration: 1, display: 'inline-block' });
        }
    };
    gsap.to(box, { opacity: 1, duration: 1 });
    typeLine();
}

function goToDoors() {
    const wishStage = document.getElementById('wishStage');
    const doorStage = document.getElementById('doorStage');
    gsap.to(wishStage, {
        opacity: 0, y: -50, duration: 1,
        onComplete: () => {
            wishStage.classList.remove('active-stage');
            doorStage.classList.add('active-stage');
            gsap.fromTo(doorStage, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5 });
        }
    });
}

function backToDoors() {
    const doorStage = document.getElementById('doorStage');
    const roomStage = document.getElementById('roomStage');
    gsap.to(roomStage, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            roomStage.classList.remove('active-stage');
            doorStage.classList.add('active-stage');
            document.querySelectorAll('.door-opening-overlay').forEach(ov => ov.style.opacity = '0');

            if (document.body.classList.contains('xp-mode')) {
                document.getElementById('xpIcons').style.display = 'flex';
                document.getElementById('xpTaskbar').style.display = 'flex';
                document.getElementById('xpGameIcons').style.display = 'flex';
                document.getElementById('windowsContainer').style.display = 'block';
            }

            gsap.set(doorStage, { scale: 1, opacity: 1, transformOrigin: "center center" });
            gsap.fromTo(doorStage, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 });
        }
    });
}

function flipPage(pageElement) {
    const page = pageElement.parentElement;
    page.classList.toggle('flipped');

    // Manage Z-index to ensure correct layering during flip
    if (page.classList.contains('flipped')) {
        setTimeout(() => {
            page.style.zIndex = 1;
        }, 500);
    } else {
        page.style.zIndex = 5; // Reset to top when coming back
    }
}

function openRoom(roomNumber) {
    document.querySelectorAll('.room-content').forEach(r => r.style.display = 'none');
    document.getElementById(`room${roomNumber}`).style.display = 'flex';
}

function playVideo(videoSrc) {
    const player = document.getElementById('nfVideoPlayer');
    const video = document.getElementById('nfMainVideo');
    if (player && video) {
        video.src = videoSrc;
        player.style.display = 'flex';
        video.play();
    }
}

function closeVideo() {
    const player = document.getElementById('nfVideoPlayer');
    const video = document.getElementById('nfMainVideo');
    if (player && video) {
        video.pause();
        video.src = '';
        player.style.display = 'none';
    }
}

function enterRoom(roomNumber) {
    const doorStage = document.getElementById('doorStage');
    const roomStage = document.getElementById('roomStage');
    const selectedRoom = document.getElementById(`room${roomNumber}`);
    const doorOverlay = document.getElementById(`doorOverlay${roomNumber}`);
    const hotspots = document.querySelectorAll('.door-hotspot');
    const selectedHotspot = hotspots[roomNumber - 1];

    if (document.body.classList.contains('xp-mode')) {
        // XP MODE: Instant Reveal & Hide Background UI
        document.getElementById('xpIcons').style.display = 'none';
        document.getElementById('xpTaskbar').style.display = 'none';
        document.getElementById('xpGameIcons').style.display = 'none';
        document.getElementById('windowsContainer').style.display = 'none';
        document.getElementById('startMenu')?.classList.add('hidden');

        doorStage.classList.remove('active-stage');
        roomStage.classList.add('active-stage');
        document.querySelectorAll('.room-content').forEach(r => r.style.display = 'none');
        selectedRoom.style.display = 'flex';
        gsap.fromTo(roomStage, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
        return;
    }

    const hX = selectedHotspot ? selectedHotspot.offsetLeft + (selectedHotspot.offsetWidth / 2) : window.innerWidth / 2;
    const hY = selectedHotspot ? selectedHotspot.offsetTop + (selectedHotspot.offsetHeight / 2) : window.innerHeight / 2;
    gsap.set(doorStage, { transformOrigin: `${hX}px ${hY}px` });

    gsap.to(doorOverlay, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" });
    gsap.to(doorStage, {
        scale: 15,
        opacity: 0,
        duration: 2.2,
        delay: 0.3,
        ease: "power2.in",
        onComplete: () => {
            doorStage.classList.remove('active-stage');
            roomStage.classList.add('active-stage');
            gsap.set(doorStage, { scale: 1, opacity: 1, transformOrigin: "center center" });
            gsap.set(doorOverlay, { opacity: 0, scale: 1.1 });
            document.querySelectorAll('.room-content').forEach(r => r.style.display = 'none');
            selectedRoom.style.display = 'flex';
            gsap.fromTo(roomStage, { opacity: 0 }, { opacity: 1, duration: 1 });
            gsap.from(selectedRoom.children, { opacity: 0, y: 30, stagger: 0.2, duration: 1 });
        }
    });
}

// --- FESTIVE ASSETS ---
function createBalloons() {
    const stage = document.getElementById('wishStage');
    const colors = ['#ff4d4d', '#4dff4d', '#4d4dff', '#ffff4d', '#ff4dff'];
    for (let i = 0; i < 30; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDuration = (10 + Math.random() * 10) + 's';
        balloon.style.animationDelay = (Math.random() * 5) + 's';
        stage.appendChild(balloon);
        balloon.style.cursor = 'pointer';
        balloon.onclick = (e) => {
            e.stopPropagation();
            createConfettiBurst(balloon.offsetLeft + 30, balloon.offsetTop + 40);
            gsap.to(balloon, { scale: 1.5, opacity: 0, duration: 0.1, onComplete: () => balloon.remove() });
        };
    }
}

function createPartyPoppers() {
    const poot = () => {
        createConfettiBurst(0, window.innerHeight);
        createConfettiBurst(window.innerWidth, window.innerHeight);
    };
    poot();
    setTimeout(poot, 500);
    setTimeout(poot, 1200);
}

function createConfettiBurst(x, y) {
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = x + 'px';
        conf.style.top = y + 'px';
        conf.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        document.body.appendChild(conf);
        gsap.to(conf, {
            x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800,
            rotation: Math.random() * 720, opacity: 0,
            duration: 1.5 + Math.random(), scale: 0.5,
            onComplete: () => conf.remove()
        });
    }
}

function complainLayout() {
    if (!document.body.classList.contains('xp-mode')) {
        // First click: Transform to XP
        document.body.classList.add('xp-mode');
        updateXPClock();
        setInterval(updateXPClock, 60000);
        document.querySelector('.funny-feedback-btn').innerText = "ye bhi pasand nahi aya";
    } else {
        // Second click: Transform to Live Sandbox
        enterSandbox();
    }
}

// --- SANDBOX (LIVE IDE) LOGIC ---
function enterSandbox() {
    const sandbox = document.getElementById('sandboxStage');
    const editor = document.getElementById('sandboxEditor');
    const preview = document.getElementById('sandboxPreview');

    // Hide EVERYTHING else
    document.getElementById('wishStage').style.display = 'none';
    document.getElementById('doorStage').style.display = 'none';
    document.getElementById('roomStage').style.display = 'none';
    document.getElementById('xpTaskbar').style.display = 'none';
    document.getElementById('xpIcons').style.display = 'none';
    document.getElementById('xpGameIcons').style.display = 'none';
    document.getElementById('windowsContainer').style.display = 'none';

    sandbox.classList.add('active-stage');
    gsap.fromTo(sandbox, { opacity: 0 }, { opacity: 1, duration: 1 });

    // IDE Code Sync
    editor.addEventListener('input', () => {
        preview.innerHTML = editor.value;
    });
}

function exitSandbox() {
    location.reload(); // Simple reset
}

function updateXPClock() {
    const clock = document.getElementById('xpClock');
    if (clock) {
        clock.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

window.addEventListener('load', startGreeting);

// --- WINDOW SYSTEM ---
let zIndexCounter = 10001;

function openWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    // Play a click sound effect metaphorically, but practically we just show it
    win.classList.remove('hidden');
    win.style.zIndex = ++zIndexCounter;
}

function closeWindow(winId) {
    const win = document.getElementById(winId);
    if (win) {
        win.classList.add('hidden');
    }
}

// Basic dragging logic for windows
let isDragging = false;
let currentWindow = null;
let offsetX = 0, offsetY = 0;

document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.xp-window-titlebar')) {
        const titlebar = e.target.closest('.xp-window-titlebar');
        // Ignore clicks on close buttons
        if (e.target.classList.contains('xp-close-btn')) return;

        currentWindow = titlebar.parentElement;
        if (currentWindow) {
            isDragging = true;
            currentWindow.style.zIndex = ++zIndexCounter;

            const rect = currentWindow.getBoundingClientRect();
            // Calculate where we clicked relative to the top-left of the window
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // Remove CSS transform for absolute positioning
            currentWindow.style.transform = 'none';
            currentWindow.style.left = rect.left + 'px';
            currentWindow.style.top = rect.top + 'px';
        }
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentWindow) {
        currentWindow.style.left = (e.clientX - offsetX) + 'px';
        currentWindow.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentWindow = null;
});

// Start Menu logic
function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    if (menu) {
        menu.classList.toggle('hidden');
        if (!menu.classList.contains('hidden')) {
            menu.style.zIndex = ++zIndexCounter;
        }
    }
}

// --- NETFLIX MODAL & VIDEO DATA ---
let currentVideoIndex = 0;

const nfVideos = [
    { title: "HB Azan: The Legend", path: "New folder (2)/HB.mp4", img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800", match: "99% Match", desc: "The cinematic beginning of Azan's legendary birthday celebration. A must watch for all senior developers." },
    { title: "HB Reunion", path: "New folder (2)/HB1.mp4", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800", match: "97% Match", desc: "The whole gang gets together for a night of pure chaos and unforgettable laughs. The reunion we all needed." },
    { title: "Birthday Vibes 2", path: "New folder (2)/HB2.mp4", img: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=800", match: "95% Match", desc: "Keeping the energy high with round two of the birthday celebrations. Azan's vibe is unmatched here." },
    { title: "The Grill Night", path: "New folder (2)/BBQ.mp4", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800", match: "98% Match", desc: "Smoke, fire, and meat. A masterclass in BBQ hosted by the birthday boy himself." },
    { title: "Farzam's Big Day", path: "New folder (2)/farzambd.mp4", img: "https://images.unsplash.com/photo-1513623935135-c896b59073c1?q=80&w=800", match: "94% Match", desc: "The crew celebrating another icon's big milestone. Good times, better friends." },
    { title: "Shan's Celebration", path: "New folder (2)/shanBD.mp4", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800", match: "96% Match", desc: "High octane birthday Bash for Shan. The dancing was questionable, the fun was absolute." },
    { title: "SF Birthday Party", path: "New folder (2)/sfBD.mp4", img: "subhanhb.jpg", match: "92% Match", desc: "A late night underground birthday bash with the finest crew in the tech industry." },
    { title: "Wrestling Vol 1", path: "New folder (2)/wrestling1.mp4", img: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=800", match: "98% Match", desc: "Azan shows off his 'professional' wrestling skills. Safety was not a priority." },
    { title: "Wrestling Vol 2", path: "New folder (2)/wrestling2.mp4", img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800", match: "96% Match", desc: "The rematch nobody asked for but everyone watched. Pure adrenaline and bad decisions." },
    { title: "The Belt Story", path: "New folder (2)/belt.mp4", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800", match: "95% Match", desc: "What happens when you give these guys a belt? Find out in this high-stakes comedy thriller." },
    { title: "Card Games", path: "New folder (2)/cards.mp4", img: "https://images.unsplash.com/photo-1541278107931-e006523892df?q=80&w=800", match: "94% Match", desc: "Poker faces, bluffing, and absolute betrayal over a deck of cards." },
    { title: "Pool Vol 1", path: "New folder (2)/pool.mp4", img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800", match: "98% Match", desc: "Summer vibes and pool diving. Azan's form is 10/10 (in his own mind)." },
    { title: "Pool Vol 2", path: "New folder (2)/pool2.mp4", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800", match: "97% Match", desc: "More water chaos. The pool couldn't handle the heat these developers brought." },
    { title: "Ice Cream Hunt", path: "New folder (2)/icecream.mp4", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800", match: "93% Match", desc: "A late-night quest for the perfect scoop. Spoiler: they found it." },
    { title: "Naughty Moments", path: "New folder (2)/naughtyazan.mp4", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800", match: "99% Match", desc: "The clips Azan probably doesn't want you to see. Viewer discretion advised." },
    { title: "The Bold One", path: "New folder (2)/sex.mp4", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800", match: "95% Match", desc: "A cinematic look at the boldest personality in the group. Unfiltered and raw." },
    { title: "Blowjob Mystery", path: "New folder (2)/blowjob.mp4", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800", match: "91% Match", desc: "A mystery that remains unsolved. Many theories, zero evidence." },
    { title: "Random Chaos", path: "New folder (2)/random.mp4", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800", match: "94% Match", desc: "No plot, no plan, just pure random moments of friendship." },
    { title: "Character Day", path: "New folder (2)/characterday.mp4", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800", match: "96% Match", desc: "The day everyone decided to become someone else. Costumes 10/10." },
    { title: "Journey Pt 1", path: "New folder (2)/travel.mp4", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800", match: "97% Match", desc: "Beginning of the great road trip. Scenic views and terrible singing." },
    { title: "Journey Pt 2", path: "New folder (2)/travelling.mp4", img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800", match: "95% Match", desc: "The adventure continues. More miles, more memories, fewer snacks." },
    { title: "Cheezious 1", path: "New folder (2)/cheezious1.mp4", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800", match: "99% Match", desc: "The ultimate cheat meal. Azan's true love found in a pizza box." },
    { title: "Cheezious 2", path: "New folder (2)/cheezious2.mp4", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800", match: "98% Match", desc: "He went back for more. We don't judge genius when we see it." },
    { title: "Dining Out", path: "New folder (2)/resturant.mp4", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800", match: "96% Match", desc: "Fancy food for a fancy crew. A night of fine dining and even finer jokes." },
    { title: "The Sitting Plan", path: "New folder (2)/sittingplan.mp4", img: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?q=80&w=800", match: "94% Match", desc: "A complex organizational challenge: how to fit 10 developers around 1 table." },
    { title: "Qawali Night", path: "New folder (2)/qawali night.mp4", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800", match: "99% Match", desc: "Soulful music and great company. The cultural highlight of the year." },
    { title: "Midnight Special", path: "New folder (2)/midnight.mp4", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800", match: "98% Match", desc: "The countdown to the big day. Midnight surprises for a deserving friend." },
    { title: "Valentimes", path: "New folder (2)/valentimes.mp4", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800", match: "97% Match", desc: "Celebrating love and friendship on the most romantic day of the year." },
    { title: "The Montage", path: "New folder (2)/edit.mp4", img: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800", match: "99% Match", desc: "A cinematic edit of all the best moments. Your life in 60 seconds." },
    { title: "Ramzan Traditions", path: "ramzan.mp4", img: "ramzan.jpg", match: "98% Match", desc: "Capturing the spiritual essence and peaceful nights of the holy month. A beautiful reflection of traditions." }
];

function openVideoModal(index) {
    currentVideoIndex = index;
    const data = nfVideos[index];
    if (!data) return;

    document.getElementById('modalHeroArea').style.backgroundImage = `url(${data.img})`;
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalMatch').innerText = data.match;
    document.getElementById('modalDescription').innerText = data.desc;

    const playBtn = document.getElementById('modalPlayBtn');
    playBtn.onclick = () => {
        closeVideoModal();
        playVideo(data.path, index);
    };

    document.getElementById('nfVideoModal').classList.add('active');
}

function playVideo(videoSrc, index = -1) {
    if (index !== -1) currentVideoIndex = index;
    const player = document.getElementById('nfVideoPlayer');
    const video = document.getElementById('nfMainVideo');

    if (player && video) {
        video.src = videoSrc;
        player.style.display = 'flex';
        video.play();

        // Update Nav UI
        updatePlayerNav();
    }
}

function updatePlayerNav() {
    const titleEl = document.getElementById('playerVideoTitle');
    if (titleEl) {
        titleEl.innerText = nfVideos[currentVideoIndex].title;
    }
}

function nextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % nfVideos.length;
    playVideo(nfVideos[currentVideoIndex].path, currentVideoIndex);
}

function prevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + nfVideos.length) % nfVideos.length;
    playVideo(nfVideos[currentVideoIndex].path, currentVideoIndex);
}

// Global Shortkeys for Netflix
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('room2').offsetParent) return; // Only if Netflix Room is visible

    if (document.getElementById('nfVideoPlayer').style.display === 'flex') {
        if (e.key === 'ArrowRight') nextVideo();
        if (e.key === 'ArrowLeft') prevVideo();
        if (e.key === 'Escape') closeVideo();
    }
});


function closeVideoModal() {
    document.getElementById('nfVideoModal').classList.remove('active');
}

function scrollNFRow(btn, direction) {
    const slider = btn.parentElement.querySelector('.nf-slider');
    const scrollAmount = 800; // Scroll by roughly 4 cards
    slider.scrollBy({
        left: scrollAmount * direction,
        behavior: 'smooth'
    });
}
