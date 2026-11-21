/**
 * HABITAT IQ - Core Application & Reactive Geospatial Telemetry Controller
 * Hackathon: ASTRA 2026 | ANTERiX Club, VIT Bhopal
 * Data Sources: ISRO Bhuvan, MOSDAC, VEDAS, Bhoonidhi
 * Integrated Leaflet Map Engine & Space-Service Resilience Dispatcher
 */

(function () {
  'use strict';

  // Application Global State
  const state = {
    currentRegionId: 'sundarbans',
    isDisruptionMode: false,
    threatFilterType: 'all',
    threatFilterSeverity: 'all',
    activeBasemap: 'satellite',
    isAutoRefresh: true,
    timeCompareState: 'now', // 'before' or 'now'
    measureModeActive: false,
    measurePoints: [],
    measureLayer: null,
    drawAoiActive: false,
    aoiLayer: null,
    sidePanelCollapsed: false,
    mapInstance: null,
    heroMiniMapInstance: null,
    mapLayers: {
      basemaps: {},
      forest: null,
      fire: null,
      threats: null,
      corridors: null,
      riskZones: null,
      satPass: null,
      disruption: null
    },
    reports: [...HABITAT_DATA.initialReports],
    charts: {
      health: null,
      forecast: null
    },
    chatHistory: [
      {
        role: 'bot',
        text: "Hey there! I'm **Habi**, your field intelligence teammate here at HABITAT IQ 🌿. I keep an eye on live satellite passes, forest risks, and wildlife corridors across Indian reserves using ISRO data. How can I assist your field operations today?"
      }
    ]
  };

  // DOM Cache
  const dom = {};

  function initDom() {
    dom.regionSelect = document.getElementById('regionSelect');
    dom.mapQuickRegionJump = document.getElementById('mapQuickRegionJump');
    dom.disruptionToggle = document.getElementById('disruptionToggle');
    dom.disruptionBanner = document.getElementById('disruptionBanner');
    dom.disruptionWhatChanged = document.getElementById('disruptionWhatChanged');

    // Quick Stat Indicators
    dom.statRiskIndex = document.getElementById('statRiskIndex');
    dom.statRiskSub = document.getElementById('statRiskSub');
    dom.statNdvi = document.getElementById('statNdvi');
    dom.statNdviSub = document.getElementById('statNdviSub');
    dom.statNextPass = document.getElementById('statNextPass');
    dom.statNextPassSub = document.getElementById('statNextPassSub');
    dom.statLinkStatus = document.getElementById('statLinkStatus');
    dom.statLinkSub = document.getElementById('statLinkSub');

    // Header Meta & Titles
    dom.currentRegionName = document.getElementById('currentRegionName');
    dom.currentRegionMeta = document.getElementById('currentRegionMeta');
    dom.heroPreviewTitle = document.getElementById('heroPreviewTitle');
    dom.heroPreviewCoords = document.getElementById('heroPreviewCoords');

    // Map UI Elements
    dom.mapViewportWrapper = document.getElementById('mapViewportWrapper');
    dom.mapFallbackBanner = document.getElementById('mapFallbackBanner');
    dom.toggleSidePanelBtn = document.getElementById('toggleSidePanelBtn');
    dom.resetMapViewBtn = document.getElementById('resetMapViewBtn');
    dom.mapFullscreenBtn = document.getElementById('mapFullscreenBtn');
    dom.measureDistanceBtn = document.getElementById('measureDistanceBtn');
    dom.drawAoiBtn = document.getElementById('drawAoiBtn');
    dom.toggleLayersDrawerBtn = document.getElementById('toggleLayersDrawerBtn');
    dom.layersDropdownPanel = document.getElementById('layersDropdownPanel');

    // Basemap Buttons
    dom.btnBasemapSatellite = document.getElementById('btnBasemapSatellite');
    dom.btnBasemapTerrain = document.getElementById('btnBasemapTerrain');
    dom.btnBasemapPlain = document.getElementById('btnBasemapPlain');

    // Layer Checkboxes
    dom.chkLayerForest = document.getElementById('chkLayerForest');
    dom.chkLayerFire = document.getElementById('chkLayerFire');
    dom.chkLayerThreats = document.getElementById('chkLayerThreats');
    dom.chkLayerCorridors = document.getElementById('chkLayerCorridors');
    dom.chkLayerRiskZones = document.getElementById('chkLayerRiskZones');
    dom.chkLayerSatPass = document.getElementById('chkLayerSatPass');

    // Map Side Panel
    dom.sidePanelRegionName = document.getElementById('sidePanelRegionName');
    dom.sidePanelEcoType = document.getElementById('sidePanelEcoType');
    dom.sidePanelRiskScore = document.getElementById('sidePanelRiskScore');
    dom.sidePanelAlertCount = document.getElementById('sidePanelAlertCount');
    dom.sidePanelAlertsList = document.getElementById('sidePanelAlertsList');
    dom.sidePanelPassSat = document.getElementById('sidePanelPassSat');
    dom.sidePanelPassDetails = document.getElementById('sidePanelPassDetails');

    // Time & Refresh Controls
    dom.timeCompareSlider = document.getElementById('timeCompareSlider');
    dom.autoRefreshCheckbox = document.getElementById('autoRefreshCheckbox');
    dom.mapLastUpdatedTimestamp = document.getElementById('mapLastUpdatedTimestamp');

    // Module 1: Forest Health
    dom.healthSummary = document.getElementById('healthSummary');
    dom.healthCanopyCover = document.getElementById('healthCanopyCover');
    dom.healthCanopyChange = document.getElementById('healthCanopyChange');
    dom.healthStatusTag = document.getElementById('healthStatusTag');

    // Module 2: Disaster Risk
    dom.riskScoreFire = document.getElementById('riskScoreFire');
    dom.riskBarFire = document.getElementById('riskBarFire');
    dom.riskScoreFlood = document.getElementById('riskScoreFlood');
    dom.riskBarFlood = document.getElementById('riskBarFlood');
    dom.riskScoreDrought = document.getElementById('riskScoreDrought');
    dom.riskBarDrought = document.getElementById('riskBarDrought');
    dom.riskScoreLandslide = document.getElementById('riskScoreLandslide');
    dom.riskBarLandslide = document.getElementById('riskBarLandslide');
    dom.whyScoreText = document.getElementById('whyScoreText');

    // Module 3: 7-Day Forecast
    dom.forecastConfidence = document.getElementById('forecastConfidence');
    dom.forecastSummary = document.getElementById('forecastSummary');

    // Module 4: Threats
    dom.threatsList = document.getElementById('threatsList');
    dom.threatCountBadge = document.getElementById('threatCountBadge');

    // Module 5: Wildlife
    dom.wildlifeGrid = document.getElementById('wildlifeGrid');
    dom.corridorStatus = document.getElementById('corridorStatus');
    dom.corridorVulnerable = document.getElementById('corridorVulnerable');
    dom.corridorIndex = document.getElementById('corridorIndex');

    // Module 6: Satellite Passes
    dom.passTimeline = document.getElementById('passTimeline');

    // Module 7: Field Reports
    dom.reportForm = document.getElementById('reportForm');
    dom.reportQueueList = document.getElementById('reportQueueList');
    dom.reportFormCoords = document.getElementById('reportCoords');

    // Export Modal
    dom.exportBtn = document.getElementById('exportBriefingBtn');
    dom.exportModal = document.getElementById('exportModal');
    dom.closeModalBtn = document.getElementById('closeModalBtn');
    dom.printModalBtn = document.getElementById('printModalBtn');
    dom.exportContent = document.getElementById('exportContent');

    // AI Chatbox
    dom.chatLauncher = document.getElementById('chatLauncher');
    dom.chatDrawer = document.getElementById('chatDrawer');
    dom.closeChatBtn = document.getElementById('closeChatBtn');
    dom.clearChatBtn = document.getElementById('clearChatBtn');
    dom.chatMessages = document.getElementById('chatMessages');
    dom.chatInput = document.getElementById('chatInput');
    dom.chatSendBtn = document.getElementById('chatSendBtn');
    dom.typingIndicator = document.getElementById('typingIndicator');
    dom.chatChipTray = document.getElementById('chatChipTray');
    dom.chatVoiceBtn = document.getElementById('chatVoiceBtn');
    dom.chipList = document.querySelectorAll('.chat-chip');
  }

  // Get active region data
  function getRegion() {
    return HABITAT_DATA.regions[state.currentRegionId] || HABITAT_DATA.regions['sundarbans'];
  }

  function getRiskTheme(score) {
    if (score >= 70) return { level: 'High / Critical', colorClass: 'risk-score-high', barClass: 'risk-score-high-bar' };
    if (score >= 40) return { level: 'Moderate', colorClass: 'risk-score-med', barClass: 'risk-score-med-bar' };
    return { level: 'Low / Stable', colorClass: 'risk-score-low', barClass: 'risk-score-low-bar' };
  }

  // ==========================================================================
  // LEAFLET MAP ENGINE INITIALIZATION
  // ==========================================================================
  function initMaps() {
    const reg = getRegion();

    // 1. Initialize Main Leaflet Map
    if (document.getElementById('liveSatelliteMap')) {
      state.mapInstance = L.map('liveSatelliteMap', {
        center: reg.mapCenter,
        zoom: reg.mapZoom,
        minZoom: MAP_CONFIG.view.minZoom,
        maxZoom: MAP_CONFIG.view.maxZoom,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Initialize Basemaps
      state.mapLayers.basemaps.satellite = L.tileLayer(MAP_CONFIG.basemaps.satellite.url, {
        maxZoom: MAP_CONFIG.basemaps.satellite.maxZoom,
        attribution: MAP_CONFIG.basemaps.satellite.attribution
      });

      state.mapLayers.basemaps.terrain = L.tileLayer(MAP_CONFIG.basemaps.terrain.url, {
        maxZoom: MAP_CONFIG.basemaps.terrain.maxZoom,
        subdomains: MAP_CONFIG.basemaps.terrain.subdomains || 'abc',
        attribution: MAP_CONFIG.basemaps.terrain.attribution
      });

      state.mapLayers.basemaps.plain = L.tileLayer(MAP_CONFIG.basemaps.plain.url, {
        maxZoom: MAP_CONFIG.basemaps.plain.maxZoom,
        subdomains: MAP_CONFIG.basemaps.plain.subdomains || 'abcd',
        attribution: MAP_CONFIG.basemaps.plain.attribution
      });

      // Add DEFAULT Basemap: Satellite
      state.mapLayers.basemaps.satellite.addTo(state.mapInstance);

      // Verify Bhuvan token / WMS status
      if (!MAP_CONFIG.bhuvan.token || MAP_CONFIG.bhuvan.token.trim() === '') {
        if (dom.mapFallbackBanner) {
          dom.mapFallbackBanner.classList.add('active');
        }
      }

      // Initialize Layer Groups
      state.mapLayers.forest = L.layerGroup().addTo(state.mapInstance);
      state.mapLayers.fire = L.layerGroup().addTo(state.mapInstance);
      state.mapLayers.threats = L.layerGroup().addTo(state.mapInstance);
      state.mapLayers.corridors = L.layerGroup().addTo(state.mapInstance);
      state.mapLayers.riskZones = L.layerGroup().addTo(state.mapInstance);
      state.mapLayers.satPass = L.layerGroup().addTo(state.mapInstance);
      state.mapLayers.disruption = L.layerGroup().addTo(state.mapInstance);

      // Measure & AOI utility layer groups
      state.measureLayer = L.layerGroup().addTo(state.mapInstance);
      state.aoiLayer = L.layerGroup().addTo(state.mapInstance);

      // Map Click Inspector Event
      state.mapInstance.on('click', handleMapClick);

      // Render Active Overlays
      renderMapOverlays();
    }

    // 2. Initialize Mini Preview Map in Hero
    if (document.getElementById('heroMiniMap')) {
      state.heroMiniMapInstance = L.map('heroMiniMap', {
        center: reg.mapCenter,
        zoom: reg.mapZoom - 1,
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false
      });

      L.tileLayer(MAP_CONFIG.basemaps.satellite.url, {
        maxZoom: 18,
        attribution: ''
      }).addTo(state.heroMiniMapInstance);

      // Add a couple of sample markers on the preview
      renderMiniMapMarkers();
    }
  }

  // Switch Active Basemap Tile Layer
  function switchBasemap(mode) {
    if (!state.mapInstance) return;
    state.activeBasemap = mode;

    // Remove existing active basemaps
    Object.values(state.mapLayers.basemaps).forEach(layer => {
      if (state.mapInstance.hasLayer(layer)) {
        state.mapInstance.removeLayer(layer);
      }
    });

    // Add selected basemap
    if (state.mapLayers.basemaps[mode]) {
      state.mapLayers.basemaps[mode].addTo(state.mapInstance);
    }

    // Update active button state
    [dom.btnBasemapSatellite, dom.btnBasemapTerrain, dom.btnBasemapPlain].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    if (mode === 'satellite' && dom.btnBasemapSatellite) dom.btnBasemapSatellite.classList.add('active');
    if (mode === 'terrain' && dom.btnBasemapTerrain) dom.btnBasemapTerrain.classList.add('active');
    if (mode === 'plain' && dom.btnBasemapPlain) dom.btnBasemapPlain.classList.add('active');
  }

  // Render Overlays onto the Leaflet Map
  function renderMapOverlays() {
    if (!state.mapInstance) return;

    const reg = getRegion();
    const geo = reg.geoOverlays;
    const styles = MAP_CONFIG.styles;

    // Clear old data
    state.mapLayers.forest.clearLayers();
    state.mapLayers.fire.clearLayers();
    state.mapLayers.threats.clearLayers();
    state.mapLayers.corridors.clearLayers();
    state.mapLayers.riskZones.clearLayers();
    state.mapLayers.satPass.clearLayers();
    state.mapLayers.disruption.clearLayers();

    // 1. Forest Cover Overlay
    if (geo && geo.forestCoverPolygon) {
      const forestPoly = L.polygon(geo.forestCoverPolygon, {
        ...styles.forestCover,
        className: 'geojson-forest-cover'
      }).bindTooltip(`<strong>${reg.name} Forest Cover</strong><br>NDVI: ${reg.vegetation.ndviCurrent} · Canopy: ${reg.vegetation.canopyCover}`, {
        sticky: true
      });
      state.mapLayers.forest.addLayer(forestPoly);
    }

    // 2. Active Fire Hotspots Overlay
    if (geo && geo.firePoints && geo.firePoints.length > 0) {
      geo.firePoints.forEach(fp => {
        const fireCircle = L.circleMarker([fp.lat, fp.lng], {
          radius: 8,
          color: '#D90429',
          fillColor: '#FF4D6D',
          fillOpacity: 0.85,
          weight: 2
        }).bindPopup(`
          <div class="popup-title">🔥 ${fp.label}</div>
          <div class="popup-meta-row">
            <span>Thermal Anomaly</span>
            <span>Source: MOSDAC INSAT-3DR</span>
          </div>
          <p>Fire Radiative Power: <strong>${fp.frp}</strong>. Surface temperature anomaly elevated above baseline.</p>
        `).bindTooltip(`Fire Hotspot: ${fp.label}`, { direction: 'top' });

        state.mapLayers.fire.addLayer(fireCircle);
      });
    }

    // 3. Threats & Alert Markers
    reg.threats.forEach(t => {
      const markerColor = t.severity.toLowerCase() === 'high' ? '#BD5340' : (t.severity.toLowerCase() === 'medium' ? '#C98232' : '#44805C');
      const threatMarker = L.circleMarker([t.lat, t.lng], {
        radius: 7,
        color: '#FFFFFF',
        fillColor: markerColor,
        fillOpacity: 0.9,
        weight: 2
      }).bindPopup(`
        <div class="popup-title">🚨 ${t.title}</div>
        <div class="popup-meta-row">
          <span>${t.type}</span>
          <span>${t.severity} Severity</span>
        </div>
        <p style="margin-bottom: 0.4rem;"><strong>Location:</strong> ${t.location} (${t.lat.toFixed(3)}°, ${t.lng.toFixed(3)}°)</p>
        <p style="font-size: 0.78rem; background: var(--bg-canvas); padding: 0.4rem; border-radius: 3px; border: 1px dashed var(--border-light);">
          <strong>SOP:</strong> ${t.action}
        </p>
        <div style="margin-top: 0.5rem; text-align: right;">
          <button class="btn btn-primary btn-sm" onclick="window.acknowledgeThreat('${t.id}')">Acknowledge</button>
        </div>
      `).bindTooltip(`${t.severity} Alert: ${t.title}`);

      state.mapLayers.threats.addLayer(threatMarker);
    });

    // 4. Wildlife Corridors & Choke Points
    if (geo && geo.corridorLines) {
      geo.corridorLines.forEach(lineCoords => {
        const corridorPolyline = L.polyline(lineCoords, styles.corridor)
          .bindTooltip(`Wildlife Corridor Transit Route · ${reg.wildlife.corridors.status}`, { sticky: true });
        state.mapLayers.corridors.addLayer(corridorPolyline);
      });
    }

    if (geo && geo.chokePoints) {
      geo.chokePoints.forEach(cp => {
        const chokeMarker = L.circleMarker([cp.lat, cp.lng], styles.chokePoint)
          .bindPopup(`
            <div class="popup-title">🦌 Wildlife Corridor Choke Point</div>
            <p><strong>Pinch Point:</strong> ${cp.name}</p>
            <p>Monitored corridor transit route for ${reg.keySpecies.split(',')[0]}.</p>
          `).bindTooltip(`Corridor Choke: ${cp.name}`);
        state.mapLayers.corridors.addLayer(chokeMarker);
      });
    }

    // 5. Disaster Risk Zones
    if (geo && geo.riskZonePolygon) {
      const riskPoly = L.polygon(geo.riskZonePolygon, styles.riskZone)
        .bindTooltip(`<strong>Hazard Impact Zone</strong><br>Primary Risk: ${reg.overallRiskLevel} (${reg.overallRiskScore}/100)`, {
          sticky: true
        });
      state.mapLayers.riskZones.addLayer(riskPoly);
    }

    // 6. Upcoming Satellite Swath Footprint
    if (geo && geo.satelliteSwath) {
      const firstPass = reg.satellitePasses[0];
      const satSwathPoly = L.polygon(geo.satelliteSwath, styles.satelliteFootprint)
        .bindPopup(`
          <div class="popup-title">🛰️ Upcoming LEO Swath Footprint</div>
          <div class="popup-meta-row">
            <span>Satellite: ${firstPass.satellite}</span>
            <span>Contact: ${firstPass.passStart}</span>
          </div>
          <p>Sensor Swath: ${firstPass.type} · Duration: ${firstPass.durationFormatted} · Max Elevation: ${firstPass.maxElevation}</p>
        `).bindTooltip(`LEO Swath: ${firstPass.satellite} (${firstPass.passStart})`, { sticky: true });
      state.mapLayers.satPass.addLayer(satSwathPoly);
    }

    // 7. Disruption Mode Swath (If Disruption Simulation is active)
    if (state.isDisruptionMode && geo && geo.satelliteSwath) {
      const stormCloud = L.polygon(geo.satelliteSwath, styles.disruptionCloud)
        .bindPopup(`
          <div class="popup-title" style="color: var(--clay-600);">⚠️ Simulated Space-Service Disruption</div>
          <p>Severe ionospheric storm &amp; heavy rain attenuation. Primary LEO X-Band connection masked. DTN RFC 5050 Store-and-Forward routing active.</p>
        `).bindTooltip('Storm Attenuation: Direct Downlink Masked', { sticky: true });
      state.mapLayers.disruption.addLayer(stormCloud);
    }
  }

  // Mini preview map markers
  function renderMiniMapMarkers() {
    if (!state.heroMiniMapInstance) return;
    const reg = getRegion();
    state.heroMiniMapInstance.setView(reg.mapCenter, reg.mapZoom - 1);

    L.circleMarker(reg.mapCenter, {
      radius: 6,
      color: '#FFFFFF',
      fillColor: '#BD5340',
      fillOpacity: 1,
      weight: 2
    }).addTo(state.heroMiniMapInstance);

    if (dom.heroPreviewTitle) dom.heroPreviewTitle.textContent = `${reg.name} Preview`;
    if (dom.heroPreviewCoords) dom.heroPreviewCoords.textContent = reg.coords;
  }

  // Interactive Map Click Handler: Inspector on any arbitrary point
  function handleMapClick(e) {
    if (state.measureModeActive) {
      handleMeasureClick(e.latlng);
      return;
    }

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const reg = getRegion();

    // Compute approximate distance to active region center
    const distKm = (state.mapInstance.distance(e.latlng, L.latLng(reg.mapCenter[0], reg.mapCenter[1])) / 1000).toFixed(1);
    const pass = reg.satellitePasses[0];

    // Find closest threat alert
    let closestThreat = null;
    let minThreatDist = 99999;
    reg.threats.forEach(t => {
      const d = state.mapInstance.distance(e.latlng, L.latLng(t.lat, t.lng)) / 1000;
      if (d < minThreatDist) {
        minThreatDist = d;
        closestThreat = t;
      }
    });

    const popupHtml = `
      <div class="popup-title">📍 Ground Telemetry Readout</div>
      <div class="popup-meta-row">
        <span>${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E</span>
        <span>Datum: WGS84 / ISRO DEM</span>
      </div>
      <div class="popup-telemetry-grid">
        <div class="popup-telemetry-cell">
          <span style="color: var(--text-subtle);">Ecological Zone</span>
          <strong>${reg.ecoType.split('&')[0]}</strong>
        </div>
        <div class="popup-telemetry-cell">
          <span style="color: var(--text-subtle);">Regional Vulnerability</span>
          <strong style="color: ${reg.overallRiskScore >= 70 ? 'var(--clay-500)' : 'var(--forest-800)'}">
            ${reg.overallRiskScore}/100 (${reg.overallRiskLevel})
          </strong>
        </div>
        <div class="popup-telemetry-cell">
          <span style="color: var(--text-subtle);">Nearest Alert</span>
          <strong>${closestThreat ? `${closestThreat.type} (${minThreatDist.toFixed(1)} km)` : 'None in range'}</strong>
        </div>
        <div class="popup-telemetry-cell">
          <span style="color: var(--text-subtle);">Next Satellite Pass</span>
          <strong>${pass.satellite} (${pass.passStart})</strong>
        </div>
      </div>
      <div style="margin-top: 0.65rem; border-top: 1px dashed var(--border-light); padding-top: 0.5rem; text-align: right;">
        <button class="btn btn-primary btn-sm" onclick="window.populateReportCoords('${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E')">
          Draft Report Here ↓
        </button>
      </div>
    `;

    L.popup()
      .setLatLng(e.latlng)
      .setContent(popupHtml)
      .openOn(state.mapInstance);
  }

  // Populate coordinates in the report scheduler form
  window.populateReportCoords = function (coordsStr) {
    if (dom.reportFormCoords) {
      dom.reportFormCoords.value = coordsStr;
      window.location.hash = '#dashboard';
      dom.reportFormCoords.focus();
    }
  };

  // Measure Distance Tool Logic
  function toggleMeasureTool() {
    state.measureModeActive = !state.measureModeActive;
    if (state.measureModeActive) {
      dom.measureDistanceBtn.classList.add('active');
      dom.measureDistanceBtn.textContent = '⏹ Stop Measuring';
      state.measurePoints = [];
      state.measureLayer.clearLayers();
      alert('Measure Tool Active: Click two or more points on the map to measure linear field distance.');
    } else {
      dom.measureDistanceBtn.classList.remove('active');
      dom.measureDistanceBtn.textContent = '📏 Measure';
      state.measurePoints = [];
      state.measureLayer.clearLayers();
    }
  }

  function handleMeasureClick(latlng) {
    state.measurePoints.push(latlng);

    // Draw marker at point
    L.circleMarker(latlng, { radius: 5, color: '#1B3327', fillColor: '#FFFFFF', fillOpacity: 1, weight: 2 })
      .addTo(state.measureLayer);

    if (state.measurePoints.length > 1) {
      const line = L.polyline(state.measurePoints, { color: '#BD5340', weight: 3, dashArray: '4, 4' })
        .addTo(state.measureLayer);

      // Compute total distance
      let totalDist = 0;
      for (let i = 0; i < state.measurePoints.length - 1; i++) {
        totalDist += state.mapInstance.distance(state.measurePoints[i], state.measurePoints[i + 1]);
      }
      const km = (totalDist / 1000).toFixed(2);

      L.popup()
        .setLatLng(latlng)
        .setContent(`<strong>Measured Distance:</strong> ${km} km (${(totalDist * 0.539957 / 1000).toFixed(2)} nautical miles)`)
        .openOn(state.mapInstance);
    }
  }

  // Draw Area of Interest (AOI) Risk Calculator
  function toggleAoiTool() {
    state.drawAoiActive = !state.drawAoiActive;
    if (state.drawAoiActive) {
      dom.drawAoiBtn.classList.add('active');
      dom.drawAoiBtn.textContent = '⏹ Close AOI Box';
      
      const bounds = state.mapInstance.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const latSpan = (ne.lat - sw.lat) * 0.3;
      const lngSpan = (ne.lng - sw.lng) * 0.3;
      const center = state.mapInstance.getCenter();

      const aoiBounds = [
        [center.lat - latSpan, center.lng - lngSpan],
        [center.lat + latSpan, center.lng + lngSpan]
      ];

      state.aoiLayer.clearLayers();
      const rect = L.rectangle(aoiBounds, {
        color: '#E76F51',
        weight: 2,
        fillColor: '#F4A261',
        fillOpacity: 0.25,
        dashArray: '5, 5'
      }).addTo(state.aoiLayer);

      const reg = getRegion();
      rect.bindPopup(`
        <div class="popup-title">📐 Area of Interest (AOI) Analysis</div>
        <p style="font-size: 0.8rem; margin-bottom: 0.4rem;">Computed spatial assessment inside drawn bounding polygon:</p>
        <div class="popup-telemetry-grid">
          <div class="popup-telemetry-cell">
            <span style="color: var(--text-subtle);">Est. Sample Area</span>
            <strong>~184 sq km</strong>
          </div>
          <div class="popup-telemetry-cell">
            <span style="color: var(--text-subtle);">Mean NDVI</span>
            <strong>${reg.vegetation.ndviCurrent} (VEDAS AWiFS)</strong>
          </div>
          <div class="popup-telemetry-cell">
            <span style="color: var(--text-subtle);">Active Threats</span>
            <strong>${reg.threats.length} Localized</strong>
          </div>
          <div class="popup-telemetry-cell">
            <span style="color: var(--text-subtle);">Composite Risk</span>
            <strong>${reg.overallRiskScore}/100</strong>
          </div>
        </div>
      `).openPopup();
    } else {
      dom.drawAoiBtn.classList.remove('active');
      dom.drawAoiBtn.textContent = '📐 Draw AOI';
      state.aoiLayer.clearLayers();
    }
  }

  // Fly Map to Selected Region
  function flyToRegion(regionId) {
    const reg = HABITAT_DATA.regions[regionId];
    if (!reg || !state.mapInstance) return;

    state.mapInstance.flyTo(reg.mapCenter, reg.mapZoom, {
      duration: 1.4,
      easeLinearity: 0.25
    });

    renderMapOverlays();
    renderMiniMapMarkers();
    renderSidePanel();
  }

  // Render Map Side Panel
  function renderSidePanel() {
    const reg = getRegion();
    dom.sidePanelRegionName.textContent = reg.name;
    dom.sidePanelEcoType.textContent = reg.ecoType;
    dom.sidePanelRiskScore.textContent = `${reg.overallRiskScore}/100`;
    dom.sidePanelRiskScore.className = `risk-dial-score ${getRiskTheme(reg.overallRiskScore).colorClass}`;
    dom.sidePanelAlertCount.textContent = `${reg.threats.length} Alerts`;

    // Render Mini Alert Jump List
    dom.sidePanelAlertsList.innerHTML = reg.threats.map(t => {
      const sevClass = t.severity.toLowerCase();
      return `
        <div style="background: var(--bg-canvas); border: 1px solid var(--border-light); border-left: 3px solid ${sevClass === 'high' ? 'var(--clay-500)' : (sevClass === 'medium' ? 'var(--ochre-500)' : 'var(--sage-500)')}; border-radius: 3px; padding: 0.45rem 0.6rem; display: flex; justify-content: space-between; align-items: center; gap: 0.4rem;">
          <div style="overflow: hidden;">
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--forest-950); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${t.title}
            </div>
            <div style="font-size: 0.68rem; color: var(--text-subtle);">${t.type} · ${t.detectedTime}</div>
          </div>
          <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.45rem; font-size: 0.7rem; flex-shrink: 0;" onclick="window.zoomToThreat(${t.lat}, ${t.lng})">
            Zoom ↗
          </button>
        </div>
      `;
    }).join('');

    // Pass Tracker
    const firstPass = reg.satellitePasses[0];
    dom.sidePanelPassSat.textContent = firstPass ? firstPass.satellite : 'EOS-04';
    dom.sidePanelPassDetails.textContent = firstPass 
      ? `Pass Start: ${firstPass.startTimeIST} (${firstPass.passStart}) · Duration: ${firstPass.durationFormatted} · El: ${firstPass.maxElevation}`
      : 'Pass in 14 mins';
  }

  // Zoom map to specific threat marker
  window.zoomToThreat = function (lat, lng) {
    if (!state.mapInstance) return;
    state.mapInstance.flyTo([lat, lng], 13, { duration: 1.0 });
  };

  // ==========================================================================
  // DASHBOARD RENDERING & TELEMETRY CONTROLLERS
  // ==========================================================================
  function renderMastheadStats() {
    const reg = getRegion();
    const riskTheme = getRiskTheme(reg.overallRiskScore);

    if (dom.currentRegionName) dom.currentRegionName.textContent = reg.name;
    if (dom.currentRegionMeta) dom.currentRegionMeta.textContent = `Integrated Telemetry Feed · ${reg.state} · ${reg.coords} · ISRO Sensor Suite`;

    dom.statRiskIndex.textContent = `${reg.overallRiskScore}/100`;
    dom.statRiskIndex.className = `value ${riskTheme.colorClass}`;
    dom.statRiskSub.textContent = `${reg.overallRiskLevel} · ${reg.ecoType}`;

    dom.statNdvi.textContent = `${reg.vegetation.ndviCurrent.toFixed(2)}`;
    dom.statNdviSub.textContent = `${reg.vegetation.healthStatus}`;

    const firstPass = reg.satellitePasses[0];
    if (state.isDisruptionMode) {
      dom.statNextPass.textContent = "Delay-Tolerant Queue";
      dom.statNextPassSub.textContent = "UHF / Store & Forward (RFC 5050)";
      dom.statLinkStatus.textContent = "Degraded (48 kbps)";
      dom.statLinkStatus.style.color = "var(--clay-500)";
      dom.statLinkSub.textContent = "Severe cloud/storm attenuation";
    } else {
      dom.statNextPass.textContent = firstPass ? firstPass.passStart : "In 14 mins";
      dom.statNextPassSub.textContent = firstPass ? firstPass.satellite : "EOS-04";
      dom.statLinkStatus.textContent = "Nominal (18.4 Mbps)";
      dom.statLinkStatus.style.color = "#48BB78";
      dom.statLinkSub.textContent = "Direct ISRO LEO contact";
    }

    if (dom.reportFormCoords) {
      dom.reportFormCoords.value = reg.coords;
    }
  }

  // Module 1: Forest Health
  function renderHealthModule() {
    const reg = getRegion();
    dom.healthCanopyCover.textContent = reg.vegetation.canopyCover;
    dom.healthCanopyChange.textContent = reg.vegetation.canopyChange12m;
    dom.healthStatusTag.textContent = reg.vegetation.healthStatus;
    dom.healthSummary.textContent = reg.vegetation.summary;

    const ctx = document.getElementById('healthChartCanvas');
    if (!ctx) return;

    if (state.charts.health) {
      state.charts.health.destroy();
    }

    state.charts.health = new Chart(ctx, {
      type: 'line',
      data: {
        labels: reg.vegetation.historyMonths,
        datasets: [
          {
            label: 'Observed NDVI (VEDAS AWiFS)',
            data: reg.vegetation.ndviValues,
            borderColor: '#366B4B',
            backgroundColor: 'rgba(54, 107, 75, 0.08)',
            borderWidth: 2.2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#366B4B',
            pointRadius: 3,
            pointHoverRadius: 5
          },
          {
            label: 'Ecological 5-Yr Baseline',
            data: reg.vegetation.ndviValues.map(v => Number((v * 0.96).toFixed(2))),
            borderColor: '#9E9484',
            borderWidth: 1.5,
            borderDash: [4, 4],
            tension: 0.2,
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#1C2420',
            titleFont: { family: 'Plus Jakarta Sans', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            padding: 8
          }
        },
        scales: {
          y: {
            min: 0.3,
            max: 1.0,
            ticks: {
              stepSize: 0.1,
              font: { family: 'JetBrains Mono', size: 10 },
              color: '#7E8E84'
            },
            grid: { color: 'rgba(216, 210, 196, 0.4)' }
          },
          x: {
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 10 },
              color: '#7E8E84'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Module 2: Disaster Risk Assessment
  function renderRiskAssessmentModule() {
    const reg = getRegion();
    const rb = reg.riskBreakdown;

    dom.riskScoreFire.textContent = `${rb.fire.score}/100`;
    dom.riskBarFire.style.width = `${rb.fire.score}%`;
    dom.riskScoreFire.className = `risk-dial-score ${getRiskTheme(rb.fire.score).colorClass}`;
    dom.riskBarFire.className = `risk-progress-bar ${getRiskTheme(rb.fire.score).barClass}`;

    dom.riskScoreFlood.textContent = `${rb.flood.score}/100`;
    dom.riskBarFlood.style.width = `${rb.flood.score}%`;
    dom.riskScoreFlood.className = `risk-dial-score ${getRiskTheme(rb.flood.score).colorClass}`;
    dom.riskBarFlood.className = `risk-progress-bar ${getRiskTheme(rb.flood.score).barClass}`;

    dom.riskScoreDrought.textContent = `${rb.drought.score}/100`;
    dom.riskBarDrought.style.width = `${rb.drought.score}%`;
    dom.riskScoreDrought.className = `risk-dial-score ${getRiskTheme(rb.drought.score).colorClass}`;
    dom.riskBarDrought.className = `risk-progress-bar ${getRiskTheme(rb.drought.score).barClass}`;

    dom.riskScoreLandslide.textContent = `${rb.landslide.score}/100`;
    dom.riskBarLandslide.style.width = `${rb.landslide.score}%`;
    dom.riskScoreLandslide.className = `risk-dial-score ${getRiskTheme(rb.landslide.score).colorClass}`;
    dom.riskBarLandslide.className = `risk-progress-bar ${getRiskTheme(rb.landslide.score).barClass}`;

    dom.whyScoreText.textContent = reg.whyScore;
  }

  // Module 3: 7-Day Risk Forecast
  function renderForecastModule() {
    const reg = getRegion();
    dom.forecastConfidence.textContent = `Confidence: ${reg.forecast7Day.confidence}`;
    dom.forecastSummary.textContent = reg.forecast7Day.summary;

    const ctx = document.getElementById('forecastChartCanvas');
    if (!ctx) return;

    if (state.charts.forecast) {
      state.charts.forecast.destroy();
    }

    state.charts.forecast = new Chart(ctx, {
      type: 'line',
      data: {
        labels: reg.forecast7Day.days,
        datasets: [
          {
            label: 'Predicted Vulnerability Index (0-100)',
            data: reg.forecast7Day.scores,
            borderColor: '#BD5340',
            backgroundColor: 'rgba(189, 83, 64, 0.08)',
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#BD5340',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1C2420',
            titleFont: { family: 'Plus Jakarta Sans', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            padding: 8
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              font: { family: 'JetBrains Mono', size: 10 },
              color: '#7E8E84'
            },
            grid: { color: 'rgba(216, 210, 196, 0.4)' }
          },
          x: {
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 10 },
              color: '#7E8E84'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Module 4 & 9: Threats & Alerts
  function renderThreatsModule() {
    const reg = getRegion();
    let threats = reg.threats;

    if (state.threatFilterType !== 'all') {
      threats = threats.filter(t => t.type.toLowerCase().includes(state.threatFilterType.toLowerCase()));
    }

    if (state.threatFilterSeverity !== 'all') {
      threats = threats.filter(t => t.severity.toLowerCase() === state.threatFilterSeverity.toLowerCase());
    }

    dom.threatCountBadge.textContent = `${threats.length} Active Alerts`;

    if (threats.length === 0) {
      dom.threatsList.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-subtle); font-style: italic;">
          No threat alerts match the selected criteria for this forest range.
        </div>
      `;
      return;
    }

    dom.threatsList.innerHTML = threats.map(t => {
      const sevClass = t.severity.toLowerCase();
      return `
        <div class="threat-item-card sev-${sevClass}">
          <div class="threat-item-head">
            <span class="threat-type-tag">${t.type}</span>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span class="sev-badge ${sevClass}">${t.severity} Severity</span>
              <span class="source-badge isro">${t.source}</span>
            </div>
          </div>
          <div class="threat-item-title">${t.title}</div>
          <div class="threat-item-meta">
            <span>📍 ${t.location} (${t.lat.toFixed(3)}°, ${t.lng.toFixed(3)}°)</span>
            <span>⏱ Detected: ${t.detectedTime}</span>
          </div>
          <div class="threat-action-note">
            <strong>Standard Operational Protocol:</strong> ${t.action}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem;">
            <button class="btn btn-outline-forest btn-sm" onclick="window.zoomToThreat(${t.lat}, ${t.lng})">
              Locate on Live Map ↗
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.acknowledgeThreat('${t.id}')">
              Acknowledge & Dispatch Beat Guard
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.acknowledgeThreat = function (id) {
    alert(`Alert [${id}] logged in division incident book. Field dispatch signal queued for next satellite transmission window.`);
  };

  // Module 5: Wildlife Habitat Analysis
  function renderWildlifeModule() {
    const reg = getRegion();
    const wl = reg.wildlife;

    dom.wildlifeGrid.innerHTML = wl.focalSpecies.map(sp => `
      <div class="species-card">
        <div class="species-name">${sp.name}</div>
        <div class="species-status-row">
          <span>Status: <strong>${sp.status}</strong></span>
          <span>Pop: <strong>${sp.population}</strong></span>
        </div>
        <div class="species-notes">${sp.notes}</div>
      </div>
    `).join('');

    dom.corridorStatus.textContent = wl.corridors.status;
    dom.corridorVulnerable.textContent = wl.corridors.vulnerableZones;
    dom.corridorIndex.textContent = `Corridor Connectivity: ${wl.corridors.connectivityIndex}`;
  }

  // Module 6: Satellite Contact Planner Timeline
  function renderSatellitePlannerModule() {
    const reg = getRegion();
    const passes = reg.satellitePasses;

    dom.passTimeline.innerHTML = passes.map((p, idx) => {
      let isDisrupted = state.isDisruptionMode && idx === 0;
      let statusLabel = isDisrupted ? "Direct Window Masked (Rerouting)" : p.status;
      let bandwidthLabel = isDisrupted ? `${p.backupLinkBandwidth} (Narrowband Backup)` : p.directLinkBandwidth;
      let signalLabel = isDisrupted ? "Severe Rain Fade (< 15%)" : p.signalQuality;

      return `
        <div class="pass-row-card ${isDisrupted ? 'disrupted' : (idx === 0 ? 'approaching' : '')}">
          <div class="pass-sat-col">
            <strong>${p.satellite}</strong>
            <span>${p.type} · Max El: ${p.maxElevation}</span>
          </div>
          <div class="pass-timing-col">
            <span class="clock">${p.startTimeIST}</span>
            <span class="countdown">${isDisrupted ? 'Rescheduled to +3h 14m' : p.passStart} · (${p.durationFormatted})</span>
          </div>
          <div class="pass-signal-col">
            <span class="sig-text" style="color: ${isDisrupted ? 'var(--clay-500)' : 'var(--forest-800)'}">${signalLabel}</span>
            <span style="font-size: 0.72rem; color: var(--text-subtle);">${isDisrupted ? 'DTN Custody Transfer' : 'Direct Downlink'}</span>
          </div>
          <div class="pass-bandwidth-col">
            <span class="bw-val">${bandwidthLabel}</span>
            <span style="font-size: 0.72rem; color: var(--text-subtle);">Payload Capacity</span>
          </div>
          <div>
            <span class="source-badge isro">${statusLabel}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Module 7: Field Report Queue
  function renderReportQueueModule() {
    const reg = getRegion();
    const currentRegionReports = state.reports.filter(r => r.regionId === state.currentRegionId);

    if (currentRegionReports.length === 0) {
      dom.reportQueueList.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-subtle); font-style: italic;">
          No field reports currently in queue for ${reg.name}. Create one on the left.
        </div>
      `;
      return;
    }

    dom.reportQueueList.innerHTML = currentRegionReports.map(rpt => {
      let statusClass = 'queued';
      if (rpt.status.toLowerCase().includes('waiting')) statusClass = 'waiting';
      if (rpt.status.toLowerCase().includes('transmitting')) statusClass = 'transmitting';
      if (rpt.status.toLowerCase().includes('sent')) statusClass = 'sent';

      let assignedPassDisplay = rpt.assignedPass;
      if (state.isDisruptionMode && statusClass !== 'sent') {
        assignedPassDisplay = `REROUTED: Backup UHF Relay (GSAT-7A Narrowband)`;
      }

      return `
        <div class="queue-item-card">
          <div class="queue-item-top">
            <span class="queue-status-tag ${statusClass}">${rpt.status}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-subtle);">${rpt.id}</span>
          </div>
          <div class="queue-item-title">${rpt.title}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${rpt.summary}</div>
          <div class="queue-item-meta">
            <span>Author: ${rpt.author} · Priority: <strong>${rpt.priority}</strong></span>
            <span>Window: <strong>${assignedPassDisplay}</strong></span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed var(--border-light);">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-subtle);">${rpt.payloadSize}</span>
            ${statusClass !== 'sent' ? `
              <button class="btn btn-outline-forest btn-sm" onclick="window.transmitReport('${rpt.id}')">
                Transmit Now (Simulate Pass)
              </button>
            ` : `
              <span style="font-size: 0.75rem; color: var(--sage-600); font-weight: 600;">✓ Delivered to HQ Ground Station</span>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  window.transmitReport = function (reportId) {
    const rpt = state.reports.find(r => r.id === reportId);
    if (!rpt) return;

    rpt.status = 'Transmitting...';
    renderReportQueueModule();

    setTimeout(() => {
      rpt.status = 'Sent & Acknowledged';
      rpt.assignedPass = 'Transmitted via EOS-04 Pass';
      renderReportQueueModule();
      renderMastheadStats();
    }, 1200);
  };

  // Space-Service Disruption Simulation Toggle
  function setDisruptionMode(active) {
    state.isDisruptionMode = active;

    if (active) {
      dom.disruptionToggle.classList.add('active');
      dom.disruptionBanner.classList.add('visible');
      dom.disruptionWhatChanged.textContent = 
        "Space-service disruption engaged: Primary LEO X-band downlink masked by severe atmospheric storm fade. The planner has automatically migrated queued reports to Delay-Tolerant Networking (RFC 5050 Bundle Protocol) utilizing a secondary S-band store-and-forward window. On the live map, storm attenuation cloud is now visualized.";
    } else {
      dom.disruptionToggle.classList.remove('active');
      dom.disruptionBanner.classList.remove('visible');
    }

    renderMastheadStats();
    renderSatellitePlannerModule();
    renderReportQueueModule();
    renderMapOverlays();
  }

  // Switch Active Region Across All Modules & Map
  function switchRegion(regionId) {
    if (!HABITAT_DATA.regions[regionId]) return;
    state.currentRegionId = regionId;

    if (dom.regionSelect) dom.regionSelect.value = regionId;
    if (dom.mapQuickRegionJump) dom.mapQuickRegionJump.value = regionId;

    flyToRegion(regionId);
    renderAll();
  }

  window.switchRegion = switchRegion;

  // Render All Platform Components
  function renderAll() {
    renderMastheadStats();
    renderHealthModule();
    renderRiskAssessmentModule();
    renderForecastModule();
    renderThreatsModule();
    renderWildlifeModule();
    renderSatellitePlannerModule();
    renderReportQueueModule();
    renderSidePanel();
  }

  // Field Briefing Export Generator
  function openExportModal() {
    const reg = getRegion();
    const threats = reg.threats;
    const passes = reg.satellitePasses;

    const modalHtml = `
      <div class="modal-sheet-header">
        <div>
          <span class="source-badge isro">Official Operational Briefing</span>
          <h2 style="font-size: 1.85rem; margin-top: 0.35rem; color: var(--forest-950);">${reg.name}</h2>
          <div class="print-report-meta">
            <span>Coordinates: ${reg.coords} · Ecosystem: ${reg.ecoType}</span><br>
            <span>Telemetry Stamp: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} · ASTRA 2026 Field Command</span>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 700; color: ${reg.overallRiskScore >= 70 ? 'var(--clay-500)' : 'var(--forest-800)'}">
            ${reg.overallRiskScore}/100
          </span>
          <div style="font-size: 0.75rem; text-transform: uppercase; font-family: var(--font-mono); color: var(--text-subtle);">
            Composite Risk Score
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin: 1rem 0;">
        <div style="background: var(--bg-canvas); padding: 1rem; border: 1px solid var(--border-light); border-radius: 4px;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem; color: var(--forest-900);">Ecosystem & Vegetation Health</h4>
          <p style="font-size: 0.85rem; margin-bottom: 0.4rem;"><strong>NDVI:</strong> ${reg.vegetation.ndviCurrent} (${reg.vegetation.healthStatus})</p>
          <p style="font-size: 0.85rem; margin-bottom: 0.4rem;"><strong>Canopy Cover:</strong> ${reg.vegetation.canopyCover} (${reg.vegetation.canopyChange12m})</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${reg.vegetation.summary}</p>
        </div>

        <div style="background: var(--bg-canvas); padding: 1rem; border: 1px solid var(--border-light); border-radius: 4px;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem; color: var(--forest-900);">Telemetry Risk Rationale</h4>
          <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5;">${reg.whyScore}</p>
          <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
            Fire: ${reg.riskBreakdown.fire.score} · Flood: ${reg.riskBreakdown.flood.score} · Drought: ${reg.riskBreakdown.drought.score} · Landslide: ${reg.riskBreakdown.landslide.score}
          </div>
        </div>
      </div>

      <div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.65rem; color: var(--forest-950);">Active Tactical Environmental Threats</h4>
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          ${threats.map(t => `
            <div style="border: 1px solid var(--border-light); padding: 0.75rem; border-radius: 4px; background: #FFF;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.2rem;">
                <strong>${t.title}</strong>
                <span class="sev-badge ${t.severity.toLowerCase()}">${t.severity}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.2rem;">Location: ${t.location} · ${t.source}</div>
              <div style="font-size: 0.8rem; background: var(--forest-50); padding: 0.3rem 0.5rem; border-radius: 2px;">
                <strong>SOP Directive:</strong> ${t.action}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.65rem; color: var(--forest-950);">Next Upcoming Satellite Contact Windows (ISRO Telemetry)</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
          ${passes.slice(0, 2).map(p => `
            <div style="border: 1px solid var(--border-light); padding: 0.75rem; border-radius: 4px; background: var(--bg-canvas);">
              <strong>${p.satellite}</strong><br>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Pass Time: ${p.startTimeIST} (${p.durationFormatted})</span><br>
              <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--forest-700);">Bandwidth: ${p.directLinkBandwidth} · Elevation: ${p.maxElevation}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light); font-size: 0.75rem; color: var(--text-subtle); display: flex; justify-content: space-between;">
        <span>HABITAT IQ Operational Dispatch Engine · ISRO Open Data Framework</span>
        <span>ASTRA 2026 · ANTERiX Club · VIT Bhopal</span>
      </div>
    `;

    dom.exportContent.innerHTML = modalHtml;
    dom.exportModal.classList.add('active');
  }

  function closeExportModal() {
    dom.exportModal.classList.remove('active');
  }

  // Expose state and basemap switcher to window for HabiBrain & HTML callbacks
  window.appState = state;
  window.switchBasemap = switchBasemap;

  // ==========================================================================
  // AI CHATBOX ("Ask Habi") COORDINATOR & UI RENDERER
  // ==========================================================================
  function renderChatHistory() {
    dom.chatMessages.innerHTML = state.chatHistory.map(msg => {
      if (msg.role === 'bot') {
        return `
          <div class="chat-row bot">
            <div class="chat-bot-icon" aria-hidden="true">🌿</div>
            <div class="chat-bubble bot">
              ${markedSimple(msg.text)}
            </div>
          </div>
        `;
      } else {
        return `
          <div class="chat-row user">
            <div class="chat-bubble user">
              ${markedSimple(msg.text)}
            </div>
          </div>
        `;
      }
    }).join('');
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  }

  function renderSuggestionChips(chips) {
    if (!dom.chatChipTray || !chips || chips.length === 0) return;
    dom.chatChipTray.innerHTML = chips.map(c => `
      <button class="chat-chip" type="button">${c}</button>
    `).join('');

    dom.chatChipTray.querySelectorAll('.chat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        sendChatMessage(btn.textContent.trim());
      });
    });
  }

  function markedSimple(str) {
    if (!str) return '';
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  async function sendChatMessage(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    state.chatHistory.push({ role: 'user', text: cleanText });
    renderChatHistory();
    if (dom.chatInput) dom.chatInput.value = '';

    if (dom.typingIndicator) dom.typingIndicator.classList.add('active');
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;

    // Natural human typing delay (500 - 850 ms)
    const delay = Math.floor(Math.random() * 350) + 500;
    await new Promise(r => setTimeout(r, delay));

    let replyObj = null;
    if (window.HabiBrain && typeof window.HabiBrain.processMessage === 'function') {
      replyObj = await window.HabiBrain.processMessage(cleanText);
    } else {
      replyObj = {
        text: "I'm right here with live ISRO telemetry! What reserve would you like to inspect?",
        chips: ["Highest risk region today", "Next satellite pass", "Zoom to Kaziranga"]
      };
    }

    if (dom.typingIndicator) dom.typingIndicator.classList.remove('active');

    if (replyObj && replyObj.text) {
      state.chatHistory.push({ role: 'bot', text: replyObj.text });
      renderChatHistory();
      if (replyObj.chips && replyObj.chips.length > 0) {
        renderSuggestionChips(replyObj.chips);
      }
    }
  }

  // ==========================================================================
  // EVENT LISTENERS & USER CONTROLS
  // ==========================================================================
  function initEvents() {
    // Header Region Dropdown
    if (dom.regionSelect) {
      dom.regionSelect.addEventListener('change', (e) => switchRegion(e.target.value));
    }

    // Map Quick Jump Dropdown
    if (dom.mapQuickRegionJump) {
      dom.mapQuickRegionJump.addEventListener('change', (e) => switchRegion(e.target.value));
    }

    // Reset Map View
    if (dom.resetMapViewBtn) {
      dom.resetMapViewBtn.addEventListener('click', () => {
        const reg = getRegion();
        state.mapInstance.flyTo(reg.mapCenter, reg.mapZoom, { duration: 1.0 });
      });
    }

    // Fullscreen Map
    if (dom.mapFullscreenBtn) {
      dom.mapFullscreenBtn.addEventListener('click', () => {
        const elem = dom.mapViewportWrapper;
        if (!document.fullscreenElement) {
          if (elem.requestFullscreen) elem.requestFullscreen();
          else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
      });
    }

    // Toggle Side Panel
    if (dom.toggleSidePanelBtn) {
      dom.toggleSidePanelBtn.addEventListener('click', () => {
        state.sidePanelCollapsed = !state.sidePanelCollapsed;
        if (state.sidePanelCollapsed) {
          dom.mapViewportWrapper.classList.add('panel-collapsed');
        } else {
          dom.mapViewportWrapper.classList.remove('panel-collapsed');
        }
        setTimeout(() => state.mapInstance.invalidateSize(), 200);
      });
    }

    // Basemap Switcher Buttons
    if (dom.btnBasemapSatellite) dom.btnBasemapSatellite.addEventListener('click', () => switchBasemap('satellite'));
    if (dom.btnBasemapTerrain) dom.btnBasemapTerrain.addEventListener('click', () => switchBasemap('terrain'));
    if (dom.btnBasemapPlain) dom.btnBasemapPlain.addEventListener('click', () => switchBasemap('plain'));

    // Toggle Layers Dropdown Drawer
    if (dom.toggleLayersDrawerBtn) {
      dom.toggleLayersDrawerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dom.layersDropdownPanel.classList.toggle('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (dom.layersDropdownPanel && !dom.layersDropdownPanel.contains(e.target) && e.target !== dom.toggleLayersDrawerBtn) {
        dom.layersDropdownPanel.classList.remove('open');
      }
    });

    // Layer Overlay Checkboxes
    if (dom.chkLayerForest) {
      dom.chkLayerForest.addEventListener('change', (e) => {
        if (e.target.checked) state.mapInstance.addLayer(state.mapLayers.forest);
        else state.mapInstance.removeLayer(state.mapLayers.forest);
      });
    }
    if (dom.chkLayerFire) {
      dom.chkLayerFire.addEventListener('change', (e) => {
        if (e.target.checked) state.mapInstance.addLayer(state.mapLayers.fire);
        else state.mapInstance.removeLayer(state.mapLayers.fire);
      });
    }
    if (dom.chkLayerThreats) {
      dom.chkLayerThreats.addEventListener('change', (e) => {
        if (e.target.checked) state.mapInstance.addLayer(state.mapLayers.threats);
        else state.mapInstance.removeLayer(state.mapLayers.threats);
      });
    }
    if (dom.chkLayerCorridors) {
      dom.chkLayerCorridors.addEventListener('change', (e) => {
        if (e.target.checked) state.mapInstance.addLayer(state.mapLayers.corridors);
        else state.mapInstance.removeLayer(state.mapLayers.corridors);
      });
    }
    if (dom.chkLayerRiskZones) {
      dom.chkLayerRiskZones.addEventListener('change', (e) => {
        if (e.target.checked) state.mapInstance.addLayer(state.mapLayers.riskZones);
        else state.mapInstance.removeLayer(state.mapLayers.riskZones);
      });
    }
    if (dom.chkLayerSatPass) {
      dom.chkLayerSatPass.addEventListener('change', (e) => {
        if (e.target.checked) state.mapInstance.addLayer(state.mapLayers.satPass);
        else state.mapInstance.removeLayer(state.mapLayers.satPass);
      });
    }

    // Measure Distance Tool Toggle
    if (dom.measureDistanceBtn) {
      dom.measureDistanceBtn.addEventListener('click', toggleMeasureTool);
    }

    // Draw AOI Tool Toggle
    if (dom.drawAoiBtn) {
      dom.drawAoiBtn.addEventListener('click', toggleAoiTool);
    }

    // Time Slider ("Before / Now")
    if (dom.timeCompareSlider) {
      dom.timeCompareSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        const reg = getRegion();
        if (val === 0) {
          state.timeCompareState = 'before';
          state.mapLayers.forest.eachLayer(l => l.setStyle({ fillOpacity: 0.20 }));
          alert(`[HISTORICAL BASELINE COMPARISON: ${reg.temporalCompare.beforeYear}]\nCanopy Cover: ${reg.temporalCompare.canopyCoverBefore}\nShift: ${reg.temporalCompare.riskShift}`);
        } else {
          state.timeCompareState = 'now';
          state.mapLayers.forest.eachLayer(l => l.setStyle({ fillOpacity: 0.35 }));
        }
      });
    }

    // Auto-Refresh Checkbox
    if (dom.autoRefreshCheckbox) {
      dom.autoRefreshCheckbox.addEventListener('change', (e) => {
        state.isAutoRefresh = e.target.checked;
        if (state.isAutoRefresh) {
          alert('Auto-refresh active: Platform will ping synthetic ISRO telemetry every 5 minutes.');
        }
      });
    }

    // Disruption Mode Toggle
    if (dom.disruptionToggle) {
      dom.disruptionToggle.addEventListener('click', () => {
        setDisruptionMode(!state.isDisruptionMode);
      });
    }

    // Threat Filters
    const typeChips = document.querySelectorAll('.threat-type-chip');
    typeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        typeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.threatFilterType = chip.dataset.type;
        renderThreatsModule();
      });
    });

    const sevChips = document.querySelectorAll('.threat-sev-chip');
    sevChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sevChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.threatFilterSeverity = chip.dataset.sev;
        renderThreatsModule();
      });
    });

    // Field Report Form Submit
    if (dom.reportForm) {
      dom.reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('reportTitle').value;
        const author = document.getElementById('reportAuthor').value;
        const category = document.getElementById('reportCategory').value;
        const priority = document.getElementById('reportPriority').value;
        const summary = document.getElementById('reportSummary').value;

        const reg = getRegion();
        const nextPass = reg.satellitePasses[0];

        const newReport = {
          id: `RPT-2026-${Math.floor(100 + Math.random() * 900)}`,
          regionId: state.currentRegionId,
          title: title,
          author: author || 'Field Ranger Patrol',
          category: category,
          priority: priority,
          summary: summary,
          timestamp: 'Just now',
          status: 'Waiting for pass',
          assignedPass: `${nextPass.satellite} at ${nextPass.startTimeIST}`,
          payloadSize: '1.2 MB (Geo-Telemetry Package)',
          disruptionRescheduled: state.isDisruptionMode
        };

        state.reports.unshift(newReport);
        dom.reportForm.reset();
        if (dom.reportFormCoords) dom.reportFormCoords.value = reg.coords;

        renderReportQueueModule();
        alert(`Field report queued successfully. Transmission window assigned to ${nextPass.satellite}.`);
      });
    }

    // Export Modal Triggers
    if (dom.exportBtn) dom.exportBtn.addEventListener('click', openExportModal);
    if (dom.closeModalBtn) dom.closeModalBtn.addEventListener('click', closeExportModal);
    if (dom.printModalBtn) dom.printModalBtn.addEventListener('click', () => window.print());

    // AI Chatbox Controls
    if (dom.chatLauncher) {
      dom.chatLauncher.addEventListener('click', () => {
        dom.chatDrawer.classList.toggle('open');
        if (dom.chatDrawer.classList.contains('open')) {
          dom.chatInput.focus();
        }
      });
    }

    if (dom.closeChatBtn) {
      dom.closeChatBtn.addEventListener('click', () => {
        dom.chatDrawer.classList.remove('open');
      });
    }

    if (dom.clearChatBtn) {
      dom.clearChatBtn.addEventListener('click', () => {
        state.chatHistory = [
          {
            role: 'bot',
            text: "Fresh slate! What reserve or satellite telemetry would you like to explore?"
          }
        ];
        if (window.HabiBrain && typeof window.HabiBrain.resetMemory === 'function') {
          window.HabiBrain.resetMemory();
        }
        renderChatHistory();
        const initialChips = (window.CHAT_CONFIG && window.CHAT_CONFIG.defaultChips) 
          ? window.CHAT_CONFIG.defaultChips 
          : ["Highest risk region today", "Next satellite pass", "Show fire hotspots", "Run outage simulation"];
        renderSuggestionChips(initialChips);
      });
    }

    if (dom.chatSendBtn) {
      dom.chatSendBtn.addEventListener('click', () => {
        sendChatMessage(dom.chatInput.value);
      });
    }

    if (dom.chatInput) {
      dom.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendChatMessage(dom.chatInput.value);
        }
      });
    }

    // Voice recognition (Web Speech API)
    if (dom.chatVoiceBtn) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Indian English, Hindi & Hinglish friendly

        let isListening = false;
        dom.chatVoiceBtn.addEventListener('click', () => {
          if (isListening) {
            recognition.stop();
            return;
          }
          try {
            recognition.start();
          } catch (err) {
            console.warn('[Habi] Speech recognition start error:', err);
          }
        });

        recognition.onstart = () => {
          isListening = true;
          dom.chatVoiceBtn.classList.add('recording');
          dom.chatVoiceBtn.title = 'Listening to field audio... Speak now';
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            dom.chatInput.value = transcript;
            sendChatMessage(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.warn('[Habi] Speech recognition error:', event.error);
          isListening = false;
          dom.chatVoiceBtn.classList.remove('recording');
          dom.chatVoiceBtn.title = 'Speak to Habi (Voice Input)';
        };

        recognition.onend = () => {
          isListening = false;
          dom.chatVoiceBtn.classList.remove('recording');
          dom.chatVoiceBtn.title = 'Speak to Habi (Voice Input)';
        };
      } else {
        dom.chatVoiceBtn.addEventListener('click', () => {
          alert('Speech Recognition is not supported by your current browser. You can type directly in the box!');
        });
      }
    }

    dom.chipList.forEach(chip => {
      chip.addEventListener('click', () => {
        sendChatMessage(chip.textContent.trim());
      });
    });

    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      });
    }
  }

  // App Initialization on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initDom();
    initEvents();
    initMaps();
    renderAll();
    
    // Initialize Habi's brain and load initial suggestion chips
    if (window.HabiBrain && typeof window.HabiBrain.init === 'function') {
      window.HabiBrain.init();
    }
    const initialChips = (window.CHAT_CONFIG && window.CHAT_CONFIG.defaultChips) 
      ? window.CHAT_CONFIG.defaultChips 
      : ["Highest risk region today", "Next satellite pass", "Show fire hotspots", "Run outage simulation"];
    renderSuggestionChips(initialChips);
    renderChatHistory();
  });

})();
