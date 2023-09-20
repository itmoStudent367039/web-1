function validateX() {
    const result = document.querySelector('.x-select').value;
    if (result !== 'none') {
        return true;
    } else {
        alert("Choose x element")
        return false;
    }
}

function validateY() {
    let element = document.getElementById("Y-input");
    let y = element.value.replace(',', '.');
    let regex = new RegExp(/^-?(?:3(?:\.0+)?|[0-2](?:\.[0-9]+)?|\.[0-9]+)$/)
    if (regex.test(y.toString())) {
        return true;
    } else {
        alert("y is decimal, between 0 and 3")
        return false;
    }
}
