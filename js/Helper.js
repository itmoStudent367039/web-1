window.onload = function () {
  let canvasPrinter = new Graph();

  let findAndReturnSelectedRadius = () => {
    let selected = document.querySelector("input[name='R']:checked");
    return selected.value;
  };

  canvasPrinter.redrawAll(findAndReturnSelectedRadius());

  document.getElementById("radio-radius").onchange = function () {
    canvasPrinter.redrawAll(findAndReturnSelectedRadius());
    drawAllPoints(canvasPrinter);
  };

  document.getElementById("checkButton").onclick = function () {
    if (validateX() && validateY()) {
      let x = document.querySelector(".x-select").value;
      let y = document.getElementById("Y-input").value.replace(",", ".");
      let r = findAndReturnSelectedRadius();

      $.ajax({
        type: "POST",
        url: "php/Server.php",
        data: { x: x, y: y, r: r },
        success: function (serverAnswer) {
          const jsonObject = JSON.parse(serverAnswer);
          let table = document.querySelector("table");
          let tBody = table.getElementsByTagName("tbody")[0];
          let row = tBody.insertRow();

          row.insertCell().textContent = jsonObject.response_time;
          row.insertCell().textContent = jsonObject.current_time;
          row.insertCell().textContent = jsonObject.boolean;
          row.insertCell().textContent = jsonObject.x;
          row.insertCell().textContent = jsonObject.y;
          row.insertCell().textContent = jsonObject.r;

          drawAllPoints(canvasPrinter);
        },
      });
    }
  };

  document.getElementById("clearButton").onclick = function () {
    deleteAllRows(canvasPrinter, findAndReturnSelectedRadius());
  };
};

function drawAllPoints(canvasPrinter) {
  let table = document.querySelector("table");
  let rows = table.rows;

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];

    let inRange = row.cells[2].innerText;
    let x = row.cells[3].innerText;
    let y = row.cells[4].innerText;

    canvasPrinter.drawPoint(x, y, Boolean(inRange));
  }
}

function deleteAllRows(canvasPrinter, finder) {
  let table = document.querySelector("table");
  let rows = table.rows;

  for (let i = rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }

  canvasPrinter.redrawAll(finder);
}
