Leaflet.Terminator
==================

Overlay civil, nautical, and astronomical twilight terminators on a
Leaflet Earth map.

Demo: http://joergdietrich.github.io/Leaflet.Terminator/

Leaflet.Terminator registers `L.terminator()` in Leaflet. Adding the
terminator to a Leaflet map is as easy as:

```html
<script src="https://unpkg.com/leaflet"></script>
<script src="https://unpkg.com/@joergdietrich/leaflet.terminator"></script>
```
```js
var map = L.map('map').addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
L.terminator().addTo(map)
```

Or with npm:

```js
import L from 'leaflet';
import terminator from '@joergdietrich/leaflet.terminator';

var map = L.map('map').addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'))
terminator().addTo(map);
```


`L.terminator()` returns a Leaflet `LayerGroup` containing three filled
terminator areas:

* `civil` - Sun 6° below the horizon
* `nautical` - Sun 12° below the horizon
* `astronomical` - Sun 18° below the horizon

They are drawn as progressively darker gray fills by default. Use
`getTerminator(name)` to access and style one filled area directly.
Path style options passed to `L.terminator()` apply to all three areas,
so existing code such as `L.terminator({fillOpacity: 0.2})` works.

In addition to all Path options, Leaflet.Terminator understands these
options:

* `resolution` - points per degree used for the terminator boundary.
  The step size is 1°/resolution. Invalid or non-positive values fall
  back to 2. Values above 10 are clamped to 10.
* `longitudeRange` - longitude span in degrees. The default is 720,
  covering the Earth twice for world panning. Invalid or non-positive
  values fall back to 720. Values above 1440 are clamped to 1440.
* `time` - reference time for the calculation. The value can be
  anything accepted by the `Date()` constructor. If omitted, the current
  time is used.
* `terminators` - custom filled areas. Each entry can set `name`,
  `solarDepression`, and any Leaflet Path style option.

`solarDepression` is clamped to the range 0..90 degrees.

Leaflet.Terminator computes the terminator from longitudes -360° to +360°
(a range of 720°), covering the Earth twice. To limit the terminator
longitude range, the `longitudeRange` option is available.

```js
var sunlightOverlay = L.terminator({resolution: 5, longitudeRange: 360});
```

You can customize the shown twilight areas with the `terminators`
option:

```js
var twilightOverlay = L.terminator({
	terminators: [
		{name: 'civil', solarDepression: 6, fillColor: '#9a9a9a'},
		{name: 'nautical', solarDepression: 12, fillColor: '#777'},
		{name: 'astronomical', solarDepression: 18, fillColor: '#555'}
	]
});
```

You can pass the `time` option in the constructor or use the `setTime()`
method to control the reference time and date for the terminator; the
value can be anything accepted by the `Date()` constructor. By default,
the current time will be used.

In the same way, you can use the `setTime()` method without an argument
to refresh the terminator to the current time. This can be done
automatically, for example using a timer:

```js
var map = L.map('map').addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
var terminator = L.terminator({fillOpacity: 0.2}).addTo(map);
setInterval(function() {
	terminator.setTime();
	terminator.redraw(); // Optional; provided for compatibility with Leaflet path-like usage.
}, 60000); // Every minute

```

If you don't like background timers running even when the page is
inactive, you can also set the terminator to be refreshed only when the
user interacts with the map:

```js
var map = L.map('map').addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
var terminator = L.terminator().addTo(map);
map.addEventListener('zoomstart movestart popupopen', function(e) {
	terminator.setTime();
});
```

You can customize and complete this code by listing
additional map interaction events, described in the Leaflet
[documentation](https://leafletjs.com/reference.html#map-event).

Local build
-----------

For local development, install dependencies and build the browser bundle:

```sh
npm install
npm run build
```

This generates `L.Terminator.js` from `index.js`. The generated file is
a local build artifact and is ignored by Git in this repository.

To use the plugin in another static web page, copy only
`L.Terminator.js` and load it after Leaflet:

```html
<link rel="stylesheet" href="./leaflet.css">
<script src="./leaflet.js"></script>
<script src="./L.Terminator.js"></script>
```

`L.Terminator.js` does not include Leaflet; it expects Leaflet to be
available as the global `L`.
