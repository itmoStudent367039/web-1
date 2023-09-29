function clearTable() {
  deleteAllRows(graph, findAndReturnSelectedRadius());
}

function deleteAllRows(canvasPrinter, finder) {
  let table = document.querySelector("table");
  let rows = table.rows;

  for (let i = rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }

  canvasPrinter.redrawAll(finder);
}
