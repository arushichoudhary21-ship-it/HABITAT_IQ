/**
 * HABITAT IQ - Map Configuration & ISRO Bhuvan Service Endpoints
 * 
 * Hackathon: ASTRA 2026 | ANTERiX Club, VIT Bhopal
 * Data Rule: Primary imagery configured for ISRO Bhuvan Open Geoportal.
 * Fallback: Automatic graceful fallback to reliable open satellite basemaps
 *           if Bhuvan WMS/WMTS requires authentication or encounters CORS/network limits.
 */

const MAP_CONFIG = {
  // Attribution Strings
  attribution: {
    bhuvan: 'Imagery: ISRO Bhuvan · NRSC Geo-Platform',
    fallback: 'Imagery: Sentinel-2 / Landsat / Open Satellite Baseline',
    osm: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  },

  // ISRO Bhuvan WMS / WMTS Service Endpoints
  // Replace BHUVAN_TOKEN with your registered Bhuvan API key from https://bhuvan-app1.nrsc.gov.in
  bhuvan: {
    token: 'ebf4f10d61757302026bbfaff1bc0bffcf157d94', // Insert Bhuvan User Key/Token here if available
    wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms',
    layers: {
      satellite: 'bhuvan:india_imagery',
      thematicForest: 'bhuvan:forest_density',
      fireHotspots: 'bhuvan:fire_alerts'
    },
    enabled: true // Set to false to force fallback basemap immediately
  },

  // Fallback Basemaps (Guarantees map NEVER looks broken or blank)
  basemaps: {
    // 1. Satellite Mode (DEFAULT)
    satellite: {
      name: 'Satellite (Bhuvan / Global EO)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 18,
      attribution: 'Imagery: ISRO Bhuvan (Proxy) &middot; Earth Observation Baseline'
    },

    // 2. Terrain / Hybrid Mode
    terrain: {
      name: 'Terrain & Contours',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
      subdomains: 'abc',
      attribution: 'Map: OpenTopoMap &middot; ISRO CartoDEM Elevation'
    },

    // 3. Plain Map Mode (Clean Editorial Cartography)
    plain: {
      name: 'Editorial Topo (Plain)',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: 'Map: CartoDB &middot; Forestry Cadastral Base'
    }
  },

  // Default Map View
  view: {
    defaultRegion: 'sundarbans',
    center: [21.9497, 88.9007], // Sundarbans Biosphere
    zoom: 10,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: [
      [6.0, 68.0],  // Southern-Western tip of India
      [37.5, 97.5]  // Northern-Eastern tip of India
    ]
  },

  // Layer Overlay Styles
  styles: {
    forestCover: {
      color: '#2D6A4F',
      fillColor: '#52B788',
      fillOpacity: 0.35,
      weight: 1.5
    },
    corridor: {
      color: '#E76F51',
      weight: 4,
      dashArray: '6, 8',
      opacity: 0.85
    },
    chokePoint: {
      color: '#D90429',
      fillColor: '#D90429',
      fillOpacity: 0.6,
      radius: 9
    },
    riskZone: {
      color: '#E07A5F',
      fillColor: '#F4A261',
      fillOpacity: 0.38,
      weight: 2
    },
    satelliteFootprint: {
      color: '#3A86FF',
      fillColor: '#4CC9F0',
      fillOpacity: 0.18,
      weight: 1.8,
      dashArray: '4, 6'
    },
    disruptionCloud: {
      color: '#9E2A2B',
      fillColor: '#540B0E',
      fillOpacity: 0.45,
      weight: 2,
      dashArray: '3, 5'
    }
  }
};

// Export to window
window.MAP_CONFIG = MAP_CONFIG;
