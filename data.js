/**
 * HABITAT IQ - Platform Data & Geospatial Telemetry Store
 * 
 * Hackathon: ASTRA 2026 | ANTERiX Club, VIT Bhopal
 * Reference Data Portals: ISRO Bhuvan, MOSDAC, VEDAS, Bhoonidhi
 * Note: Telemetry feeds and predictive models are realistic simulated datasets
 * structured to emulate ISRO payload outputs and RFC 5050 DTN protocols.
 */

const HABITAT_DATA = {
  metadata: {
    platform: "HABITAT IQ",
    tagline: "See the threat. Predict the risk. Protect the habitat. Stay connected.",
    subtitle: "Forest Intelligence, Wildlife Protection & Space-Service Resilience",
    event: "ASTRA 2026",
    host: "ANTERiX Club, VIT Bhopal",
    buildStamp: "Built overnight at ASTRA 2026",
    simulationNotice: "Simulated data based on ISRO sensor specifications and public mission footprints."
  },

  isroSources: [
    {
      id: "bhuvan",
      name: "Bhuvan",
      agency: "NRSC · ISRO",
      fullName: "ISRO Geo-Platform for Earth Observation",
      role: "High-resolution multi-spectral imagery, thematic forest layers, cadastral boundaries, and real-time active fire hotspot detection (Forest Survey of India feed).",
      payloads: ["Cartosat-2/3 PAN", "LISS-IV", "Thematic Cadastre"],
      updateFrequency: "Near Real-Time (6-12 hrs)",
      url: "https://bhuvan.nrsc.gov.in"
    },
    {
      id: "mosdac",
      name: "MOSDAC",
      agency: "SAC · ISRO",
      fullName: "Meteorological & Oceanographic Satellite Data Archival Centre",
      role: "Atmospheric humidity, cloud microphysics, thermal infrared anomalies, rainfall estimates, and cyclone/ocean surge tracking.",
      payloads: ["INSAT-3D/3DR Imager & Sounder", "Oceansat-3 OCM & Scatterometer"],
      updateFrequency: "Every 30 mins (Geostationary)",
      url: "https://www.mosdac.gov.in"
    },
    {
      id: "vedas",
      name: "VEDAS",
      agency: "SAC · ISRO",
      fullName: "Visualisation of Earth observation Data and Archival System",
      role: "Vegetation Index (NDVI/EVI) time series, forest canopy density, drought indices, biomass dynamics, and slope stability modeling.",
      payloads: ["Resourcesat-2A AWiFS", "RISAT-1A SAR", "Long-term Climate Records"],
      updateFrequency: "8-day / 15-day composite cycles",
      url: "https://vedas.sac.gov.in"
    },
    {
      id: "bhoonidhi",
      name: "Bhoonidhi",
      agency: "NRSC · ISRO",
      fullName: "National Remote Sensing Centre Open Dissemination Gateway",
      role: "Multi-mission Earth observation data hub providing calibrated SAR (C-band radar) backscatter and high-precision terrain elevation models (DEM).",
      payloads: ["EOS-04 (RISAT-1A)", "Resourcesat-2/2A", "Oceansat-3"],
      updateFrequency: "Daily pass ingest & calibrated L1/L2 products",
      url: "https://bhoonidhi.nrsc.gov.in"
    }
  ],

  regions: {
    "sundarbans": {
      id: "sundarbans",
      name: "Sundarbans Biosphere Reserve",
      state: "West Bengal, India",
      coords: "21.9497° N, 88.9007° E",
      mapCenter: [21.9497, 88.9007],
      mapZoom: 10,
      areaSqKm: "4,260 sq km (Indian Sector)",
      ecoType: "Tidal Halophytic Mangrove Delta",
      keySpecies: "Royal Bengal Tiger, Saltwater Crocodile, Gangetic Dolphin, Irrawaddy Dolphin",
      overallRiskScore: 54,
      overallRiskLevel: "Moderate",
      riskBreakdown: {
        fire: { score: 12, level: "Low", trend: "stable", source: "MOSDAC Thermal IR" },
        flood: { score: 86, level: "High", trend: "rising", source: "MOSDAC Ocean Altimetry & Bhuvan" },
        drought: { score: 08, level: "Low", trend: "stable", source: "VEDAS Soil Moisture" },
        landslide: { score: 04, level: "Low", trend: "stable", source: "Bhoonidhi Terrain Slope" }
      },
      whyScore: "MOSDAC oceanographic telemetry notes a 1.4-meter spring tide swell coinciding with a Bay of Bengal cyclonic depression. Low fire hazard due to wet saline mudflats, but acute risk of embankment breaches and tidal flooding across vulnerable fringe settlements.",
      
      // Historical Comparison (Before vs Now)
      temporalCompare: {
        beforeYear: "2024 Baseline",
        nowYear: "2026 Current",
        canopyCoverBefore: "77.2%",
        canopyCoverNow: "78.4%",
        ndviDelta: "+0.02 (Mangrove mudflat accretion in Jharkhali)",
        riskShift: "Flood risk elevated by +18% due to higher spring tide anomalies"
      },

      vegetation: {
        ndviCurrent: 0.73,
        ndviBaseline: 0.71,
        canopyCover: "78.4%",
        canopyChange12m: "+1.2% (Mangrove afforestation in Jharkhali)",
        healthStatus: "Resilient Tidal Canopy",
        summary: "Dense Rhizophora and Avicennia mangrove canopy remains resilient. Tidal creek siltation is moderate, with localized saline stress observed in non-flushed inner pockets.",
        sourceBadge: "Source: VEDAS · Resourcesat-2A AWiFS (Simulated)",
        historyMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        ndviValues: [0.68, 0.69, 0.70, 0.71, 0.72, 0.75, 0.77, 0.76, 0.75, 0.74, 0.73, 0.73]
      },
      forecast7Day: {
        days: ["Today", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5", "Day +6"],
        scores: [54, 62, 78, 85, 74, 60, 52],
        confidence: "88% confidence based on MOSDAC INSAT-3DR cyclone tracking",
        summary: "Risk will peak sharply on Days 2-3 due to full moon tidal surge combined with coastal depression wind shear, returning to seasonal baseline by Day 6."
      },
      wildlife: {
        focalSpecies: [
          {
            name: "Royal Bengal Tiger (Panthera tigris)",
            status: "Endangered",
            population: "~100 (Latest Census)",
            habitatPressure: "Moderate",
            notes: "Swimming across wide estuarine channels; freshwater pool access threatened by high salinity tides."
          },
          {
            name: "Saltwater Crocodile (Crocodylus porosus)",
            status: "Least Concern (Protected)",
            population: "Stable",
            habitatPressure: "Low",
            notes: "Basking density high on mudbanks in Lothian and Bhagabatpur sanctuaries."
          },
          {
            name: "Mangrove Horseshoe Crab",
            status: "Vulnerable",
            population: "Sensitive",
            habitatPressure: "High",
            notes: "Spawning beaches facing severe erosion near Sagar Island southern tip."
          }
        ],
        corridors: {
          status: "Semi-Fragmented (Estuarine Channels)",
          vulnerableZones: "Pakhiralay-Gosaba buffer creek crossings",
          connectivityIndex: "72/100"
        }
      },
      threats: [
        {
          id: "TH-SB-01",
          type: "Flood Inundation",
          title: "Tidal Surge Embankment Breach Warning",
          location: "Gosaba Block IX, River Bidyadhari bank",
          lat: 22.164,
          lng: 88.802,
          severity: "High",
          detectedTime: "2 hrs ago",
          source: "Source: MOSDAC & Bhuvan",
          action: "Deploy automated sandbag reinforcement crews and alert river patrol beat officers."
        },
        {
          id: "TH-SB-02",
          type: "Encroachment",
          title: "Suspected Illegal Aquaculture Pond Clearing",
          location: "Kultali buffer strip",
          lat: 21.890,
          lng: 88.580,
          severity: "Medium",
          detectedTime: "7 hrs ago",
          source: "Source: Bhoonidhi EOS-04 SAR",
          action: "Dispatch field boat patrol to inspect GPS coordinates; verify land lease registry."
        },
        {
          id: "TH-SB-03",
          type: "Degradation",
          title: "Canopy Dieback in Stagnant Saline Pocket",
          location: "Piramkhali compartment 4",
          lat: 21.980,
          lng: 88.750,
          severity: "Low",
          detectedTime: "14 hrs ago",
          source: "Source: VEDAS AWiFS",
          action: "Log coordinates for next ecological soil and water salinity sample run."
        }
      ],
      satellitePasses: [
        {
          satellite: "EOS-04 (RISAT-1A SAR)",
          type: "C-Band Radar (Cloud-Penetrating)",
          passStart: "12 mins from now",
          startTimeIST: "04:22 IST",
          durationSec: 520,
          durationFormatted: "8m 40s",
          maxElevation: "79° (Overhead)",
          signalQuality: "Excellent (98%)",
          directLinkBandwidth: "18.4 Mbps",
          backupLinkBandwidth: "64 kbps (UHF relay)",
          status: "Approaching"
        },
        {
          satellite: "Resourcesat-2A",
          type: "AWiFS Multispectral",
          passStart: "1h 48m from now",
          startTimeIST: "06:10 IST",
          durationSec: 410,
          durationFormatted: "6m 50s",
          maxElevation: "61°",
          signalQuality: "Good (84%)",
          directLinkBandwidth: "12.0 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Cartosat-3",
          type: "High-Res Optical Panchromatic",
          passStart: "4h 15m from now",
          startTimeIST: "08:35 IST",
          durationSec: 290,
          durationFormatted: "4m 50s",
          maxElevation: "84°",
          signalQuality: "Optimal (Optical Clear)",
          directLinkBandwidth: "24.0 Mbps",
          backupLinkBandwidth: "32 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Oceansat-3 (EOS-06)",
          type: "Ocean Color Monitor",
          passStart: "7h 02m from now",
          startTimeIST: "11:24 IST",
          durationSec: 460,
          durationFormatted: "7m 40s",
          maxElevation: "58°",
          signalQuality: "Good (81%)",
          directLinkBandwidth: "14.5 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        }
      ],

      // Geospatial Layer Polygons for Interactive Map
      geoOverlays: {
        forestCoverPolygon: [
          [22.25, 88.60], [22.20, 89.15], [21.65, 89.10], [21.60, 88.50], [21.90, 88.35]
        ],
        riskZonePolygon: [
          [22.22, 88.75], [22.18, 88.95], [22.05, 88.90], [22.08, 88.70]
        ],
        corridorLines: [
          [[22.15, 88.78], [22.05, 88.82], [21.95, 88.75]],
          [[22.10, 88.65], [21.98, 88.70], [21.80, 88.62]]
        ],
        chokePoints: [
          { lat: 22.08, lng: 88.80, name: "Gosaba Tidal Creek Crossing" },
          { lat: 21.92, lng: 88.68, name: "Pakhiralay Estuary Pinch" }
        ],
        firePoints: [
          { lat: 22.19, lng: 88.55, label: "Agricultural Field Burning (Fringe)", frp: "8.4 MW" }
        ],
        satelliteSwath: [
          [22.50, 87.80], [22.80, 89.60], [21.20, 90.00], [20.90, 88.20]
        ]
      }
    },

    "kaziranga": {
      id: "kaziranga",
      name: "Kaziranga National Park & Tiger Reserve",
      state: "Assam, India",
      coords: "26.5775° N, 93.1711° E",
      mapCenter: [26.5775, 93.1711],
      mapZoom: 11,
      areaSqKm: "1,085 sq km (Core & Additions)",
      ecoType: "Brahmaputra Floodplain Alluvial Grassland & Semi-Evergreen",
      keySpecies: "Great Indian One-Horned Rhinoceros, Asian Elephant, Bengal Tiger, Wild Water Buffalo, Swamp Deer",
      overallRiskScore: 68,
      overallRiskLevel: "Elevated",
      riskBreakdown: {
        fire: { score: 18, level: "Low", trend: "falling", source: "MOSDAC Thermal IR" },
        flood: { score: 79, level: "High", trend: "rising", source: "MOSDAC & Bhuvan Flood Portal" },
        drought: { score: 09, level: "Low", trend: "stable", source: "VEDAS Soil Moisture" },
        landslide: { score: 26, level: "Low-Med", trend: "stable", source: "Bhoonidhi DEM (Karbi Anglong)" }
      },
      whyScore: "Bhoonidhi SAR backscatter analysis reveals 41% waterlogged surface across Kohora and Bagori ranges. Brahmaputra runoff is compressing wildlife into elevated natural highlands and forcing crossings across National Highway 715 toward the southern Karbi Anglong hills.",
      
      temporalCompare: {
        beforeYear: "2024 Baseline",
        nowYear: "2026 Current",
        canopyCoverBefore: "65.0%",
        canopyCoverNow: "64.2%",
        ndviDelta: "-0.03 (Grassland scouring from seasonal siltation)",
        riskShift: "Inundation risk +14% due to intense early runoff in upper Brahmaputra"
      },

      vegetation: {
        ndviCurrent: 0.68,
        ndviBaseline: 0.65,
        canopyCover: "64.2%",
        canopyChange12m: "-0.8% (Grassland scouring from seasonal siltation)",
        healthStatus: "Floodplain Alluvial Growth",
        summary: "Tall elephant grass and wet alluvial plains show high moisture saturation. Water bodies (beels) are well-replenished, but grassland forage areas are partially submerged.",
        sourceBadge: "Source: VEDAS · Resourcesat-2A AWiFS (Simulated)",
        historyMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        ndviValues: [0.62, 0.64, 0.65, 0.67, 0.69, 0.72, 0.70, 0.68, 0.67, 0.66, 0.65, 0.64]
      },
      forecast7Day: {
        days: ["Today", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5", "Day +6"],
        scores: [68, 74, 82, 80, 71, 63, 58],
        confidence: "91% confidence based on Brahmaputra upstream gauge & MOSDAC precipitation radar",
        summary: "Inundation will peak over the next 48 to 72 hours. Ranger divisions should maintain strict speed controls on NH-715 and monitor Karbi Anglong animal corridors."
      },
      wildlife: {
        focalSpecies: [
          {
            name: "Great Indian One-Horned Rhino (Rhinoceros unicornis)",
            status: "Vulnerable",
            population: "2,613 (2022 Census)",
            habitatPressure: "High",
            notes: "Herds congregating on 33 artificial highlands constructed across Kohora, Bagori and Agoratoli."
          },
          {
            name: "Asian Elephant (Elephas maximus)",
            status: "Endangered",
            population: "~1,100",
            habitatPressure: "High",
            notes: "Active migration through Kanchanjuri and Haldibari animal corridors across NH-715."
          },
          {
            name: "Eastern Swamp Deer (Barasingha)",
            status: "Vulnerable",
            population: "~900",
            habitatPressure: "Critical",
            notes: "Confined to central grasslands; isolated pockets under risk from water current surges."
          }
        ],
        corridors: {
          status: "Critical Bottleneck",
          vulnerableZones: "Panbari, Kanchanjuri and Amguri road crossings",
          connectivityIndex: "58/100"
        }
      },
      threats: [
        {
          id: "TH-KZ-01",
          type: "Flood Inundation",
          title: "Brahmaputra Inundation of Central Kohora Grasslands",
          location: "Central Range Kohora",
          lat: 26.582,
          lng: 93.382,
          severity: "High",
          detectedTime: "1 hr ago",
          source: "Source: Bhoonidhi EOS-04 SAR",
          action: "Deploy drone surveillance along highland perimeters; position rescue speedboats at Mihimukh."
        },
        {
          id: "TH-KZ-02",
          type: "Corridor Choke",
          title: "Heavy Wildlife Transit Across NH-715 Highway",
          location: "Haldibari Corridor Marker 12",
          lat: 26.610,
          lng: 93.245,
          severity: "High",
          detectedTime: "3 hrs ago",
          source: "Source: Bhuvan Field Sensor Grid",
          action: "Enforce automated 40 km/h speed sensor barriers and activate forest guard escort convoys."
        },
        {
          id: "TH-KZ-03",
          type: "Encroachment",
          title: "Unrecorded Timber Extraction Activity",
          location: "Southern buffer adjoining Karbi Anglong border",
          lat: 26.490,
          lng: 93.180,
          severity: "Medium",
          detectedTime: "9 hrs ago",
          source: "Source: VEDAS Change Detection",
          action: "Coordinate joint inspection patrol with Karbi Anglong autonomous hill district rangers."
        }
      ],
      satellitePasses: [
        {
          satellite: "EOS-04 (RISAT-1A SAR)",
          type: "C-Band Radar",
          passStart: "28 mins from now",
          startTimeIST: "04:38 IST",
          durationSec: 540,
          durationFormatted: "9m 00s",
          maxElevation: "88° (Near Zenith)",
          signalQuality: "Excellent (99%)",
          directLinkBandwidth: "19.2 Mbps",
          backupLinkBandwidth: "64 kbps",
          status: "Approaching"
        },
        {
          satellite: "Cartosat-3",
          type: "High-Res Optical",
          passStart: "2h 40m from now",
          startTimeIST: "07:02 IST",
          durationSec: 310,
          durationFormatted: "5m 10s",
          maxElevation: "74°",
          signalQuality: "Good (79% - Morning Haze)",
          directLinkBandwidth: "21.5 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Resourcesat-2A",
          type: "LISS-IV Multispectral",
          passStart: "5h 10m from now",
          startTimeIST: "09:32 IST",
          durationSec: 440,
          durationFormatted: "7m 20s",
          maxElevation: "66°",
          signalQuality: "Good (86%)",
          directLinkBandwidth: "13.8 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "INSAT-3DR",
          type: "Geostationary Data Relay",
          passStart: "Continuous Visibility",
          startTimeIST: "Always Visible",
          durationSec: 86400,
          durationFormatted: "Stationary",
          maxElevation: "52°",
          signalQuality: "Stable Low-Bandwidth (92%)",
          directLinkBandwidth: "1.2 Mbps",
          backupLinkBandwidth: "128 kbps",
          status: "Active Relay"
        }
      ],

      geoOverlays: {
        forestCoverPolygon: [
          [26.75, 93.00], [26.72, 93.65], [26.48, 93.60], [26.50, 93.05]
        ],
        riskZonePolygon: [
          [26.72, 93.15], [26.70, 93.55], [26.58, 93.50], [26.60, 93.12]
        ],
        corridorLines: [
          [[26.59, 93.22], [26.54, 93.24], [26.48, 93.26]], // Haldibari
          [[26.62, 93.38], [26.57, 93.40], [26.49, 93.42]], // Kanchanjuri
          [[26.60, 93.52], [26.55, 93.54], [26.48, 93.55]]  // Panbari
        ],
        chokePoints: [
          { lat: 26.55, lng: 93.24, name: "Haldibari NH-715 Highway Crossing" },
          { lat: 26.56, lng: 93.40, name: "Kanchanjuri Migration Choke" }
        ],
        firePoints: [],
        satelliteSwath: [
          [27.10, 92.40], [27.30, 94.20], [26.00, 94.40], [25.80, 92.60]
        ]
      }
    },

    "western-ghats": {
      id: "western-ghats",
      name: "Western Ghats - Wayanad & Nilgiri Biosphere",
      state: "Kerala & Tamil Nadu, India",
      coords: "11.6854° N, 76.1320° E",
      mapCenter: [11.6854, 76.1320],
      mapZoom: 11,
      areaSqKm: "5,520 sq km (Upper Nilgiri Complex)",
      ecoType: "Tropical Wet Evergreen, Shola-Grassland & Moist Deciduous",
      keySpecies: "Asian Elephant, Bengal Tiger, Lion-Tailed Macaque, Nilgiri Tahr, Great Pied Hornbill",
      overallRiskScore: 74,
      overallRiskLevel: "High",
      riskBreakdown: {
        fire: { score: 38, level: "Moderate", trend: "stable", source: "MOSDAC Thermal IR" },
        flood: { score: 62, level: "Moderate-High", trend: "rising", source: "MOSDAC Precipitation Radar" },
        drought: { score: 22, level: "Low", trend: "stable", source: "VEDAS Soil Moisture" },
        landslide: { score: 88, level: "Critical", trend: "rising", source: "Bhuvan & Bhoonidhi Slope DEM" }
      },
      whyScore: "VEDAS slope stability models combined with MOSDAC cumulative rainfall metrics (280mm recorded across 72 hrs) indicate extreme landslide probability along steep monoculture tea slopes and degraded forest fringes in Meppadi-Vythiri belt.",
      
      temporalCompare: {
        beforeYear: "2024 Baseline",
        nowYear: "2026 Current",
        canopyCoverBefore: "82.3%",
        canopyCoverNow: "82.7%",
        ndviDelta: "+0.01 (Dense shola protection offset by tea expansion)",
        riskShift: "Landslide hazard heightened by +22% following extreme rainfall events"
      },

      vegetation: {
        ndviCurrent: 0.82,
        ndviBaseline: 0.80,
        canopyCover: "82.7%",
        canopyChange12m: "+0.4% (Dense shola protection offset by tea expansion)",
        healthStatus: "Dense Multi-Tier Wet Canopy",
        summary: "Exceptional canopy moisture index. Shola cloud forests retain high organic saturation. Edge fragmentation observed along commercial coffee and tea estate boundaries.",
        sourceBadge: "Source: VEDAS · Resourcesat-2A AWiFS (Simulated)",
        historyMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        ndviValues: [0.76, 0.77, 0.78, 0.79, 0.81, 0.84, 0.86, 0.85, 0.84, 0.83, 0.82, 0.82]
      },
      forecast7Day: {
        days: ["Today", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5", "Day +6"],
        scores: [74, 82, 88, 79, 65, 52, 45],
        confidence: "87% confidence based on MOSDAC orographic cloud tracking & SAC slope moisture",
        summary: "Landslide risk remains acute through Day +2 as soil pore water pressure approaches critical thresholds. Slope drainage advisories active."
      },
      wildlife: {
        focalSpecies: [
          {
            name: "Asian Elephant (Elephas maximus)",
            status: "Endangered",
            population: "~6,000 (Brahmagiri-Nilgiri landscape)",
            habitatPressure: "High",
            notes: "Periyar-Wayanad connectivity interrupted by steep landslide debris and estate fences."
          },
          {
            name: "Lion-Tailed Macaque (Macaca silenus)",
            status: "Endangered",
            population: "~3,500 (Endemic to Western Ghats)",
            habitatPressure: "Moderate",
            notes: "Arboreal canopy gaps force troops to descend to ground, increasing road mortality."
          },
          {
            name: "Nilgiri Tahr (Nilgiritragus hylocrius)",
            status: "Endangered",
            population: "~3,100 (Patchy distributions)",
            habitatPressure: "Medium",
            notes: "Confined to cliff faces and high-elevation montane grasslands above 1,800m."
          }
        ],
        corridors: {
          status: "Fractured by Estate Enclaves",
          vulnerableZones: "Thirunelly-Kudrakote corridor and Meppadi hill crests",
          connectivityIndex: "64/100"
        }
      },
      threats: [
        {
          id: "TH-WG-01",
          type: "Landslide / Slope Instability",
          title: "Acute Debris Flow & Slope Cleavage Alert",
          location: "Upper Chooralmala-Meppadi Escarpment",
          lat: 11.534,
          lng: 76.182,
          severity: "High",
          detectedTime: "45 mins ago",
          source: "Source: Bhuvan Landslide Warning Portal",
          action: "Issue immediate valley evacuation advisories and suspend heavy vehicle transit on ghat passes."
        },
        {
          id: "TH-WG-02",
          type: "Invasive Flora Infestation",
          title: "Rapid Spread of Senna spectabilis Canopy Choking",
          location: "Muthanga Wildlife Range Compartment 12",
          lat: 11.662,
          lng: 76.350,
          severity: "Medium",
          detectedTime: "11 hrs ago",
          source: "Source: VEDAS Species Mapping",
          action: "Schedule manual debarking protocol in coordination with Kerala Forest Research Institute."
        },
        {
          id: "TH-WG-03",
          type: "Corridor Encroachment",
          title: "Unauthorized Electric Fencing in Elephant Movement Track",
          location: "Sultan Bathery border agrarian edge",
          lat: 11.660,
          lng: 76.250,
          severity: "Medium",
          detectedTime: "18 hrs ago",
          source: "Source: Bhoonidhi Cartosat-3 Optical",
          action: "Despatch Rapid Response Team (RRT) to dismantle illegal non-energized high-tensile wire."
        }
      ],
      satellitePasses: [
        {
          satellite: "EOS-04 (RISAT-1A SAR)",
          type: "C-Band Synthetic Aperture Radar",
          passStart: "42 mins from now",
          startTimeIST: "04:52 IST",
          durationSec: 510,
          durationFormatted: "8m 30s",
          maxElevation: "76°",
          signalQuality: "Excellent (96%)",
          directLinkBandwidth: "18.0 Mbps",
          backupLinkBandwidth: "64 kbps",
          status: "Approaching"
        },
        {
          satellite: "Cartosat-3",
          type: "High-Res Panchromatic",
          passStart: "3h 05m from now",
          startTimeIST: "07:27 IST",
          durationSec: 320,
          durationFormatted: "5m 20s",
          maxElevation: "81°",
          signalQuality: "Moderate (Orographic Cloud Intermittent)",
          directLinkBandwidth: "16.5 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Resourcesat-2A",
          type: "AWiFS / LISS-IV",
          passStart: "5h 50m from now",
          startTimeIST: "10:12 IST",
          durationSec: 430,
          durationFormatted: "7m 10s",
          maxElevation: "63°",
          signalQuality: "Good (82%)",
          directLinkBandwidth: "13.2 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Oceansat-3",
          type: "Atmospheric & Wind Scatterometer",
          passStart: "8h 15m from now",
          startTimeIST: "12:37 IST",
          durationSec: 480,
          durationFormatted: "8m 00s",
          maxElevation: "69°",
          signalQuality: "Good (85%)",
          directLinkBandwidth: "15.0 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        }
      ],

      geoOverlays: {
        forestCoverPolygon: [
          [11.95, 75.90], [11.90, 76.50], [11.40, 76.45], [11.45, 75.95]
        ],
        riskZonePolygon: [
          [11.58, 76.12], [11.56, 76.24], [11.48, 76.22], [11.50, 76.10]
        ],
        corridorLines: [
          [[11.75, 76.15], [11.68, 76.22], [11.60, 76.28]], // Thirunelly-Kudrakote
          [[11.65, 76.32], [11.58, 76.30], [11.50, 76.25]]
        ],
        chokePoints: [
          { lat: 11.68, lng: 76.22, name: "Thirunelly Valley Choke" },
          { lat: 11.53, lng: 76.18, name: "Chooralmala Debris Scarp" }
        ],
        firePoints: [],
        satelliteSwath: [
          [12.30, 75.20], [12.50, 77.00], [11.00, 77.20], [10.80, 75.40]
        ]
      }
    },

    "corbett": {
      id: "corbett",
      name: "Jim Corbett National Park & Shivalik Belt",
      state: "Uttarakhand, India",
      coords: "29.5300° N, 78.7747° E",
      mapCenter: [29.5300, 78.7747],
      mapZoom: 11,
      areaSqKm: "1,288 sq km (Reserve Core & Buffer)",
      ecoType: "Sub-Himalayan Sal Deciduous & Ramganga Riverine Valley",
      keySpecies: "Bengal Tiger, Asian Elephant, Gharial, Himalayan Black Bear, Otters",
      overallRiskScore: 61,
      overallRiskLevel: "Elevated",
      riskBreakdown: {
        fire: { score: 71, level: "High", trend: "rising", source: "MOSDAC Thermal IR & FSI Bhuvan" },
        flood: { score: 32, level: "Low-Med", trend: "stable", source: "MOSDAC River Basin" },
        drought: { score: 58, level: "Moderate", trend: "rising", source: "VEDAS Soil Moisture Index" },
        landslide: { score: 44, level: "Moderate", trend: "stable", source: "Bhoonidhi Shivalik Slope DEM" }
      },
      whyScore: "MOSDAC thermal infrared sensor suites register 5 localized thermal anomalies in the Chir Pine - Sal transition boundary of the Dhikala and Bijrani zones. Ambient relative humidity has dipped below 22% with high dry resinous fuel loading.",
      
      temporalCompare: {
        beforeYear: "2024 Baseline",
        nowYear: "2026 Current",
        canopyCoverBefore: "72.1%",
        canopyCoverNow: "71.0%",
        ndviDelta: "-0.02 (Dry season leaf shedding & increased heat stress)",
        riskShift: "Thermal fire hazard index climbed from 58 to 71"
      },

      vegetation: {
        ndviCurrent: 0.61,
        ndviBaseline: 0.63,
        canopyCover: "71.0%",
        canopyChange12m: "-1.1% (Seasonal leaf-shedding & thermal stress)",
        healthStatus: "Deciduous Pre-Monsoon Dry State",
        summary: "Dry deciduous Shorea robusta (Sal) canopy exhibits normal seasonal leaf litter accumulation. Dry grass biomass along Ramganga riverbanks poses increased ignition propensity.",
        sourceBadge: "Source: VEDAS · Resourcesat-2A AWiFS (Simulated)",
        historyMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        ndviValues: [0.65, 0.66, 0.64, 0.61, 0.59, 0.63, 0.71, 0.73, 0.72, 0.69, 0.67, 0.65]
      },
      forecast7Day: {
        days: ["Today", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5", "Day +6"],
        scores: [61, 67, 73, 76, 70, 64, 59],
        confidence: "85% confidence based on MOSDAC thermal projections & surface wind forecasts",
        summary: "Fire ignition risk peaks over the next 4 days under dry northwestern katabatic winds. Pre-suppression counter-burns should be finalized."
      },
      wildlife: {
        focalSpecies: [
          {
            name: "Bengal Tiger (Panthera tigris)",
            status: "Endangered",
            population: "~260 (Highest reserve density in world)",
            habitatPressure: "Moderate",
            notes: "High territorial overlap along perennial Ramganga river pools; young males pushed to fringes."
          },
          {
            name: "Asian Elephant (Elephas maximus)",
            status: "Endangered",
            population: "~1,200",
            habitatPressure: "Moderate",
            notes: "Large breeding herds frequenting Dhikala chaur and reservoir edges."
          },
          {
            name: "Gharial (Gavialis gangeticus)",
            status: "Critically Endangered",
            population: "~95 breeding individuals",
            habitatPressure: "High",
            notes: "Nesting sandbanks vulnerable to regulated reservoir water discharge fluctuations."
          }
        ],
        corridors: {
          status: "Pressure on Kosi River Transit",
          vulnerableZones: "Mohan-Kumeria highway corridor & Ringora village buffer",
          connectivityIndex: "68/100"
        }
      },
      threats: [
        {
          id: "TH-CB-01",
          type: "Forest Fire Hotspot",
          title: "Thermal Hotspot Cluster in Chir Pine-Sal Ridge",
          location: "Dhikala Range Compartment 7B",
          lat: 29.620,
          lng: 78.890,
          severity: "High",
          detectedTime: "30 mins ago",
          source: "Source: MOSDAC INSAT-3DR & Bhuvan Fire",
          action: "Deploy rapid fire-watcher crew with leaf blowers and backpack water sprayers; monitor wind vector."
        },
        {
          id: "TH-CB-02",
          type: "Corridor Disturbance",
          title: "Night Commercial Vehicle Speeds Along Kosi Corridor",
          location: "NH-309 Ramnagar-Ranikhet highway stretch",
          lat: 29.510,
          lng: 79.080,
          severity: "Medium",
          detectedTime: "5 hrs ago",
          source: "Source: Bhuvan Field Sensor Grid",
          action: "Alert checkpost staff to mandate time-stamped vehicle transit chits."
        },
        {
          id: "TH-CB-03",
          type: "Resource Depletion",
          title: "Waterhole Desiccation in Dry Foothill Ridge",
          location: "Bijrani Zone Waterhole #4",
          lat: 29.560,
          lng: 78.980,
          severity: "Medium",
          detectedTime: "16 hrs ago",
          source: "Source: VEDAS Surface Water Body Tracker",
          action: "Activate solar pump backup line to replenish secondary mud saucer for wildlife."
        }
      ],
      satellitePasses: [
        {
          satellite: "EOS-04 (RISAT-1A SAR)",
          type: "Radar Imaging Satellite",
          passStart: "19 mins from now",
          startTimeIST: "04:29 IST",
          durationSec: 530,
          durationFormatted: "8m 50s",
          maxElevation: "82°",
          signalQuality: "Excellent (97%)",
          directLinkBandwidth: "18.8 Mbps",
          backupLinkBandwidth: "64 kbps",
          status: "Approaching"
        },
        {
          satellite: "Cartosat-3",
          type: "Sub-Meter Optical",
          passStart: "2h 15m from now",
          startTimeIST: "06:37 IST",
          durationSec: 300,
          durationFormatted: "5m 00s",
          maxElevation: "78°",
          signalQuality: "Excellent (94% - Crystal Skies)",
          directLinkBandwidth: "22.4 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Resourcesat-2A",
          type: "LISS-IV & AWiFS",
          passStart: "4h 55m from now",
          startTimeIST: "09:17 IST",
          durationSec: 420,
          durationFormatted: "7m 00s",
          maxElevation: "65°",
          signalQuality: "Good (85%)",
          directLinkBandwidth: "13.5 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "INSAT-3DR",
          type: "Geostationary Thermal & Weather",
          passStart: "Continuous Visibility",
          startTimeIST: "Always Visible",
          durationSec: 86400,
          durationFormatted: "Stationary",
          maxElevation: "49°",
          signalQuality: "Constant High (93%)",
          directLinkBandwidth: "1.2 Mbps",
          backupLinkBandwidth: "128 kbps",
          status: "Active Relay"
        }
      ],

      geoOverlays: {
        forestCoverPolygon: [
          [29.75, 78.60], [29.70, 79.15], [29.40, 79.10], [29.42, 78.65]
        ],
        riskZonePolygon: [
          [29.68, 78.82], [29.64, 78.96], [29.56, 78.92], [29.60, 78.78]
        ],
        corridorLines: [
          [[29.58, 78.95], [29.53, 79.02], [29.48, 79.09]]
        ],
        chokePoints: [
          { lat: 29.52, lng: 79.06, name: "Mohan-Kumeria Highway Pinch Point" }
        ],
        firePoints: [
          { lat: 29.620, lng: 78.890, label: "Dhikala Compartment 7B Anomaly", frp: "14.2 MW" },
          { lat: 29.605, lng: 78.875, label: "Sal Ridge Smolder", frp: "6.8 MW" }
        ],
        satelliteSwath: [
          [30.10, 77.90], [30.30, 79.80], [28.90, 80.00], [28.70, 78.10]
        ]
      }
    },

    "bandhavgarh": {
      id: "bandhavgarh",
      name: "Bandhavgarh National Park & Central Highlands",
      state: "Madhya Pradesh, India",
      coords: "23.7020° N, 81.0267° E",
      mapCenter: [23.7020, 81.0267],
      mapZoom: 11,
      areaSqKm: "1,536 sq km (Vindhyan Mountain Plateau)",
      ecoType: "Tropical Dry Deciduous, Mixed Bamboo Brake & Sandstone Hills",
      keySpecies: "Royal Bengal Tiger, Indian Leopard, Gaur (Indian Bison), Sloth Bear, Dhole",
      overallRiskScore: 71,
      overallRiskLevel: "High",
      riskBreakdown: {
        fire: { score: 82, level: "Critical", trend: "rising", source: "MOSDAC Thermal IR & Bhuvan" },
        flood: { score: 06, level: "Low", trend: "stable", source: "MOSDAC Precipitation" },
        drought: { score: 79, level: "High", trend: "rising", source: "VEDAS Soil Moisture Tracker" },
        landslide: { score: 08, level: "Low", trend: "stable", source: "Bhoonidhi Elevation DEM" }
      },
      whyScore: "VEDAS surface water body telemetry registers a 44% shrinkage in natural forest waterholes across Tala and Khitauli. Bamboo brakes (Dendrocalamus strictus) are bone dry with ambient temperatures surpassing 41.5°C, resulting in severe spontaneous fire hazards.",
      
      temporalCompare: {
        beforeYear: "2024 Baseline",
        nowYear: "2026 Current",
        canopyCoverBefore: "60.4%",
        canopyCoverNow: "58.6%",
        ndviDelta: "-0.04 (Bamboo dieback & acute seasonal drought)",
        riskShift: "Fire vulnerability leaped from 65 to 82 due to extreme thermal conditions"
      },

      vegetation: {
        ndviCurrent: 0.51,
        ndviBaseline: 0.55,
        canopyCover: "58.6%",
        canopyChange12m: "-1.8% (Severe thermal dehydration & dry season dormancy)",
        healthStatus: "Dry Deciduous Drought Stress",
        summary: "Sal and mixed teak-bamboo stands show extensive leaf-shedding. Understory moisture is depleted, leaving dry flammable biomass on sandstone plateau slopes.",
        sourceBadge: "Source: VEDAS · Resourcesat-2A AWiFS (Simulated)",
        historyMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        ndviValues: [0.58, 0.59, 0.56, 0.51, 0.47, 0.52, 0.68, 0.72, 0.70, 0.64, 0.61, 0.58]
      },
      forecast7Day: {
        days: ["Today", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5", "Day +6"],
        scores: [71, 78, 84, 86, 83, 76, 70],
        confidence: "89% confidence based on MOSDAC thermal sensors & VEDAS fuel moisture index",
        summary: "Critical fire conditions will persist over the next 5 days. Watchtower teams in Tala and Magdhi must maintain round-the-clock thermal scanning."
      },
      wildlife: {
        focalSpecies: [
          {
            name: "Royal Bengal Tiger (Panthera tigris)",
            status: "Endangered",
            population: "~85 (High density per sq km)",
            habitatPressure: "Critical",
            notes: "High congregation around 6 active perennial water saucers; risk of territorial skirmishes."
          },
          {
            name: "Gaur / Indian Bison (Bos gaurus)",
            status: "Vulnerable",
            population: "~150 (Reintroduced herd thriving)",
            habitatPressure: "High",
            notes: "Herds forced to migrate towards Charanganga riverbed due to dry plateau troughs."
          },
          {
            name: "Sloth Bear (Melursus ursinus)",
            status: "Vulnerable",
            population: "Moderate",
            habitatPressure: "Medium",
            notes: "Foraging along mahua groves near village borders during late night hours."
          }
        ],
        corridors: {
          status: "Severely Stressed",
          vulnerableZones: "Panpatha sanctuary wildlife link and Umaria village fringe",
          connectivityIndex: "61/100"
        }
      },
      threats: [
        {
          id: "TH-BV-01",
          type: "Forest Fire Hotspot",
          title: "Active Understory Bamboo Fire Detected",
          location: "Tala Range Hillside Sector 4",
          lat: 23.714,
          lng: 81.041,
          severity: "High",
          detectedTime: "25 mins ago",
          source: "Source: MOSDAC INSAT-3DR Thermal IR",
          action: "Dispatch fire line clearance squad and tractor bowser; activate secondary firebreaks."
        },
        {
          id: "TH-BV-02",
          type: "Severe Water Scarcity",
          title: "Critical Waterhole Depletion Near Cattle Buffer",
          location: "Khitauli Boundary Marker 9",
          lat: 23.680,
          lng: 80.980,
          severity: "High",
          detectedTime: "4 hrs ago",
          source: "Source: VEDAS Water Body Portal",
          action: "Dispatch water tankers to refill saucer ponds and prevent wildlife from venturing into villages."
        },
        {
          id: "TH-BV-03",
          type: "Human-Wildlife Conflict",
          title: "Tiger Movement Tracked Near Umaria Cattle Siding",
          location: "Buffer Zone Village Fringe",
          lat: 23.640,
          lng: 80.950,
          severity: "Medium",
          detectedTime: "8 hrs ago",
          source: "Source: Bhuvan Field Sensor Grid",
          action: "Deploy village megaphone alerts; station forest patrolling van along fence perimeter."
        }
      ],
      satellitePasses: [
        {
          satellite: "EOS-04 (RISAT-1A SAR)",
          type: "C-Band Radar",
          passStart: "22 mins from now",
          startTimeIST: "04:32 IST",
          durationSec: 525,
          durationFormatted: "8m 45s",
          maxElevation: "84°",
          signalQuality: "Excellent (99%)",
          directLinkBandwidth: "19.0 Mbps",
          backupLinkBandwidth: "64 kbps",
          status: "Approaching"
        },
        {
          satellite: "Cartosat-3",
          type: "High-Res Panchromatic",
          passStart: "2h 30m from now",
          startTimeIST: "06:52 IST",
          durationSec: 305,
          durationFormatted: "5m 05s",
          maxElevation: "79°",
          signalQuality: "Optimal (97% - Clear Inland Atmosphere)",
          directLinkBandwidth: "23.0 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Resourcesat-2A",
          type: "AWiFS Multispectral",
          passStart: "5h 20m from now",
          startTimeIST: "09:42 IST",
          durationSec: 430,
          durationFormatted: "7m 10s",
          maxElevation: "67°",
          signalQuality: "Good (88%)",
          directLinkBandwidth: "14.0 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        },
        {
          satellite: "Oceansat-3",
          type: "Ocean & Land Thermal Monitor",
          passStart: "7h 45m from now",
          startTimeIST: "12:07 IST",
          durationSec: 470,
          durationFormatted: "7m 50s",
          maxElevation: "61°",
          signalQuality: "Good (84%)",
          directLinkBandwidth: "14.8 Mbps",
          backupLinkBandwidth: "48 kbps",
          status: "Scheduled"
        }
      ],

      geoOverlays: {
        forestCoverPolygon: [
          [23.85, 80.85], [23.82, 81.25], [23.55, 81.20], [23.58, 80.82]
        ],
        riskZonePolygon: [
          [23.76, 80.98], [23.74, 81.12], [23.66, 81.08], [23.68, 80.95]
        ],
        corridorLines: [
          [[23.72, 81.02], [23.65, 81.08], [23.58, 81.15]] // Panpatha link
        ],
        chokePoints: [
          { lat: 23.65, lng: 81.08, name: "Panpatha Sanctuary Corridor Link" }
        ],
        firePoints: [
          { lat: 23.714, lng: 81.041, label: "Tala Bamboo Brake Combustions", frp: "21.6 MW" },
          { lat: 23.695, lng: 81.020, label: "Dry Fuel Pocket Anomaly", frp: "11.2 MW" }
        ],
        satelliteSwath: [
          [24.20, 80.10], [24.40, 82.00], [23.00, 82.20], [22.80, 80.30]
        ]
      }
    }
  },

  initialReports: [
    {
      id: "RPT-2026-081",
      regionId: "sundarbans",
      title: "Saline Embankment Creep Observation",
      author: "Beat Officer S. Roy (Gosaba Range)",
      category: "Infrastructure Vulnerability",
      priority: "High",
      summary: "30-meter clay dyke showing progressive hairline subsidence at low tide. Immediate reinforcement timber piles required before full moon swell.",
      timestamp: "Today, 03:15 IST",
      status: "Waiting for pass",
      assignedPass: "EOS-04 (RISAT-1A SAR) at 04:22 IST",
      payloadSize: "1.4 MB (Encrypted Sensor Log + Geo-Photos)",
      disruptionRescheduled: false
    },
    {
      id: "RPT-2026-082",
      regionId: "kaziranga",
      title: "Rhino Highland Herd Distribution Log",
      author: "Range Officer T. Gogoi (Kohora Range)",
      category: "Wildlife Movement",
      priority: "Normal",
      summary: "24 rhinos recorded safely occupying Highland #6 and #7. Forage grass distributed; highway speed monitors reporting 100% compliance.",
      timestamp: "Today, 02:40 IST",
      status: "Queued",
      assignedPass: "EOS-04 (RISAT-1A SAR) at 04:38 IST",
      payloadSize: "820 KB (Telemetry Stream)",
      disruptionRescheduled: false
    },
    {
      id: "RPT-2026-083",
      regionId: "western-ghats",
      title: "Soil Saturation & Escarpment Inclinometer Readout",
      author: "Field Scientist Dr. N. Menon",
      category: "Disaster Warning",
      priority: "Urgent",
      summary: "Borehole sensor indicates pore water pressure exceeding 92 kPa. Recommend precautionary closure of upper Meppadi road segment.",
      timestamp: "Today, 03:50 IST",
      status: "Waiting for pass",
      assignedPass: "EOS-04 (RISAT-1A SAR) at 04:52 IST",
      payloadSize: "2.1 MB (Sensor Time-Series)",
      disruptionRescheduled: false
    }
  ]
};

// Export to window
window.HABITAT_DATA = HABITAT_DATA;
