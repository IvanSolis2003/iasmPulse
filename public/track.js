(function () {
  "use strict";

  var scriptEl = document.currentScript;
  if (!scriptEl) return;

  var site = scriptEl.getAttribute("data-site");
  if (!site) return;

  var endpoint = new URL(scriptEl.src).origin + "/api/collect";
  var STORAGE_KEY = "iasmpulse_sid";

  function generarId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "id-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  }

  function obtenerSessionId() {
    try {
      var existente = window.localStorage.getItem(STORAGE_KEY);
      if (existente) return existente;
      var nuevo = generarId();
      window.localStorage.setItem(STORAGE_KEY, nuevo);
      return nuevo;
    } catch {
      return generarId();
    }
  }

  var sessionId = obtenerSessionId();
  var cola = [];
  var MAX_COLA = 50;

  function agregarEvento(evento) {
    cola.push(evento);
  }

  function reencolar(eventos) {
    cola = eventos.concat(cola);
    if (cola.length > MAX_COLA) {
      cola = cola.slice(cola.length - MAX_COLA);
    }
  }

  function vaciarCola(porCierre) {
    if (cola.length === 0) return;
    var eventos = cola;
    cola = [];
    var payload = JSON.stringify({ site: site, sessionId: sessionId, events: eventos });

    if (porCierre && navigator.sendBeacon) {
      var enviado = navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
      if (!enviado) reencolar(eventos);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    })
      .then(function (respuesta) {
        if (!respuesta.ok) reencolar(eventos);
      })
      .catch(function () {
        reencolar(eventos);
      });
  }

  agregarEvento({
    type: "pageview",
    url: location.pathname + location.search,
    referrer: document.referrer || undefined,
  });

  document.addEventListener("click", function (evento) {
    agregarEvento({
      type: "click",
      url: location.pathname + location.search,
      x: evento.clientX / window.innerWidth,
      y: evento.clientY / window.innerHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
  });

  setInterval(function () {
    vaciarCola(false);
  }, 5000);

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") vaciarCola(true);
  });

  window.addEventListener("pagehide", function () {
    vaciarCola(true);
  });
})();
