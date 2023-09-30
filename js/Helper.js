const graph = new Graph();
const FROM_MINUS_THREE_TILL_THREE = new RegExp(
  /^-?(?:3(?:\.0+)?|[0-2](?:\.[0-9]+)?|\.[0-9]+)$/,
);
const TD_TAG = /<td>(.*?)<\/td>/g;

const inputValidator = {
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

const tableWorker = {
  table: document.querySelector("table"),
  innerData: function (tableRow) {
    let tBody = this.table.getElementsByTagName("tbody")[0];
    let row = document.createElement("tr");
    row.innerHTML = tableRow;
    tBody.appendChild(row);
  },
  getData: function () {
    let rows = this.table.rows;
    const array = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const requestTime = row.cells[0].innerText;
      const currentTime = row.cells[1].innerText;
      const inRange = row.cells[2].innerText;
      const x = row.cells[3].innerText;
      const y = row.cells[4].innerText;
      const r = row.cells[5].innerText;
      array.push({
        requestTime: requestTime,
        currentTime: currentTime,
        inRange: inRange,
        x: x,
        y: y,
        r: r,
      });
    }

    return array;
  },
  deleteAllRows: function () {
    let rows = this.table.rows;
    for (let i = rows.length - 1; i > 0; i--) {
      this.table.deleteRow(i);
    }
  },
};
const cacheWorker = {
  create: async function () {
    this.cache = await caches.open("PointStorage");
  },
  putPoint: async function (data, url) {
    await this.cache?.put(url + randomId(), new Response(JSON.stringify(data)));
  },
  clearCache: async function () {
    const keys = await this.cache?.keys();
    if (keys && keys.length > 0) {
      keys.forEach((request) => {
        this.cache.delete(request.url);
      });
    }
  },
  getAllCachedPoints: async function () {
    const keys = await this.cache?.keys();

    if (keys && keys.length > 0) {
      const data = [];
      for (let i = 0; i < keys.length; i++) {
        const response = await this.cache.match(keys[i]);
        const cachedData = await response.json();
        data.push(cachedData);
      }
      return data;
    } else {
      return null;
    }
  },
};
const htmlParser = {
  parse: function (rowString) {
    const matches = rowString.matchAll(TD_TAG);
    const rowData = [];

    for (const match of matches) {
      rowData.push(match[1]);
    }

    return {
      requestTime: rowData[0] || "",
      currentTime: rowData[1] || "",
      inRange: rowData[2] || "",
      x: rowData[3] || "",
      y: rowData[4] || "",
      r: rowData[5] || "",
    };
  },
  toHTML: function (object) {
    let html = "<tr>";
    for (const key in object) {
      html += "<td>" + object[key] + "</td>";
    }
    html += "</tr>";
    return html;
  },
};

async function clearTable() {
  await cacheWorker.clearCache();
  tableWorker.deleteAllRows();
  graph.redrawAll(findAndReturnSelectedRadius());
}

function addRadiusChangeListener() {
  graph.redrawAll(findAndReturnSelectedRadius());
  drawAllPoints(graph);
}

function findAndReturnSelectedRadius() {
  const selectedElement = document.querySelector("input[name='R']:checked");
  return selectedElement.value;
}

async function addCheckButtonListener() {
  if (inputValidator.validateX() && inputValidator.validateY()) {
    try {
      const response = await fetch("php/Server.php", {
        method: "POST",
        body: JSON.stringify({
          x: inputValidator.getX,
          y: inputValidator.getY,
          r: findAndReturnSelectedRadius(),
        }),
      });
      const data = await response.json();
      if (data?.status === "error") {
        doAttention(data?.message);
      } else if (data?.status === "success") {
        await cacheWorker.putPoint(
          htmlParser.parse(data?.message),
          "./data.html",
        );
        tableWorker.innerData(data?.message);
        drawAllPoints(graph);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

function drawAllPoints(canvasPrinter) {
  const data = tableWorker.getData();
  for (let i = 0; i < data.length; i++) {
    canvasPrinter.drawPoint(
      data[i]?.x,
      data[i]?.y,
      (data[i]?.inRange?.toLowerCase() ?? "") === "true",
    );
  }
}

function doAttention(text) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: text,
  });
}

function randomId() {
  const randomNumber = Math.floor(Math.random() * 100000);
  const timestamp = Date.now();
  return `${timestamp}-${randomNumber}`;
}

$(document).ready(async function () {
  await cacheWorker.create();
  const array = cacheWorker.getAllCachedPoints();
  (await array)?.forEach((info) => {
    tableWorker.innerData(htmlParser.toHTML(info));
    graph.drawPoint(
      info?.x,
      info?.y,
      (info?.inRange?.toLowerCase() ?? "") === "true",
    );
  });
  graph.redrawAll(findAndReturnSelectedRadius());
  drawAllPoints(graph);
});
