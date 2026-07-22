function fitBounds (coordinates, margin = 0) {


  function calculateBounds (points) {
    let latMin = points[0][1], latMax = points[0][1];
    let lngMin = points[0][0], lngMax = points[0][0];

    points.forEach(point => {
      const [lng, lat] = point;  // 解构数组，lng 是经度，lat 是纬度
      if (lat < latMin) latMin = lat;
      if (lat > latMax) latMax = lat;
      if (lng < lngMin) lngMin = lng;
      if (lng > lngMax) lngMax = lng;
    });

    return {
      latMin,
      latMax,
      lngMin,
      lngMax
    };
  }

  const bounds = calculateBounds(coordinates);

  const latMargin = (bounds.latMax - bounds.latMin) * margin;
  const lngMargin = (bounds.lngMax - bounds.lngMin) * margin;

  const sw = new minemap.LngLat(
    bounds.lngMin - lngMargin,
    bounds.latMin - latMargin
  );

  const ne = new minemap.LngLat(
    bounds.lngMax + lngMargin,
    bounds.latMax + latMargin
  );

  const LngLatBounds = new minemap.LngLatBounds(sw, ne);
  map.fitBounds(LngLatBounds);
}


function reSetCenter (center) {


  map.setCenter(new minemap.LngLat(center[0], center[1]));
}


