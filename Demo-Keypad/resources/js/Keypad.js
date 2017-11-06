var Keypad = function(container, code) {
    this.container = container;
    this.code = code;
};


Keypad.prototype.init = function() {
    var keys = this.container.querySelectorAll(".key");
    this.display = this.container.querySelector(".display");
    for (let i = 0; i < keys.length; i++) {
        keys[i].addEventListener("click", this.onKeyPressed.bind(this));
    }
};

Keypad.prototype.setCodeListener = function (callback) {
    this.codeListener = callback;
};

Keypad.prototype.validate = function(code) {
    if(this.codeListener === undefined) {
        return;
    }
    if (this.code === code) {
        this.codeListener("Code Accepted!");
    } else {
        this.codeListener("Invalid  Code");
    }
    this.clear();
};

Keypad.prototype.currentValue = function() {
    return this.display.innerHTML;
};

Keypad.prototype.defaultValue = function() {
    return this.display.getAttribute("data-default");
};

Keypad.prototype.clear = function() {
    this.display.innerHTML = this.defaultValue();
};

Keypad.prototype.accept = function() {
    this.validate(this.currentValue());
};



Keypad.prototype.appendDigit = function(digit) {
    var defaultValue = this.defaultValue(),
        currentValue = this.currentValue();
    if (defaultValue === currentValue) {
        currentValue = "";
        this.display.innerHTML = currentValue;
    }
    if (currentValue.length < this.code.length) {
        this.display.innerHTML = this.display.innerHTML + digit;
    }
};

Keypad.prototype.onKeyPressed = function(event) {
    var keyValue = event.target.getAttribute("data-value");
    switch (keyValue) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
            this.appendDigit(keyValue);
            break;
        case "*":
            this.clear();
            break;
        case "#":
            this.accept();
            break;
        default:
            break;
    }
};
