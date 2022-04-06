/* global document */
/* eslint-disable no-console */
import React, {useState} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {BitmapLayer, GeoJsonLayer, PathLayer} from '@deck.gl/layers';
import H3TileLayer from './H3TileLayer';
import QuadkeyTileLayer from './QuadkeyTileLayer';

const INITIAL_VIEW_STATE = {longitude: -100, latitude: 30.8039, zoom: 5, pitch: 30, bearing: 330};
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

function Root() {
  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[createBasemap(), createQuadkeyTileLayer(), createH3TileLayer()]}
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

    // Styling
    getFillColor: d => [(d.value - 12) * 25, d.value * 8, 79],
    getElevation: d => d.value - 12,
    extruded: true,
    elevationScale: 50000
  });
}

function createH3TileLayer() {
  return new H3TileLayer({
    data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    extent: [-112.5, 21.943045533438177, -90, 40.97989806962013],
    renderSubLayers: props => {
      const {
        bbox: {west, south, east, north}
      } = props.tile;

      return [
        new PathLayer(props, {
          data: [0],
          pickable: true,
          widthScale: 20,
          widthMinPixels: 2,
          getPath: d => [
            [east, north],
            [east, south],
            [west, south],
            [west, north],
            [east, north]
          ],
          getColor: [255, 0, 0],
          getWidth: d => 5
        })
      ];
    }
  });
}

render(<Root />, document.body.appendChild(document.createElement('div')));
