(function () {
  var labels = document.querySelectorAll("[data-variable-proximity]");

  if (!labels.length) {
    return;
  }

  function splitLabel(label) {
    var text = label.textContent;
    label.textContent = "";
    label.setAttribute("aria-label", text);

    Array.prototype.forEach.call(text, function (character) {
      var span = document.createElement("span");

      if (character === " ") {
        span.className = "variable-proximity__space";
        span.setAttribute("aria-hidden", "true");
        span.innerHTML = "&nbsp;";
      } else {
        span.className = "variable-proximity__char";
        span.setAttribute("aria-hidden", "true");
        span.textContent = character;
      }

      label.appendChild(span);
    });
  }

  function updateLabel(label, pointerX, pointerY) {
    var radius = 110;
    var characters = label.querySelectorAll(".variable-proximity__char");

    Array.prototype.forEach.call(characters, function (character) {
      var rect = character.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var distance = Math.sqrt(Math.pow(pointerX - centerX, 2) + Math.pow(pointerY - centerY, 2));
      var proximity = Math.max(0, 1 - distance / radius);
      var weight = Math.round(560 + (1000 - 560) * proximity);
      var opticalSize = Math.round(12 + (40 - 12) * proximity);

      character.style.fontVariationSettings = "'wght' " + weight + ", 'opsz' " + opticalSize;
    });
  }

  function resetLabel(label) {
    var characters = label.querySelectorAll(".variable-proximity__char");

    Array.prototype.forEach.call(characters, function (character) {
      character.style.fontVariationSettings = "'wght' 560, 'opsz' 12";
    });
  }

  Array.prototype.forEach.call(labels, function (label) {
    splitLabel(label);

    label.addEventListener("pointermove", function (event) {
      updateLabel(label, event.clientX, event.clientY);
    });

    label.addEventListener("pointerleave", function () {
      resetLabel(label);
    });
  });
}());
