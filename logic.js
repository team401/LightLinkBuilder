document.getElementById("addBtn").addEventListener("click", handleAdding);
document.getElementById("removeBtn").addEventListener("click", handleRemove);
document.getElementById("downloadBtn").addEventListener("click", handleDownload);

function handleAdding() {
  var cardCount = $(".card").length;
  if (cardCount < 16) {
    $(".card:first-of-type").clone().appendTo("#cardHolder");
  }

  updateButtons();
}

function updateButtons() {
  var cardCount = $(".card").length;

  $("#addBtn")[0].disabled = cardCount >= 16
  $("#removeBtn")[0].disabled = cardCount <= 1;
}

function dataFetch() {
  var pinInputs = $(".pinNumber");
  var stripLengths = $(".stripLength");
  var grbwLeds = $(".grbw");
  var khz400s = $(".khz400");

  var formattedStrings = "";

  for (var i = 0; i < pinInputs.length; i++) {
    var pinVal = pinInputs[i].value;
    var stripLen = stripLengths[i].value;
    var ledType = grbwLeds[i].classList.contains("active") ? "GRBW" : "GRB";
    var freq = khz400s[i].classList.contains("active") ? "KHZ_400" : "KHZ_800";

    formattedStrings += "\taddStrip(" + pinVal + ", " + stripLen + ", NEO_" + ledType + " + NEO_" + freq + ");\n";
  }

  return formattedStrings;
}


function download(filename, data) {
  var blob = new Blob([data], {
    type: 'text/csv'
  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

function handleDownload() {
  var linesToAdd = dataFetch();
  var searchText = "//ADD STRIPS HERE"
  var addPosition = baseText.indexOf(searchText) + searchText.length + 1;

  var outputText = [baseText.slice(0, addPosition), linesToAdd, baseText.slice(addPosition)].join('');
  download("LightLink.ino", outputText);
}

function handleRemove() {
  var cardCount = $(".card").length;

  if (cardCount > 1) {
    var lastLine = $(".card:last-of-type").remove();
  }

  updateButtons();
}

var baseText = "";
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/team401/LightLink/master/LightLink.ino', true);
xhr.onload = function (e) {
  if (this.status == 200) {
    baseText = this.response;
  }
};

xhr.send();