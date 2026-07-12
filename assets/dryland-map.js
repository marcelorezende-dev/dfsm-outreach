/* DFSA interactive dryland map — Leaflet overlay of the UNEP-WCMC (2007) global drylands.
   Depends on Leaflet (window.L) and the drylands data (window.DRYLANDS_GEO).
   Usage:  DFSADrylandMap({ el:'map', zoom:1.6, legend:true });                       */
(function () {
  'use strict';

  var CLASSES = [
    { key: 'presumed', label: 'Presumed drylands', ai: 'AI ≥ 0.65 with dryland features',
      color: '#4E7C59', desc: 'Wetter than the aridity threshold, yet dry-forest, savanna and woodland in character — the Cerrado, Miombo–Mopane and Qinghai–Tibetan Plateau. DFSA counts these as drylands.',
      unccd: false, cbd: 'presumed' },
    { key: 'drysubhumid', label: 'Dry sub-humid', ai: 'AI 0.50 – 0.65',
      color: '#E7C878', desc: 'The least dry zone — Sudanian savanna, tree steppes and prairie. Most dryland forests occur here.',
      unccd: true, cbd: true },
    { key: 'semiarid', label: 'Semi-arid', ai: 'AI 0.20 – 0.50',
      color: '#DDA14A', desc: 'Grasslands and open woodlands where rainfall is low and highly seasonal.',
      unccd: true, cbd: true },
    { key: 'arid', label: 'Arid', ai: 'AI 0.05 – 0.20',
      color: '#C87039', desc: 'Sparse vegetation, long dry seasons and a high risk of desertification.',
      unccd: true, cbd: true },
    { key: 'hyperarid', label: 'Hyper-arid', ai: 'AI < 0.05',
      color: '#9B3B2E', desc: 'True desert — the Sahara and Arabian deserts. Excluded from the UNCCD definition but part of the CBD map.',
      unccd: false, cbd: true }
  ];
  var BY_KEY = {}; CLASSES.forEach(function (c) { BY_KEY[c.key] = c; });

  function darken(hex, f) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function baseStyle(c) {
    return { color: darken(c.color, 0.72), weight: 0.5, opacity: 0.55, fillColor: c.color, fillOpacity: 0.74 };
  }
  function hiStyle(c) {
    return { color: darken(c.color, 0.6), weight: 1.4, opacity: 0.95, fillColor: c.color, fillOpacity: 0.9 };
  }

  window.DFSADrylandMap = function (opts) {
    opts = opts || {};
    var el = typeof opts.el === 'string' ? document.getElementById(opts.el) : opts.el;
    if (!el) return null;
    if (!window.L || !window.DRYLANDS_GEO) {
      el.innerHTML = '<div style="padding:24px;font-family:var(--sans),sans-serif;color:#9A8C7E;font-size:13px">Map library still loading…</div>';
      return null;
    }

    var map = L.map(el, {
      center: opts.center || [16, 10],
      zoom: opts.zoom || 1.6,
      minZoom: opts.minZoom || 1,
      maxZoom: opts.maxZoom || 7,
      scrollWheelZoom: !!opts.scrollZoom,
      zoomControl: opts.zoomControl !== false,
      worldCopyJump: true,
      attributionControl: true
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 12,
      attribution: 'Drylands: UNEP-WCMC (2007) via FAO WP30 &middot; Base &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // info readout (top-right)
    var info = L.control({ position: 'topright' });
    info.onAdd = function () {
      var d = L.DomUtil.create('div', 'dm-info');
      d.innerHTML = defaultInfo();
      this._d = d; return d;
    };
    info.setContent = function (c) {
      this._d.innerHTML = c ? classInfo(c) : defaultInfo();
    };
    info.addTo(map);

    function defaultInfo() {
      return '<b>Global drylands</b><span class="dm-hint">Hover a region or legend swatch</span>';
    }
    function classInfo(c) {
      var badges = '<span class="dm-badge ' + (c.unccd ? 'on' : 'off') + '">UNCCD ' + (c.unccd ? '✓' : '–') + '</span>' +
        '<span class="dm-badge ' + (c.cbd ? 'on' : 'off') + '">CBD ' + (c.cbd === 'presumed' ? 'presumed' : (c.cbd ? '✓' : '–')) + '</span>';
      return '<b style="color:' + darken(c.color, 0.7) + '">' + c.label + '</b>' +
        '<span class="dm-ai">' + c.ai + '</span>' +
        '<span class="dm-desc">' + c.desc + '</span>' +
        '<span class="dm-badges">' + badges + '</span>';
    }

    // one layer per class so we can highlight/toggle independently
    var layers = {};
    var byClass = {};
    (window.DRYLANDS_GEO.features || []).forEach(function (f) { byClass[f.properties.cls] = f; });

    // draw driest first so the emphasised presumed-green sits visually clear
    ['hyperarid', 'arid', 'semiarid', 'drysubhumid', 'presumed'].forEach(function (key) {
      var f = byClass[key]; if (!f) return;
      var c = BY_KEY[key];
      var layer = L.geoJSON(f, {
        style: baseStyle(c),
        onEachFeature: function (feat, lyr) {
          lyr.on('mouseover', function () { highlight(key); });
          lyr.on('mouseout', function () { reset(); });
        }
      }).addTo(map);
      layers[key] = layer;
    });

    var active = null;
    function highlight(key) {
      active = key;
      CLASSES.forEach(function (c) {
        if (!layers[c.key]) return;
        layers[c.key].setStyle(c.key === key ? hiStyle(c) : dimStyle(c));
      });
      if (layers[key]) layers[key].bringToFront();
      info.setContent(BY_KEY[key]);
      if (legendRows[key]) setActiveRow(key);
    }
    function reset() {
      active = null;
      CLASSES.forEach(function (c) { if (layers[c.key]) layers[c.key].setStyle(baseStyle(c)); });
      info.setContent(null);
      setActiveRow(null);
    }
    function dimStyle(c) {
      var s = baseStyle(c); s.fillOpacity = 0.32; s.opacity = 0.25; return s;
    }

    // legend + optional interactive rows
    var legendRows = {};
    function setActiveRow(key) {
      Object.keys(legendRows).forEach(function (k) {
        legendRows[k].className = 'dm-row' + (k === key ? ' active' : '');
      });
    }
    if (opts.legend !== false) {
      var legend = L.control({ position: opts.legendPosition || 'bottomleft' });
      legend.onAdd = function () {
        var d = L.DomUtil.create('div', 'dm-legend' + (opts.compact ? ' compact' : ''));
        var head = L.DomUtil.create('div', 'dm-legend-h', d);
        head.textContent = 'Aridity zones';
        CLASSES.forEach(function (c) {
          var row = L.DomUtil.create('div', 'dm-row', d);
          row.innerHTML = '<span class="dm-sw" style="background:' + c.color + '"></span>' +
            '<span class="dm-lb">' + c.label + '</span>' +
            (opts.compact ? '' : '<span class="dm-rg">' + c.ai + '</span>');
          if (c.key === 'presumed') row.className += ' presumed';
          legendRows[c.key] = row;
          L.DomEvent.on(row, 'mouseover', function () { highlight(c.key); });
          L.DomEvent.on(row, 'mouseout', function () { reset(); });
        });
        if (!opts.compact) {
          var note = L.DomUtil.create('div', 'dm-note', d);
          note.innerHTML = 'Green = <b>presumed drylands</b>: dryland-like forests DFSA also counts.';
        }
        L.DomEvent.disableClickPropagation(d);
        return d;
      };
      legend.addTo(map);
    }

    return map;
  };

  // inject component styles once
  if (!document.getElementById('dm-style')) {
    var s = document.createElement('style');
    s.id = 'dm-style';
    s.textContent = [
      '.dm-info{background:rgba(255,255,255,.94);backdrop-filter:blur(4px);border:1px solid rgba(36,31,27,.14);border-radius:12px;padding:11px 13px;max-width:230px;box-shadow:0 4px 10px rgba(36,31,27,.08);font-family:var(--sans),system-ui,sans-serif;line-height:1.45;}',
      '.dm-info b{display:block;font-size:12.5px;letter-spacing:.01em;color:#241F1B;}',
      '.dm-info .dm-hint{display:block;font-size:10.5px;color:#9A8C7E;margin-top:3px;}',
      '.dm-info .dm-ai{display:block;font-size:10.5px;font-weight:600;color:#6B5E54;margin:2px 0 5px;}',
      '.dm-info .dm-desc{display:block;font-size:11px;color:#6B5E54;}',
      '.dm-info .dm-badges{display:flex;gap:5px;margin-top:7px;}',
      '.dm-badge{font-size:9px;text-transform:uppercase;letter-spacing:.06em;font-weight:600;padding:2px 6px;border-radius:20px;}',
      '.dm-badge.on{background:rgba(78,124,89,.14);color:#356046;}',
      '.dm-badge.off{background:rgba(36,31,27,.06);color:#9A8C7E;}',
      '.dm-legend{background:rgba(255,255,255,.94);backdrop-filter:blur(4px);border:1px solid rgba(36,31,27,.14);border-radius:12px;padding:9px 11px 8px;box-shadow:0 4px 10px rgba(36,31,27,.08);font-family:var(--sans),system-ui,sans-serif;}',
      '.dm-legend-h{font-size:9.5px;text-transform:uppercase;letter-spacing:.11em;font-weight:700;color:#9A8C7E;margin-bottom:6px;}',
      '.dm-row{display:flex;align-items:center;gap:7px;padding:2.5px 4px;margin:0 -4px;border-radius:6px;cursor:default;transition:background .12s;}',
      '.dm-row:hover,.dm-row.active{background:rgba(36,31,27,.05);}',
      '.dm-row.presumed .dm-lb{font-weight:700;}',
      '.dm-sw{width:13px;height:13px;border-radius:3px;flex:none;box-shadow:inset 0 0 0 1px rgba(36,31,27,.16);}',
      '.dm-lb{font-size:11.5px;color:#241F1B;white-space:nowrap;}',
      '.dm-rg{font-size:10px;color:#9A8C7E;margin-left:auto;padding-left:12px;}',
      '.dm-legend.compact .dm-lb{font-size:11px;}',
      '.dm-note{font-size:10px;color:#6B5E54;margin-top:7px;padding-top:6px;border-top:1px solid rgba(36,31,27,.1);max-width:220px;line-height:1.4;}',
      '.dm-note b{color:#356046;}',
      '.leaflet-container{background:#EDE8DC;font-family:var(--sans),system-ui,sans-serif;}'
    ].join('\n');
    document.head.appendChild(s);
  }
})();
