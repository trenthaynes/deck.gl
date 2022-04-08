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

const INITIAL_VIEW_STATE = {longitude: -100, latitude: 30.8039, zoom: 5.2, pitch: 30, bearing: 130};

const transitions = {getElevation: {type: 'spring', stiffness: 0.005, damping: 0.075}};

function Root() {
  const [extruded, setExtruded] = useState(false);
  const [h3, setH3] = useState(false);
  const props = {extruded, transitions};
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
    </>
  );
}

function createQuadkeyTileLayer(props) {
  const {extruded, transitions} = props;
  return new QuadkeyTileLayer({
    // Restrict so we only load tiles that we have
    data: 'data/{i}.json',
    minZoom: 4,
    maxZoom: 5,
    tileSize: 1024,
    extent: [-112.5, 21.943045533438177, -90, 40.97989806962013],
    elevationScale: 50000,

    renderSubLayers: props => {
      return new QuadkeyLayer(props, {
        extruded: true,
        getQuadkey: d => d.spatial_index,
        getFillColor: d => [(d.value - 12) * 25, d.value * 8, 79],
        getElevation: d => (extruded ? d.value - 12 : 0),
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
