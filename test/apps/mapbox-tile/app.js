/* global devicePixelRatio, document, fetch, performance */
/* eslint-disable no-console */
import {diff, addedDiff, deletedDiff, updatedDiff, detailedDiff} from 'deep-object-diff';
import React, {useState} from 'react';
import {render} from 'react-dom';
import {Tile} from './carto-tile';
import Protobuf from 'pbf';
import Checkbox from './Checkbox';
import DeckGL from '@deck.gl/react';
import {ClipExtension} from '@deck.gl/extensions';
import {MVTLayer, TileLayer} from '@deck.gl/geo-layers';
import {GeoJsonLayer, PathLayer, PointCloudLayer} from '@deck.gl/layers';
import {binaryToGeojson, geojsonToBinary} from '@loaders.gl/gis';

const INITIAL_VIEW_STATE = {longitude: -73.95643, latitude: 40.8039, zoom: 9};
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

const params = new URLSearchParams(location.search.slice(1));
const apiBaseUrl = 'https://gcp-us-east1-19.dev.api.carto.com';
const connection = params.get('connection') || 'bigquery';
// const table = params.get('table') || 'cartodb-gcp-backend-data-team.dynamic_tiling.lines_300K_viz';
const table =
  params.get('table') || 'cartodb-gcp-backend-data-team.dynamic_tiling.polygons_3k_usacounty';

// const formatTiles = params.get('formatTiles') || 'geojson'; // mvt | geojson | binary
const geomType = params.get('geomType') || 'polygons'; // points | lines | polygons
//const token =
//  'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfZmt0MXdsbCIsImp0aSI6IjNmM2NlMjA3In0.zzfm2xZSAjcTlLxaPQHDy8uVJbGtEC5gItOg8U_gfP4';
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InlscXg0SVg3ek1oaUR1OFplSUlFSyJ9.eyJodHRwOi8vYXBwLmNhcnRvLmNvbS9lbWFpbCI6ImZwYWxtZXIrY2hyb21lQGNhcnRvZGIuY29tIiwiaHR0cDovL2FwcC5jYXJ0by5jb20vYWNjb3VudF9pZCI6ImFjX2ZrdDF3bGwiLCJpc3MiOiJodHRwczovL2F1dGguZGV2LmNhcnRvLmNvbS8iLCJzdWIiOiJhdXRoMHw2MWEwZDgyMGJkMDA3OTAwNzExNDViYTciLCJhdWQiOlsiY2FydG8tY2xvdWQtbmF0aXZlLWFwaSIsImh0dHBzOi8vY2FydG8tZGVkaWNhdGVkLWVudi51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjM4MTc1NzI2LCJleHAiOjE2MzgyNjIxMjYsImF6cCI6IkczcTdsMlVvTXpSWDhvc2htQXVzZWQwcGdRVldySkdQIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyIHJlYWQ6Y29ubmVjdGlvbnMgd3JpdGU6Y29ubmVjdGlvbnMgcmVhZDptYXBzIHdyaXRlOm1hcHMgcmVhZDphY2NvdW50IiwicGVybWlzc2lvbnMiOlsicmVhZDphY2NvdW50IiwicmVhZDphcHBzIiwicmVhZDpjb25uZWN0aW9ucyIsInJlYWQ6Y3VycmVudF91c2VyIiwicmVhZDppbXBvcnRzIiwicmVhZDpsaXN0ZWRfYXBwcyIsInJlYWQ6bWFwcyIsInJlYWQ6dGlsZXNldHMiLCJyZWFkOnRva2VucyIsInVwZGF0ZTpjdXJyZW50X3VzZXIiLCJ3cml0ZTphcHBzIiwid3JpdGU6Y29ubmVjdGlvbnMiLCJ3cml0ZTppbXBvcnRzIiwid3JpdGU6bWFwcyIsIndyaXRlOnRva2VucyJdfQ.d3O5cxDlXh-8_lUns9K9tLvGpAU6xXp_ep6hcnlSuUkwoFV6WGfKU5iacYuRfyD2Twr5ajQbuQudu4rLKmPrXguONBYRzDKmA3k0BebqlT-UO-s6UyR_gy55_Bt4YW5oqZlOrJS63szyZu16AIVs4LU8K8VuZO5vjXI2bCy4VZuJV49JRJryCMvErLiDbFQFf0nmw-JKpun8hgBB8BTqVqD71GeEsqKIK7PzL7_hGSv78LtpaTK_t8AHa3-PfJxWxPRfVXcE3Aup0zXadjylSrZP-F--w748ULScoTwOJbohpQpsyustfRhdPgm6YxynB8Q3S--qYz02uuQ52D1Fyw';

function buildUrl({formatTiles}) {
  return `${apiBaseUrl}/v3/maps/${connection}/table/{z}/{x}/{y}?name=${table}&cache=&access_token=${token}&formatTiles=${formatTiles}&geomType=${geomType}`;
}

const showBasemap = true;
const showTile = false;
const showMVT = true;

function Root() {
  const [binary, setBinary] = useState(true);
  const [border, setBorder] = useState(true);
  const [clip, setClip] = useState(true);
  const [skipOdd, setSkipOdd] = useState(false);
  const opts = {binary, border, clip, skipOdd};

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[
          showBasemap && createBasemap(),
          showTile && createTile(opts),
          showMVT && createMVT(opts)
        ]}
      />
      <div style={{position: 'absolute', margin: 10}}>
        <Checkbox label="Binary" value={binary} onChange={() => setBinary(!binary)} />
        <Checkbox label="Border" value={border} onChange={() => setBorder(!border)} />
        <Checkbox label="Clip" value={clip} onChange={() => setClip(!clip)} />
        <Checkbox label="Skip Odd" value={skipOdd} onChange={() => setSkipOdd(!skipOdd)} />
      </div>
    </>
  );
}

// Fake out indices
function generateIndices(positions) {
  const n = positions.value.length / positions.size;
  const ids = new Uint16Array(n);
  for (let i = 0; i < n; i++) {
    ids[i] = i;
  }
  return {value: ids, size: 1};
}

function tileToBinary(tile) {
  // Convert to typed arrays
  tile.points.positions.value = new Float32Array(tile.points.positions.value);

  tile.lines.positions.value = new Float32Array(tile.lines.positions.value);
  tile.lines.pathIndices.value = new Uint16Array(tile.lines.pathIndices.value);
  tile.lines.globalFeatureIds = tile.lines.featureIds; // HACK to fix missing data from API

  tile.polygons.positions.value = new Float32Array(tile.polygons.positions.value);
  tile.polygons.polygonIndices.value = new Uint16Array(tile.polygons.polygonIndices.value);
  tile.polygons.primitivePolygonIndices = tile.polygons.polygonIndices; // HACK to fix missing data from API
  tile.polygons.globalFeatureIds = tile.polygons.featureIds; // HACK to fix missing data from API

  return {
    points: {type: 'Point', numericProps: {}, properties: [], type: 'Point', ...tile.points},
    lines: {type: 'LineString', numericProps: {}, properties: [], ...tile.lines},
    polygons: {type: 'Polygon', numericProps: {}, properties: [], ...tile.polygons}
  };
}

function createTile({binary, border, clip, skipOdd}) {
  // const formatTiles = binary ? 'binary' : 'geojson';
  return new TileLayer({
    data: buildUrl({formatTiles: 'binary'}),
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: devicePixelRatio === 1 ? -1 : 0,

    // Debug options
    binary,
    border,
    clip,
    skipOdd,

    getTileData: tile => {
      return Promise.all([
        fetch(tile.url)
          .then(response => {
            if (response.status === 204) {
              return null;
            }
            return response.arrayBuffer();
          })
          .then(parsePbf),
        fetch(tile.url.replace('binary', 'geojson')).then(response => {
          if (response.status === 204) {
            return null;
          }
          return response.json();
        })
      ]);
    },
    renderSubLayers: props => {
      if (props.data[0] === null || (props.skipOdd && (props.tile.x + props.tile.y) % 2)) {
        return null;
      }

      // Debug, draw tile outline
      const {
        bbox: {west, south, east, north}
      } = props.tile;

      // Convert data to binary
      const binaryData = tileToBinary(props.data[0]);
      const geojsonData = geojsonToBinary(props.data[1].features);
      const changes = detailedDiff(binaryData.polygons, geojsonData.polygons);

      const tileProps = {
        // Data
        id: `${props.id}-geojson`,
        data: props.binary ? binaryData : geojsonData,

        // Styling
        stroked: true,
        filled: true,
        pointType: 'circle',
        pointRadiusUnits: 'pixels',
        lineWidthMinPixels: 0.5,
        getPointRadius: 1.5,
        getLineColor: [0, 0, 200],
        getFillColor: [255, 50, 11]
      };

      // Clipping
      if (clip) {
        tileProps.extensions = [new ClipExtension()];
        tileProps.clipBounds = [west, south, east, north];
      }

      //const geojson = binaryToGeojson(binaryData);
      return [
        new GeoJsonLayer(tileProps),
        border &&
          new PathLayer({
            id: `${props.id}-border`,
            visible: true,
            data: [
              [
                [west, north],
                [west, south],
                [east, south],
                [east, north],
                [west, north]
              ]
            ],
            getPath: d => d,
            getColor: [255, 0, 0, 60],
            widthMinPixels: 1
          })
      ];
    }
  });
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

function createMVT({binary, border, clip, skipOdd}) {
  return new MVTLayer({
    id: 'mvt',
    data: buildUrl({formatTiles: 'mvt'}),
    getFillColor: [232, 171, 0]
  });
}

function parseJSON(response) {
  const value = response.json();
  return value;
}

function parsePbf(buffer) {
  if (buffer === null) {
    return null;
  }
  const pbf = new Protobuf(buffer);
  const tile = Tile.read(pbf);
  return tile;
}

render(<Root />, document.body.appendChild(document.createElement('div')));
