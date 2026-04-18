(function () {
  var rotators = document.querySelectorAll("[data-rotating-text]");

  if (!rotators.length) {
    return;
  }

  rotators.forEach(function (rotator) {
    var texts = rotator.getAttribute("data-rotating-text").split("|").filter(Boolean);
    var value = rotator.querySelector(".rotating-text__value");
    var index = 0;

    if (!texts.length || !value) {
      return;
    }

    window.setInterval(function () {
      rotator.classList.add("is-leaving");

      window.setTimeout(function () {
        index = (index + 1) % texts.length;
        value.textContent = texts[index];
        rotator.classList.remove("is-leaving");
      }, 240);
    }, 2000);
  });
}());
