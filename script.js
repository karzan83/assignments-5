let map;
let markers = [];
let userMarker = null;
let directionsService;
let directionsRenderer;

const locations = [
    { name: "Bayfront Park", lat: 43.2696, lng: -79.8771, category: "parks" },
    { name: "Gage Park", lat: 43.2388, lng: -79.8302, category: "parks" },
    { name: "The Mule Restaurant", lat: 43.2557, lng: -79.8705, category: "restaurants" },
    { name: "Earth to Table Bread Bar", lat: 43.2593, lng: -79.8747, category: "restaurants" },
    { name: "Dundurn Castle", lat: 43.2706, lng: -79.8861, category: "landmarks" },
    { name: "Canadian Warplane Heritage Museum", lat: 43.1601, lng: -79.9289, category: "museums" }
];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.2557, lng: -79.8711 },
        zoom: 12
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directionsPanel"));

    addMarkers(locations);
    populateDirectionsDropdowns();
}

function addMarkers(locationsArray) {
    // Remove existing markers before adding new ones
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    locationsArray.forEach(loc => {
        let marker = new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: map,
            title: loc.name,
            category: loc.category
        });

        let infowindow = new google.maps.InfoWindow({
            content: `<h6>${loc.name}</h6><p>Category: ${loc.category}</p>`
        });

        marker.addListener("click", function() {
            infowindow.open(map, marker);
        });

        markers.push(marker);
    });
}

// ✅ Fixed Filter Function
function filterMarkers(category) {
    if (category === "all") {
        addMarkers(locations); // Show all locations
    } else {
        const filteredLocations = locations.filter(loc => loc.category === category);
        addMarkers(filteredLocations);
    }
}

// ✅ Geolocation Function
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            if (userMarker) {
                userMarker.setMap(null);
            }

            userMarker = new google.maps.Marker({
                position: userPos,
                map: map,
                title: "You are here!",
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });

            map.setCenter(userPos);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// ✅ Populate Dropdowns for Directions
function populateDirectionsDropdowns() {
    const startSelect = document.getElementById("startLocation");
    const endSelect = document.getElementById("endLocation");

    locations.forEach(loc => {
        let option1 = new Option(loc.name, `${loc.lat},${loc.lng}`);
        let option2 = new Option(loc.name, `${loc.lat},${loc.lng}`);

        startSelect.add(option1);
        endSelect.add(option2);
    });
}

// ✅ Get Directions
document.getElementById("directionsForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const start = document.getElementById("startLocation").value;
    const end = document.getElementById("endLocation").value;

    if (!start || !end) {
        alert("Please select both a starting location and a destination.");
        return;
    }

    const [startLat, startLng] = start.split(",").map(Number);
    const [endLat, endLng] = end.split(",").map(Number);

    const request = {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: endLat, lng: endLng },
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert("Could not get directions. Please try again.");
        }
    });
});

// ✅ Add New Location
document.getElementById("addLocationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("locationName").value;
    const category = document.getElementById("locationCategory").value;
    const address = document.getElementById("locationAddress").value;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            const newLocation = {
                name,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
                category
            };

            locations.push(newLocation);
            addMarkers(locations);
            populateDirectionsDropdowns();

            document.getElementById("addLocationForm").reset();
        } else {
            alert("Error: Could not find location. Try a different address.");
        }
    });
});
