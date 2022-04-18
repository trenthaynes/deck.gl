/* global document */
/* eslint-disable no-console */
import React, {useState} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {CartoLayer, FORMATS, TILE_FORMATS, MAP_TYPES} from '@deck.gl/carto';
import {GeoJsonLayer} from '@deck.gl/layers';
import tableConfig from './tableConfig';
import queryConfig from './queryConfig';

const INITIAL_VIEW_STATE = {longitude: -73.95643, latitude: 40.8039, zoom: 12};
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

// Skip CDN
const apiBaseUrl = 'https://direct-gcp-us-east1.api.carto.com';
// PROD US GCP
// const apiBaseUrl = 'https://gcp-us-east1.api.carto.com';
// Localhost
// const apiBaseUrl = 'http://localhost:8002'

const accessToken = 'XXX';

const showBasemap = true;
const showCarto = true;

function Root() {
  const [connection, setConnection] = useState('bigquery');
  const [table, setTable] = useState('points_1M');
  const [query, setQuery] = useState('censustract');

  const [type, setType] = useState(MAP_TYPES.TABLE);
  const [formatTiles, setFormatTiles] = useState(TILE_FORMATS.BINARY);
  const config = type === MAP_TYPES.TABLE ? tableConfig : queryConfig;
  const data = type === MAP_TYPES.TABLE ? config[connection][table] : config[connection][query];

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[
          showBasemap && createBasemap(),
          showCarto && createCarto({connection, type, data, formatTiles})
        ]}
      />
      <ObjectSelect
        title="type"
        obj={[MAP_TYPES.TABLE, MAP_TYPES.QUERY]}
        value={type}
        onSelect={setType}
      />
      <ObjectSelect
        title="formatTiles"
        obj={TILE_FORMATS}
        value={formatTiles}
        onSelect={setFormatTiles}
      />
      <ObjectSelect
        title="connection"
        obj={Object.keys(config)}
        value={connection}
        onSelect={setConnection}
      />
      {type === MAP_TYPES.TABLE && (
        <ObjectSelect
          title="table"
          obj={Object.keys(tableConfig[connection])}
          value={table}
          onSelect={setTable}
        />
      )}
      {type === MAP_TYPES.QUERY && (
        <ObjectSelect
          title="query"
          obj={Object.keys(queryConfig[connection])}
          value={query}
          onSelect={setQuery}
        />
      )}
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

function createCarto({connection, type, data, formatTiles}) {
  return new CartoLayer({
    id: 'carto',
    connection,
    type,
    data,
    credentials: {accessToken, apiBaseUrl},

    format: FORMATS.TILEJSON,
    formatTiles,

    // Styling
    getFillColor: [233, 71, 251],
    getElevation: 1000,
    // extruded: true,
    stroked: true,
    filled: true,
    pointType: 'circle',
    pointRadiusUnits: 'pixels',
    lineWidthMinPixels: 0.5,
    getPointRadius: 1.5,
    getLineColor: [0, 0, 200]
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
