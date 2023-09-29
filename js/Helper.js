const graph = new Graph();
const FROM_MINUS_THREE_TILL_THREE = new RegExp(
  /^-?(?:3(?:\.0+)?|[0-2](?:\.[0-9]+)?|\.[0-9]+)$/,
);

let inputValidator = {
  xSelector: document.querySelector(".x-select"),

  yInput: document.getElementById("Y-input"),

  validateX: function () {
    if (this.xSelector.value !== "none") {
      return true;
    } else {
      doAttention("Select X");
      return false;
    }
  },

  validateY: function () {
    let y = this.yInput.value.replace(",", ".");
    if (FROM_MINUS_THREE_TILL_THREE.test(y.toString())) {
      return true;
    } else {
      doAttention("Y is decimal, between -3 and 3");
      return false;
    }
  },

  get getY() {
    return this.yInput.value.replace(",", ".");
  },

  get getX() {
    return this.xSelector.value;
  },
};

let tableWorker = {
  innerData: function (tableRow) {
    let table = document.querySelector("table");
    let tBody = table.getElementsByTagName("tbody")[0];
    let row = document.createElement("tr");
    row.innerHTML = tableRow;
    tBody.appendChild(row);
  },
};

function addRadiusChangeListener() {
  graph.redrawAll(findAndReturnSelectedRadius());
  drawAllPoints(graph);
}

function findAndReturnSelectedRadius() {
  let selectedElement = document.querySelector("input[name='R']:checked");
  return selectedElement.value;
}

function addCheckButtonListener() {
  if (inputValidator.validateX() && inputValidator.validateY()) {
    fetch("php/Server.php", {
      method: "POST",
      body: JSON.stringify({
        x: inputValidator.getX,
        y: inputValidator.getY,
        r: findAndReturnSelectedRadius(),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "error") {
          doAttention(data.message);
        } else if (data.status === "success") {
          tableWorker.innerData(data.message);
          drawAllPoints(graph);
        }
      })
      .catch((error) => alert(error.json().message));
  }
}

function drawAllPoints(canvasPrinter) {
  let table = document.querySelector("table");
  let rows = table.rows;

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];

    let inRange = row.cells[2].innerText;
    let x = row.cells[3].innerText;
    let y = row.cells[4].innerText;
    canvasPrinter.drawPoint(x, y, inRange.toLowerCase() === "true");
  }
}

function doAttention(text) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: text,
  });
}

$(document).ready(function () {
  graph.redrawAll(findAndReturnSelectedRadius());
});
