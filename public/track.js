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

  function detectarDispositivo() {
    var ua = navigator.userAgent || "";
    var width = window.innerWidth || 0;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || (width >= 768 && width <= 1024)) {
      return "Tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || width < 768) {
      return "Móvil";
    }
    return "Desktop";
  }

  function detectarNavegador() {
    var ua = navigator.userAgent || "";
    if (ua.indexOf("Firefox") > -1) return "Firefox";
    if (ua.indexOf("SamsungBrowser") > -1) return "Samsung Browser";
    if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "Opera";
    if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) return "Edge";
    if (ua.indexOf("Chrome") > -1) return "Chrome";
    if (ua.indexOf("Safari") > -1) return "Safari";
    return "Otro";
  }

  function detectarOS() {
    var ua = navigator.userAgent || "";
    if (ua.indexOf("Win") > -1) return "Windows";
    if (ua.indexOf("Mac") > -1 && ua.indexOf("iPhone") === -1 && ua.indexOf("iPad") === -1) return "macOS";
    if (ua.indexOf("Android") > -1) return "Android";
    if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1 || ua.indexOf("iPod") > -1) return "iOS";
    if (ua.indexOf("Linux") > -1) return "Linux";
    return "Otro";
  }

  function obtenerUTMs() {
    var params = new URLSearchParams(location.search);
    var utmSource = params.get("utm_source");
    var utmMedium = params.get("utm_medium");
    var utmCampaign = params.get("utm_campaign");
    var utmTerm = params.get("utm_term");
    var utmContent = params.get("utm_content");

    if (!utmSource && !utmMedium && !utmCampaign) return undefined;

    return {
      source: utmSource || undefined,
      medium: utmMedium || undefined,
      campaign: utmCampaign || undefined,
      term: utmTerm || undefined,
      content: utmContent || undefined,
    };
  }

  function esEnlaceSaliente(a) {
    if (!a || !a.href) return false;
    var href = a.href;
    if (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0 || href.indexOf("whatsapp:") === 0) return true;
    if (href.indexOf("http://") === 0 || href.indexOf("https://") === 0) {
      try {
        var urlObj = new URL(href);
        return urlObj.hostname !== location.hostname && urlObj.hostname.length > 0;
      } catch {
        return false;
      }
    }
    return false;
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

  window.iasmPulse = {
    track: function (eventName, eventMetadata) {
      if (!eventName || typeof eventName !== "string") return;
      var meta = { eventName: eventName };
      if (eventMetadata && typeof eventMetadata === "object") {
        for (var k in eventMetadata) {
          if (Object.prototype.hasOwnProperty.call(eventMetadata, k)) {
            meta[k] = eventMetadata[k];
          }
        }
      }
      agregarEvento({
        type: "custom",
        url: location.pathname + location.search,
        metadata: meta,
      });
    },
  };

  agregarEvento({
    type: "pageview",
    url: location.pathname + location.search,
    referrer: document.referrer || undefined,
    metadata: {
      device: detectarDispositivo(),
      browser: detectarNavegador(),
      os: detectarOS(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      utm: obtenerUTMs(),
    },
  });

  setTimeout(function () {
    var title = (document.title || "").toLowerCase();
    var bodyText = (document.body ? document.body.innerText || "" : "").toLowerCase();
    if (
      title.indexOf("404") > -1 ||
      title.indexOf("no encontrada") > -1 ||
      title.indexOf("not found") > -1 ||
      bodyText.indexOf("404 -") > -1 ||
      bodyText.indexOf("página no encontrada") > -1 ||
      bodyText.indexOf("this page could not be found") > -1
    ) {
      agregarEvento({
        type: "custom",
        url: location.pathname + location.search,
        metadata: {
          eventName: "error_404",
          brokenUrl: location.pathname + location.search,
        },
      });
    }
  }, 1200);

  document.addEventListener("click", function (evento) {
    var target = evento.target;
    var pulseEl = target && target.closest ? target.closest("[data-pulse-event]") : null;
    if (pulseEl) {
      var evtName = pulseEl.getAttribute("data-pulse-event");
      if (evtName) {
        window.iasmPulse.track(evtName);
      }
    }

    var anchor = target && target.closest ? target.closest("a") : null;
    if (anchor && esEnlaceSaliente(anchor)) {
      var href = anchor.href;
      var host = "";
      try { host = new URL(href).hostname; } catch {}
      agregarEvento({
        type: "custom",
        url: location.pathname + location.search,
        metadata: {
          eventName: "outbound_link",
          targetUrl: href,
          targetHost: host,
          text: (anchor.innerText || "").trim().slice(0, 50),
        },
      });
    }

    agregarEvento({
      type: "click",
      url: location.pathname + location.search,
      x: evento.clientX / window.innerWidth,
      y: evento.clientY / window.innerHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
  }, true);

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
