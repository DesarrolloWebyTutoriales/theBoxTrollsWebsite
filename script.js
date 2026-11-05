/* ==========================================================
   THE BOXTROLLS — CHEESEBRIDGE EXPLORER
   Scene navigation, hotspots and character dialogs.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const scenes = [...document.querySelectorAll(".scene[data-scene]")];
  const modal = document.getElementById("storyModal");
  const modalKicker = document.getElementById("storyKicker");
  const modalTitle = document.getElementById("storyTitle");
  const modalText = document.getElementById("storyText");
  const modalClose = modal?.querySelector(".modal-close");
  const explorer = document.querySelector(".explorer");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stories = {
    streets: {
      kicker: "CHEESEBRIDGE",
      title: "The old streets",
      text: "Crooked buildings, narrow lanes and curious shopfronts make every corner of Cheesebridge feel like a little mystery."
    },
    cheese: {
      kicker: "A TOWN OBSESSION",
      title: "The cheese market",
      text: "Cheese is at the heart of Cheesebridge society. The town's strange customs and its love of cheese shape the world above the streets."
    },
    inventions: {
      kicker: "THE HIDEOUT",
      title: "Found objects",
      text: "The Boxtrolls see possibility in things other people throw away. Their underground home is filled with curious treasures and improvised creations."
    },
    passage: {
      kicker: "UNDER THE CITY",
      title: "The secret passage",
      text: "A hidden route winds beneath Cheesebridge. Follow it carefully — you never know where an underground passage might lead."
    },
    mystery: {
      kicker: "SOMETHING IS HIDING",
      title: "What's down there?",
      text: "The tunnels hold secrets, forgotten corners and unexpected discoveries. Keep exploring the world beneath the town."
    },
    machine: {
      kicker: "THE WORKSHOP",
      title: "Curious machines",
      text: "Old parts, useful tools and a little imagination can turn almost anything into an invention."
    },
    eggs: {
      kicker: "MEET THE CHARACTERS",
      title: "Eggs",
      text: "Eggs is a human boy who has grown up among the Boxtrolls. His life beneath Cheesebridge has given him a very different view of the world above."
    },
    fish: {
      kicker: "MEET THE CHARACTERS",
      title: "Fish",
      text: "Fish is one of the Boxtrolls, part of the close-knit underground family that has made a home beneath Cheesebridge."
    },
    shoe: {
      kicker: "MEET THE CHARACTERS",
      title: "Shoe",
      text: "Shoe is another member of the Boxtrolls' curious community. Every Boxtroll has a place in this unusual underground family."
    }
  };

  function showScene(name) {
    const target = scenes.find(scene => scene.dataset.scene === name);
    if (!target) return;

    scenes.forEach(scene => {
      const active = scene === target;
      scene.classList.toggle("is-active", active);
      scene.setAttribute("aria-hidden", String(!active));
    });

    closeModal();
    menuLinks.forEach(link => link.classList.toggle("is-current", link.dataset.menuGo === name));
  }

  function openModal(key) {
    const story = stories[key];
    if (!story || !modal) return;

    modalKicker.textContent = story.kicker;
    modalTitle.textContent = story.title;
    modalText.textContent = story.text;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showScene(button.dataset.go));
  });

  document.querySelectorAll("[data-info]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.info));
  });

  document.querySelectorAll("[data-person]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.person));
  });


  // Left-side drop-down navigation menu
  const siteMenu = document.querySelector(".site-menu");
  const menuToggle = document.getElementById("menuToggle");
  const menuPanel = document.getElementById("menuPanel");
  const menuLinks = [...document.querySelectorAll("[data-menu-go]")];

  function setMenuOpen(open) {
    if (!siteMenu || !menuToggle || !menuPanel) return;
    siteMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuPanel.setAttribute("aria-hidden", String(!open));
  }

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      const destination = link.dataset.menuGo;
      showScene(destination);
      menuLinks.forEach(item => item.classList.toggle("is-current", item === link));
      setMenuOpen(false);
    });
  });

  document.addEventListener("click", event => {
    if (siteMenu && !siteMenu.contains(event.target)) setMenuOpen(false);
  });

  modalClose?.addEventListener("click", closeModal);

  modal?.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
      setMenuOpen(false);
    }
  });


  /* ----------------------------------------------------------
     PARALLAX: pointer movement shifts the background and
     foreground layers at different speeds. Disabled when the
     visitor requests reduced motion or is using a touch device.
  ---------------------------------------------------------- */
  if (explorer && !prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let frameRequested = false;
    let pointerX = 0;
    let pointerY = 0;

    explorer.addEventListener("pointermove", event => {
      const bounds = explorer.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      if (frameRequested) return;
      frameRequested = true;

      window.requestAnimationFrame(() => {
        const activeScene = scenes.find(scene => scene.classList.contains("is-active"));
        if (activeScene) {
          activeScene.style.setProperty("--parallax-x", `${pointerX * -13}px`);
          activeScene.style.setProperty("--parallax-y", `${pointerY * -10}px`);

          const doors = activeScene.querySelector(".map-doors");
          const hotspots = activeScene.querySelector(".hotspots");
          if (doors) doors.style.transform = `translate3d(${pointerX * 5}px, ${pointerY * 4}px, 0)`;
          if (hotspots) hotspots.style.transform = `translate3d(${pointerX * 4}px, ${pointerY * 3}px, 0)`;
        }
        frameRequested = false;
      });
    });

    explorer.addEventListener("pointerleave", () => {
      scenes.forEach(scene => {
        scene.style.setProperty("--parallax-x", "0px");
        scene.style.setProperty("--parallax-y", "0px");
        const doors = scene.querySelector(".map-doors");
        const hotspots = scene.querySelector(".hotspots");
        if (doors) doors.style.transform = "";
        if (hotspots) hotspots.style.transform = "";
      });
    });
  }

  /* Keyboard navigation between the four destinations. */
  document.addEventListener("keydown", event => {
    if (modal?.classList.contains("is-open")) return;
    if (event.key === "Home") showScene("map");
  });

  showScene("map");

});