<!-- Google Maps API -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap" async defer></script>

<!-- Filter Buttons Section -->
<div class="btn-group d-flex justify-content-center my-3">
    <button class="btn btn-primary" onclick="filterMarkers('parks')">Parks</button>
    <button class="btn btn-primary" onclick="filterMarkers('restaurants')">Restaurants</button>
    <button class="btn btn-primary" onclick="filterMarkers('landmarks')">Landmarks</button>
    <button class="btn btn-primary" onclick="filterMarkers('museums')">Museums</button>
    <button class="btn btn-secondary" onclick="filterMarkers('all')">Show All</button>
</div>
