import "./resources.scss";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue (outside component)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Helper component
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function Resources() {
  const defaultLocation = {
    name: "Charlotte, NC",
    lat: 35.2271,
    lng: -80.8431,
    radius: 50,
  };
  
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(defaultLocation.radius);
  const [facilities, setFacilities] = useState([]);
  const [center, setCenter] = useState([
    defaultLocation.lat,
    defaultLocation.lng,
  ]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const milesToMeters = (miles) => miles * 1609.344;

  const fetchFacilityLocations = async (searchLocation, radius = 50) => {
    try {
      const cacheKey = `facilities_${searchLocation.toLowerCase()}_${radius}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      const geoRes = await fetch(
        `${apiUrl}/api/v1/geo?location=${encodeURIComponent(searchLocation)}`
      );
      const geoData = await geoRes.json();
      console.log('geoData', geoData)

      const lat = geoData.latitude;
      const lon = geoData.longitude;

      radius = milesToMeters(radius);

      const query = `
      [out:json][timeout:25];
      (
        node(around:${radius},${lat},${lon})["amenity"="recycling"];
        node(around:${radius},${lat},${lon})["recycling_type"];
        node(around:${radius},${lat},${lon})["recycling:glass"="yes"];
        node(around:${radius},${lat},${lon})["recycling:paper"="yes"];
        node(around:${radius},${lat},${lon})["recycling:plastic"="yes"];
        node(around:${radius},${lat},${lon})["recycling:aluminum"="yes"];
        node(around:${radius},${lat},${lon})["recycling:cardboard"="yes"];
      );
      out body;
      `;

      const res = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "data=" + encodeURIComponent(query),
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Overpass returned non-JSON:", text);
        return [];
      }

      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const formatResults = (data) => {
    return (
      data?.elements
        ?.map((el) => {
          const tags = el.tags || {};

          const street =
            tags["addr:housenumber"] && tags["addr:street"]
              ? `${tags["addr:housenumber"]} ${tags["addr:street"]}`
              : null;

          return {
            name: tags.name || "No Name",
            street,
            hours: tags.opening_hours || null,
            phone: tags.phone || null,
            website: tags.website || null,
            lat: el.lat,
            lng: el.lon,
          };
        })
        .filter((c) => c.street) || []
    );
  };

  const loadFacilities = async (search, rad) => {
    setLoading(true);

    const raw = await fetchFacilityLocations(search, rad);
    const formatted = formatResults(raw);

    setFacilities(formatted);

    if (formatted[0]) {
      setCenter([formatted[0].lat, formatted[0].lng]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadFacilities(defaultLocation.name, defaultLocation.radius);
  }, []);

  return (
    <div className="resources">
      {/* LEFT PANEL */}
      <div className="resources__left-panel">
        <h2>Find Recycling Facilities</h2>

        <div className="resources__form-box">
          <input
            type="text"
            placeholder="Enter city..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            />

          <input
            type="number"
            min={1}
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            />

          <button onClick={() => loadFacilities(location, radius)}>
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {facilities.map((facility, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={() => setCenter([facility.lat, facility.lng])}
          >
            <h3>{facility.name}</h3>
            {facility.street && <p>{facility.street}</p>}
            {facility.phone && <p>{facility.phone}</p>}
          </div>
        ))}
      </div>

      {/* MAP */}
      <div className="resources__map">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={center} zoom={12} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {facilities.map((facility, i) => (
            <Marker key={i} position={[facility.lat, facility.lng]}>
              <Popup>
                <b>{facility.name}</b>
                <br />
                {facility.street}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div cla>

      </div>
    </div>
  );
}

export default Resources;