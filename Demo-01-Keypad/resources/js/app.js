var keypadNode = document.querySelector(".keypad-container"),
    myKeypad = new Keypad(keypadNode, "1337");

function onCodeEntered(message) {
	console.log(message);
}


myKeypad.init();
myKeypad.setCodeListener(onCodeEntered);
