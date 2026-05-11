(function () {
  "use strict";

  function shouldSkipMotion() {
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches
    );
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function bindTiltCard(card) {
    var rotateAmplitude = 8;
    var scaleOnHover = 1.018;
    var leaveTimer = null;

    function setTilt(event) {
      var rect = card.getBoundingClientRect();
      var offsetX = event.clientX - rect.left - rect.width / 2;
      var offsetY = event.clientY - rect.top - rect.height / 2;
      var rotateX = clamp((offsetY / (rect.height / 2)) * -rotateAmplitude, -rotateAmplitude, rotateAmplitude);
      var rotateY = clamp((offsetX / (rect.width / 2)) * rotateAmplitude, -rotateAmplitude, rotateAmplitude);

      card.style.transform =
        "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(" + scaleOnHover + ")";
    }

    card.addEventListener("mouseenter", function () {
      if (leaveTimer) {
        window.clearTimeout(leaveTimer);
      }
      card.style.transition = "transform 120ms ease, border-color 300ms ease, box-shadow 300ms ease";
    });

    card.addEventListener("mousemove", setTilt);

    card.addEventListener("mouseleave", function () {
      card.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, box-shadow 300ms ease";
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
      leaveTimer = window.setTimeout(function () {
        card.style.transform = "";
      }, 430);
    });
  }

  function bindProfileTilt(profile) {
    var rotateAmplitude = 10;

    function updateProfile(event) {
      var rect = profile.getBoundingClientRect();
      var percentX = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
      var percentY = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
      var centerX = percentX - 50;
      var centerY = percentY - 50;

      profile.style.setProperty("--profile-pointer-x", percentX + "%");
      profile.style.setProperty("--profile-pointer-y", percentY + "%");
      profile.style.setProperty("--profile-tilt-x", (centerX / 50) * rotateAmplitude + "deg");
      profile.style.setProperty("--profile-tilt-y", (centerY / 50) * -rotateAmplitude + "deg");
      profile.style.setProperty("--profile-scale", "1.04");
    }

    profile.addEventListener("mouseenter", function (event) {
      profile.classList.add("is-active");
      updateProfile(event);
    });

    profile.addEventListener("mousemove", updateProfile);

    profile.addEventListener("mouseleave", function () {
      profile.classList.remove("is-active");
      profile.style.setProperty("--profile-pointer-x", "50%");
      profile.style.setProperty("--profile-pointer-y", "50%");
      profile.style.setProperty("--profile-tilt-x", "0deg");
      profile.style.setProperty("--profile-tilt-y", "0deg");
      profile.style.setProperty("--profile-scale", "1");
    });
  }

  function initTiltInteractions() {
    if (shouldSkipMotion()) {
      return;
    }

    document.querySelectorAll(".tilt-card").forEach(bindTiltCard);
    document.querySelectorAll(".profile-card-tilt").forEach(bindProfileTilt);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTiltInteractions);
  } else {
    initTiltInteractions();
  }
})();
