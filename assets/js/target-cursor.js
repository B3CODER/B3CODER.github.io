(function () {
  "use strict";

  var targetSelector = ".cursor-target";
  var spinDuration = 2;
  var cornerSize = 12;
  var borderWidth = 3;
  var baseCorners = [
    { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
    { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
    { x: cornerSize * 0.5, y: cornerSize * 0.5 },
    { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
  ];

  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none), (pointer: coarse), (max-width: 768px)").matches
    );
  }

  function createCorner(className) {
    var corner = document.createElement("div");
    corner.className = "target-cursor-corner " + className;
    return corner;
  }

  function lerp(from, to, amount) {
    return from + (to - from) * amount;
  }

  function initTargetCursor() {
    if (isTouchDevice() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var cursor = document.createElement("div");
    var dot = document.createElement("div");
    var corners = [
      createCorner("corner-tl"),
      createCorner("corner-tr"),
      createCorner("corner-br"),
      createCorner("corner-bl")
    ];

    cursor.className = "target-cursor-wrapper";
    dot.className = "target-cursor-dot";
    cursor.appendChild(dot);
    corners.forEach(function (corner) {
      cursor.appendChild(corner);
    });
    document.body.appendChild(cursor);
    document.body.classList.add("target-cursor-enabled");

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var cursorX = mouseX;
    var cursorY = mouseY;
    var activeTarget = null;
    var rotation = 0;
    var lastTime = performance.now();
    var cornerState = baseCorners.map(function (corner) {
      return { x: corner.x, y: corner.y };
    });

    function targetCorners() {
      if (!activeTarget) {
        return baseCorners;
      }

      var rect = activeTarget.getBoundingClientRect();
      return [
        { x: rect.left - borderWidth - cursorX, y: rect.top - borderWidth - cursorY },
        { x: rect.right + borderWidth - cornerSize - cursorX, y: rect.top - borderWidth - cursorY },
        { x: rect.right + borderWidth - cornerSize - cursorX, y: rect.bottom + borderWidth - cornerSize - cursorY },
        { x: rect.left - borderWidth - cursorX, y: rect.bottom + borderWidth - cornerSize - cursorY }
      ];
    }

    function animate(now) {
      var delta = Math.min(now - lastTime, 40);
      lastTime = now;

      cursorX = lerp(cursorX, mouseX, 0.28);
      cursorY = lerp(cursorY, mouseY, 0.28);

      if (!activeTarget) {
        rotation += (delta / (spinDuration * 1000)) * 360;
      }

      cursor.style.transform =
        "translate3d(" + cursorX + "px, " + cursorY + "px, 0) rotate(" + (activeTarget ? 0 : rotation) + "deg)";

      var desiredCorners = targetCorners();
      var strength = activeTarget ? 0.32 : 0.22;

      corners.forEach(function (corner, index) {
        cornerState[index].x = lerp(cornerState[index].x, desiredCorners[index].x, strength);
        cornerState[index].y = lerp(cornerState[index].y, desiredCorners[index].y, strength);
        corner.style.transform =
          "translate3d(" + cornerState[index].x + "px, " + cornerState[index].y + "px, 0)";
      });

      requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    document.addEventListener("mouseover", function (event) {
      var target = event.target.closest(targetSelector);
      if (target) {
        activeTarget = target;
      }
    });

    document.addEventListener("mouseout", function (event) {
      if (!activeTarget) {
        return;
      }

      if (event.relatedTarget && activeTarget.contains(event.relatedTarget)) {
        return;
      }

      if (event.target === activeTarget || activeTarget.contains(event.target)) {
        activeTarget = null;
      }
    });

    document.addEventListener("mousedown", function () {
      cursor.classList.add("is-pressed");
    });

    document.addEventListener("mouseup", function () {
      cursor.classList.remove("is-pressed");
    });

    requestAnimationFrame(animate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTargetCursor);
  } else {
    initTargetCursor();
  }
})();
