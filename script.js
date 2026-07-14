// -------------------------------------
// USER WELCOME
// -------------------------------------
alert("Welcome");
confirm("Are You Sure To Watch This Project!");
let nm = prompt("Please! Enter Your Name....||");
alert("Welcome " + nm);

// -------------------------------------
// UNLOCK AUDIO (Browser autoplay fix)
// -------------------------------------
document.addEventListener(
  "click",
  () => {
    const chargeSound = document.getElementById("charge-sound");
    const lowBatterySound = document.getElementById("low-battery-sound");

    chargeSound.muted = true;
    lowBatterySound.muted = true;

    chargeSound.play().then(() => {
      chargeSound.pause();
      chargeSound.muted = false;
    }).catch(() => {});

    lowBatterySound.play().then(() => {
      lowBatterySound.pause();
      lowBatterySound.muted = false;
    }).catch(() => {});
  },
  { once: true }
);

// -------------------------------------
// BATTERY STATUS FUNCTION
// -------------------------------------
async function updateBatteryStatus() {
  const battery = await navigator.getBattery();

  const chargeSound = document.getElementById("charge-sound");
  const lowBatterySound = document.getElementById("low-battery-sound");

  let lastChargingState = battery.charging;
  let lowBatteryPlayed = false;

  function updateAllBatteryInfo() {
    const level = Math.round(battery.level * 100);

    const batteryLevel = document.getElementById("battery-level");
    const statusLabel = document.getElementById("charging-status");
    const batteryBar = document.getElementById("battery-bar");
    const card = document.getElementById("battery-card");

    // -----------------------------
    // UPDATE UI
    // -----------------------------
    batteryLevel.textContent = `Battery Level: ${level}%`;
    batteryBar.style.width = `${level}%`;

    // -----------------------------
    // CHARGING
    // -----------------------------
    if (battery.charging) {
      statusLabel.textContent = "Status: Charging ⚡";
      statusLabel.className = "charging-label";

      card.style.boxShadow = "0 0 20px 4px limegreen";
      batteryBar.className =
        "progress-bar bg-success progress-bar-striped progress-bar-animated";

      // 🔔 Notification sound when charging STARTS
      if (!lastChargingState) {
        chargeSound.currentTime = 0;
        chargeSound.play();
      }

    }
    // -----------------------------
    // NOT CHARGING
    // -----------------------------
    else {
      statusLabel.textContent = "Status: Not Charging";
      statusLabel.className = "not-charging-label";

      card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";

      if (level < 20) {
        batteryBar.className = "progress-bar bg-danger";

        // ⚠️ Warning sound ONLY once below 20%
        if (!lowBatteryPlayed) {
          lowBatterySound.currentTime = 0;
          lowBatterySound.play();
          lowBatteryPlayed = true;
        }
      } 
      else if (level <= 50) {
        batteryBar.className = "progress-bar bg-warning";
        lowBatteryPlayed = false; // reset when level rises
      } 
      else {
        batteryBar.className = "progress-bar bg-primary";
        lowBatteryPlayed = false; // reset when level rises
      }
    }

    lastChargingState = battery.charging;
  }

  // Initial call
  updateAllBatteryInfo();

  // Live updates
  battery.addEventListener("levelchange", updateAllBatteryInfo);
  battery.addEventListener("chargingchange", updateAllBatteryInfo);
}

// -------------------------------------
// START BATTERY MONITORING
// -------------------------------------
updateBatteryStatus();
