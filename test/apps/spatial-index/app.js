/* global document */
/* eslint-disable no-console */
import React, {useState} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {BASEMAP} from '@deck.gl/carto';
import DeckGL from '@deck.gl/react';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {QuadkeyLayer} from '@deck.gl/geo-layers';
import H3TileLayer from './H3TileLayer';
import QuadkeyTileLayer from './QuadkeyTileLayer';
import Checkbox from './Checkbox';
import ObjectSelect from './ObjectSelect';
import Querybox from './Querybox';

const INITIAL_VIEW_STATE = {longitude: 7, latitude: 45.8039, zoom: 5.2, pitch: 30, bearing: 0};

const transitions = {getElevation: {type: 'spring', stiffness: 0.005, damping: 0.075}};

const RESOLUTIONS = [3, 4, 5, 6, 7, 8];

function Root() {
  const [extruded, setExtruded] = useState(false);
  const [h3, setH3] = useState(false);
  const [aggregationExp, setAggregationExp] = useState('avg(population) as value');
  const [resolution, setResolution] = useState(4);
  const props = {aggregationExp, aggregationResLevel: resolution, extruded, transitions};
  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[h3 ? createH3TileLayer(props) : createQuadkeyTileLayer(props)]}
      >
        <StaticMap mapStyle={BASEMAP.VOYAGER_NOLABELS} />
      </DeckGL>
      <Checkbox label="Extruded" value={extruded} onChange={() => setExtruded(!extruded)} />
      <Checkbox label="H3/Quadkey" value={h3} onChange={() => setH3(!h3)} />
      <Querybox label="Execute" value={aggregationExp} onChange={e => setAggregationExp(e)} />
      <ObjectSelect
        title="resolution"
        obj={RESOLUTIONS}
        value={resolution}
        onSelect={setResolution}
      />
    </>
  );
}

const accessToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InlscXg0SVg3ek1oaUR1OFplSUlFSyJ9.eyJodHRwOi8vYXBwLmNhcnRvLmNvbS9lbWFpbCI6ImZwYWxtZXIrMjAwNDIwMjJAY2FydG9kYi5jb20iLCJodHRwOi8vYXBwLmNhcnRvLmNvbS9hY2NvdW50X2lkIjoiYWNfdGk2ZHNzc28iLCJpc3MiOiJodHRwczovL2F1dGguZGV2LmNhcnRvLmNvbS8iLCJzdWIiOiJhdXRoMHw2MjYwMmM5ZDQzNjdhMDAwNmIwNjEyNjAiLCJhdWQiOlsiY2FydG8tY2xvdWQtbmF0aXZlLWFwaSIsImh0dHBzOi8vY2FydG8tZGVkaWNhdGVkLWVudi51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjUwNDcwMTgwLCJleHAiOjE2NTA1NTY1ODAsImF6cCI6IkczcTdsMlVvTXpSWDhvc2htQXVzZWQwcGdRVldySkdQIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyIHJlYWQ6Y29ubmVjdGlvbnMgd3JpdGU6Y29ubmVjdGlvbnMgcmVhZDptYXBzIHdyaXRlOm1hcHMgcmVhZDphY2NvdW50IGFkbWluOmFjY291bnQiLCJwZXJtaXNzaW9ucyI6WyJhZG1pbjphY2NvdW50IiwicmVhZDphY2NvdW50IiwicmVhZDphcHBzIiwicmVhZDpjb25uZWN0aW9ucyIsInJlYWQ6Y3VycmVudF91c2VyIiwicmVhZDppbXBvcnRzIiwicmVhZDpsaXN0ZWRfYXBwcyIsInJlYWQ6bWFwcyIsInJlYWQ6dGlsZXNldHMiLCJyZWFkOnRva2VucyIsInVwZGF0ZTpjdXJyZW50X3VzZXIiLCJ3cml0ZTphcHBzIiwid3JpdGU6Y29ubmVjdGlvbnMiLCJ3cml0ZTppbXBvcnRzIiwid3JpdGU6bGlzdGVkX2FwcHMiLCJ3cml0ZTptYXBzIiwid3JpdGU6dG9rZW5zIl19.U8_a37XdJdRSkqs8ZTpup_bqMKZrKmGG-0qiFTepVYlVAu0898g0CukA1J4PKjz13c5Ad47KkfxB6e0cnwc0gM0emO0w-26yxWUAKJMsCPSDMNj6fYUaBIpehLgJuyy7ZoUThIRTdlaAjOVPahPeNURSSzaP894T0LFlu1X83JqISUHb9ceHxCBfi_FSuniAXZxdUGO-VyTbe8lTClOFjesKv2qPW72ZIOqb5ysjW-1ypvlyMeO7M4aTx9CqardsqQtlS5ER2AoP4fzXBA0vKZ7lppJ5Yg-_NAMBy8P1XmI1UxmMU6AlxMtfNS7z_qQitNXLAIF4GDifVJsah7jhMg';

function createQuadkeyTileLayer(props) {
  const {aggregationExp, aggregationResLevel, extruded, transitions} = props;
  return new QuadkeyTileLayer({
    data: `https://gcp-us-east1-16.dev.api.carto.com/v3/maps/cartobq/table/{i}?name=cartobq.testtables.derived_spatialfeatures_che_quadgrid15_v1_yearly_v2&geo_column=quadkey:geoid&aggregationExp=${aggregationExp}&aggregationResLevel=${aggregationResLevel}&maxResolution=15&access_token=${accessToken}`,
    minZoom: 1,
    maxZoom: 10,
    tileSize: 1024,
    elevationScale: 100,

    renderSubLayers: props => {
      return new QuadkeyLayer(props, {
        _offset: props.tile.z,
        extruded: true,
        getQuadkey: d => d.id,
        getFillColor: d => [Math.pow(d.properties.value / 200, 0.1) * 255, d.properties.value, 79],
        getElevation: d =>
          extruded
            ? 'elevation' in d.properties
              ? d.properties.elevation
              : d.properties.value
            : 0,
        transitions,
        updateTriggers: {
          getElevation: [extruded]
        }
      });
    },
    updateTriggers: {
      renderSubLayers: [extruded]
    }
  });
}

function createH3TileLayer(props) {
  const {extruded, transitions} = props;
  return new H3TileLayer({
    data: 'data/{i}.json',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    extent: [-112.5, 21.943045533438177, -90, 40.97989806962013],
    renderSubLayers: props => {
      const {data} = props;
      const {index} = props.tile;
      if (!data || !data.length) return null;

      return [
        new H3HexagonLayer(props, {
          centerHexagon: index,
          highPrecision: true,

          // Temp: 15-24
          getHexagon: d => d.spatial_index,
          getFillColor: d => [(d.temp - 14) * 28, 90 - d.temp * 3, (25 - d.temp) * 16],
          getElevation: d => (extruded ? d.temp - 14 : 0),
          elevationScale: 50000,
          transitions,
          updateTriggers: {
            getElevation: [extruded]
          }
        })
      ];
    },
    updateTriggers: {
      renderSubLayers: [extruded]
    }
  });
}

render(<Root />, document.body.appendChild(document.createElement('div')));
