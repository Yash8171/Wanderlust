mapboxgl.accessToken = mapToken;

// Define light and dark map styles
const lightMapStyle = "mapbox://styles/mapbox/streets-v12";
const darkMapStyle = "mapbox://styles/mapbox/dark-v11";

// Get saved theme from localStorage
const savedMode = localStorage.getItem("darkMode");
const selectedStyle = savedMode === "enabled" ? darkMapStyle : lightMapStyle;

// Create the map with the correct theme
const map = new mapboxgl.Map({
    container: 'map',
    style: selectedStyle,
    center: listing.geometry.coordinates,
    zoom: 9
});

// Add a marker
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h4>${listing.title}</h4>
            <p>Exact Location will be provided after booking !</p>
        `)
    )
    .addTo(map);
