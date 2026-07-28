(() => {
    const IDLE_TIMEOUT = 15 * 60 * 1000;
    const WARNING_DURATION = 60 * 1000;

    let idleTimer;
    let countdownTimer;
    let secondsRemaining = WARNING_DURATION / 1000;

  let loggedOut = false;

    function logout() {
        if (loggedOut) return;
        loggedOut = true;

        sessionStorage.clear();
        localStorage.removeItem("hasLoggedIn");
        closeModal();
        clearTimeout(idleTimer);
        clearInterval(countdownTimer);
        window.location.href = "index.html";
}
    function resetTimers() {
        const modal = document.getElementById("sessionTimeoutModal");

        if (modal && modal.style.display === "block") return;

        clearTimeout(idleTimer);
        clearInterval(countdownTimer);

        idleTimer = setTimeout(showWarning, IDLE_TIMEOUT - WARNING_DURATION);
}
    function showWarning() {
        secondsRemaining = WARNING_DURATION / 1000;

        let modal = document.getElementById("sessionTimeoutModal");

        if (!modal) {
            modal = document.createElement("div");
            modal.id = "sessionTimeoutModal";

            modal.innerHTML = `
            <div id="sessionOverlay" style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.65);
                display:flex;
                justify-content:center;
                align-items:center;
                z-index:99999;
            ">
                <div style="
                    width:400px;
                    max-width:90%;
                    background:#111827;
                    color:white;
                    border-radius:14px;
                    padding:24px;
                    border:1px solid #374151;
                    text-align:center;
                    font-family:Inter,sans-serif;
                ">
                    <h2 style="margin:0 0 12px;font-size:22px;">
                        Session Expiring
                    </h2>

                    <p style="margin-bottom:18px;color:#d1d5db;">
                        You've been inactive.<br>
                        You'll be logged out in
                    </p>

                    <div id="sessionCountdown"
                        style="
                        font-size:34px;
                        font-weight:bold;
                        color:#10B981;
                        margin-bottom:20px;">
                    </div>

                    <div style="
                        display:flex;
                        justify-content:center;
                        gap:12px;
                    ">
                        <button id="continueSessionBtn"
                            style="
                            background:#10B981;
                            color:white;
                            border:none;
                            padding:10px 18px;
                            border-radius:8px;
                            cursor:pointer;">
                            Continue Session
                        </button>

                        <button id="logoutNowBtn"
                            style="
                            background:#ef4444;
                            color:white;
                            border:none;
                            padding:10px 18px;
                            border-radius:8px;
                            cursor:pointer;">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            `;

            document.body.appendChild(modal);

            document
                .getElementById("continueSessionBtn")
                .addEventListener("click", () => {
                    closeModal();

                    clearTimeout(idleTimer);
                    clearInterval(countdownTimer);

                    idleTimer = setTimeout(showWarning, IDLE_TIMEOUT - WARNING_DURATION);
                });

            document
                .getElementById("logoutNowBtn")
                .addEventListener("click", logout);
        }

        modal.style.display = "block";

        updateCountdown();

        countdownTimer = setInterval(() => {

            secondsRemaining--;

            updateCountdown();

            if (secondsRemaining <= 0) {
                logout();
            }

        }, 1000);
    }

    function updateCountdown() {
        const el = document.getElementById("sessionCountdown");

        if (!el) return;

        const min = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
        const sec = String(secondsRemaining % 60).padStart(2, "0");

        el.textContent = `${min}:${sec}`;
    }

    function closeModal() {
        const modal = document.getElementById("sessionTimeoutModal");

        if (modal) {
            modal.style.display = "none";
        }

        clearInterval(countdownTimer);
    }

    [
        "mousemove",
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click"
    ].forEach(event => {

        document.addEventListener(event, resetTimers, true);

    });

    resetTimers();

})();