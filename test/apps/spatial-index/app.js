/* global document */
/* eslint-disable no-console */
import React, {useState} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {QuadkeyLayer} from '@deck.gl/geo-layers';

const INITIAL_VIEW_STATE = {longitude: -100, latitude: 30.8039, zoom: 5, pitch: 30, bearing: 330};
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

function Root() {
  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[createBasemap(), ...createQuadkeyLayers()]}
      />
    </>
  );
}

function createBasemap() {
  return new GeoJsonLayer({
    id: 'base-map',
    data: COUNTRIES,
    // Styles
    stroked: true,
    filled: true,
    lineWidthMinPixels: 2,
    opacity: 0.4,
    getLineColor: [60, 60, 60],
    getFillColor: [200, 200, 200]
  });
}

function createQuadkeyLayers() {
  return [0, 1, 2, 3].map(
    n =>
      new QuadkeyLayer({
        id: `quadkey-${n}`,
        data: `data/0231${n}.json`,
        getQuadkey: d => d.spatial_index,

        // Styling
        getFillColor: d => [(d.value - 12) * 25, d.value * 8, 79],
        getElevation: d => d.value - 12,
        extruded: true,

        elevationScale: 10000
      })
  );
}
function createSpatialTileLayer() {
  return new QuadkeyLayer({
    id: 'carto',
    data: 'data/0231.json',
    getQuadkey: d => d.spatial_index,

    // Styling
    getFillColor: d => [(d.value - 12) * 25, d.value * 8, 79],
    getElevation: d => d.value - 12,
    extruded: true,

    elevationScale: 10000
  });
}

function ObjectSelect({title, obj, value, onSelect}) {
  const keys = Object.values(obj).sort();
  return (
    <>
      <select
        onChange={e => onSelect(e.target.value)}
        style={{position: 'relative', padding: 4, margin: 2, width: 200}}
        value={value}
      >
        <option hidden>{title}</option>
        {keys.map(f => (
          <option key={f} value={f}>
            {`${title}: ${f}`}
          </option>
        ))}
      </select>
      <br></br>
    </>
  );
}

render(<Root />, document.body.appendChild(document.createElement('div')));
