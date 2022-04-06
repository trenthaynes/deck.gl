/* global document */
/* eslint-disable no-console */
import React, {useState} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {BitmapLayer, GeoJsonLayer, PathLayer} from '@deck.gl/layers';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import H3TileLayer from './H3TileLayer';
import QuadkeyTileLayer from './QuadkeyTileLayer';

const INITIAL_VIEW_STATE = {longitude: -100, latitude: 30.8039, zoom: 5.8, pitch: 30, bearing: 130};
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

function Root() {
  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[createBasemap(), /*createQuadkeyTileLayer(),*/ createH3TileLayer()]}
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

function createQuadkeyTileLayer() {
  return new QuadkeyTileLayer({
    // Restrict so we only load tiles that we have
    data: 'data/{i}.json',
    minZoom: 4,
    maxZoom: 5,
    extent: [-112.5, 21.943045533438177, -90, 40.97989806962013],
    getQuadkey: d => d.spatial_index,
    getFillColor: d => [(d.value - 12) * 25, d.value * 8, 79],
    getElevation: d => d.value - 12,
    extruded: true,
    elevationScale: 50000
  });
}

const h3Available = [
  '8148bf',
  '82488f',
  '82489f',
  '8248af',
  '824887',
  '824897',
  '8248a7',
  '8248b7'
].map(q => `${q}fffffffff`);

function createH3TileLayer() {
  return new H3TileLayer({
    data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    extent: [-112.5, 21.943045533438177, -90, 40.97989806962013],
    renderSubLayers: props => {
      const {index} = props.tile;
      if (!h3Available.includes(index)) return null;

      return [
        new H3HexagonLayer(props, {
          data: `data/${index}.json`,
          centerHexagon: index,
          highPrecision: true,

          // Temp: 15-24
          getHexagon: d => d.spatial_index,
          getFillColor: d => [(d.temp - 14) * 28, 90 - d.temp * 3, (25 - d.temp) * 16],
          getElevation: d => d.temp - 14,
          extruded: true,
          elevationScale: 50000
        })
      ];
    }
  });
}

render(<Root />, document.body.appendChild(document.createElement('div')));
