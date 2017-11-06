const LIGHT_SWITCH_ON_PROBABILITY = 0.5,
    LIGHT_SWITCH_INTERVAL_DURATION = 750,
    REACTION_TIME_THRESHOLD = 300,
    LIGHT_STATE_ON = "on",
    LIGHT_STATE_OFF = "off";

var lightSwitchInterval,
    lastLightSwitchOnTime,
    currentPoints = 0,
    lightNodes,
    resultNode,
    pointsNode;

function init() {
    initUserInterface();
    startLightToggle();
}

function initUserInterface() {
    lightNodes = document.querySelectorAll(".light");
    resultNode = document.querySelector(".result");
    pointsNode = document.querySelector(".points");
    document.addEventListener("keypress", onKeyPressed);
}

function startLightToggle() {
    lightSwitchInterval = setInterval(onLightStateChangeTriggerd, LIGHT_SWITCH_INTERVAL_DURATION);
}

function onKeyPressed(event) {
    if (event.code === "Space") {
        onSpaceKeyPressed();
    }
}

function onLightStateChangeTriggerd() {
    var rand = Math.random();
    if (rand < LIGHT_SWITCH_ON_PROBABILITY) {
        lastLightSwitchOnTime = Date.now();
        toggleLightsOff();
        toggleRandomLightOn();
    } else {
        toggleLightsOff();
    }
}

function onSpaceKeyPressed() {
    if (isLightOn()) {
        let delta = Date.now() - lastLightSwitchOnTime;
        if (delta <= REACTION_TIME_THRESHOLD) {
            incrementPoints();
            setResultText("Excellent! (" + delta + "ms)");
        } else {
            setResultText("Too slow! (" + delta + "ms)");
        }
    } else {
    	setResultText("Where did you see that light?");
    	decrementPoints();
    }
    onLightStateChangeTriggerd();
}

function toggleLightsOff() {
    for (var el of lightNodes) {
        el.classList.remove(LIGHT_STATE_ON);
        el.classList.add(LIGHT_STATE_OFF);
    }
}

function toggleRandomLightOn() {
	var index = Math.floor(Math.random() * lightNodes.length);
	lightNodes.item(index).classList.remove(LIGHT_STATE_OFF);
	lightNodes.item(index).classList.add(LIGHT_STATE_ON);
}

function isLightOn() {
    for (var el of lightNodes) {
       if(el.classList.contains(LIGHT_STATE_ON)) {
       	return true;
       }
    }
    return false;
}

function incrementPoints() {
    currentPoints++;
    pointsNode.innerHTML = currentPoints;
}

function decrementPoints() {
    currentPoints--;
    pointsNode.innerHTML = currentPoints;
}

function setResultText(text) {
    resultNode.innerHTML = text;
}

init();
