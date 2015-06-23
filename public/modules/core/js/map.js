function initialize() {
    //load grayscale style
    var styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
            
    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

            
    var myLatlng = new google.maps.LatLng(43.6542904, -79.3854518);
    var mapOptions = {
        zoom: 16,
        center: myLatlng,
        mapTypeControlOptions: false,
        disableDefaultUI: true,
        scaleControl: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE 
        }
    };
            
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });
            
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
}

google.maps.event.addDomListener(window, 'load', initialize);
        