mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v11", // style URL
    center: park.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl());

  new mapboxgl.Marker()
    .setLngLat(park.geometry.coordinates)
    .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h5>${park.title}</h5><p>${park.location}</p>`)
  )
  .addTo(map)