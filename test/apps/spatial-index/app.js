/* global document */
/* eslint-disable no-console */
import React, {useState} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {QuadkeyLayer, TileLayer} from '@deck.gl/geo-layers';

const INITIAL_VIEW_STATE = {longitude: -100, latitude: 30.8039, zoom: 5, pitch: 30, bearing: 330};
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

function Root() {
  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[createBasemap(), createSpatialTileLayer()]}
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

const defaultProps = {
  renderSubLayers: {type: 'function', value: props => new QuadkeyLayer(props), compare: false}
};
class QuadkeyTileLayer extends TileLayer {
  tileToQuadkey(tile) {
    let index = '';
    for (let z = tile.z; z > 0; z--) {
      let b = 0;
      const mask = 1 << (z - 1);
      if ((tile.x & mask) !== 0) b++;
      if ((tile.y & mask) !== 0) b += 2;
      index += b.toString();
    }
    return index;
  }

  getTileData(tile) {
    const {data, fetch} = this.props;
    const {signal} = tile;
    const quadkey = this.tileToQuadkey(tile);
    tile.url = data.replace(/\{i\}/g, quadkey);

    if (tile.url) {
      return fetch(tile.url, {propName: 'data', layer: this, signal});
    }
    return null;
  }
}
QuadkeyTileLayer.layerName = 'QuadkeyTileLayer';
QuadkeyTileLayer.defaultProps = defaultProps;

function createSpatialTileLayer() {
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
