/* global document */
/* eslint-disable no-console */
import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {BASEMAP, MAP_TYPES, fetchLayerData, colorBins} from '@deck.gl/carto';
import DeckGL from '@deck.gl/react';
import {QuadkeyLayer} from '@deck.gl/geo-layers';
import BBoxTileLayer from './BBoxTileLayer.js';
import QuadkeyTileLayer from './QuadkeyTileLayer';
import DatePicker from './DatePicker';
import originalMoment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(originalMoment);

const apiBaseUrl = 'https://gcp-us-east1-19.dev.api.carto.com'
const accessToken =
  '<ACCESS_TOKEN>';

const INITIAL_VIEW_STATE = {longitude: -96, latitude: 37.8039, zoom: 4, pitch: 0, bearing: 0};

const transitions = {getElevation: {type: 'spring', stiffness: 0.005, damping: 0.075}};


function Root() {
  const [tilesUrl, setTilesUrl] = useState('');
  const aggregationExp = '1 as value'
  const connection = 'bqconn';
  const resolution = 6;
  const [source, setSource] = useState('carto-dev-data.private.financial_geographicinsights_usa_quadgrid18_v1_daily_v1');
  const [maxResolution, setMaxResolution] = useState(null)
  const props = {aggregationExp, aggregationResLevel: resolution, transitions, tilesUrl, maxResolution};
  const [zoom, setZoom] = useState(INITIAL_VIEW_STATE.zoom)
  const [dateRange, setDateRange] = useState(moment.range(moment().startOf('year'), moment()))
  const [timeserie, setTimeserie] = useState({})
  const [selectedSteps, setSelectedSteps] = useState([])
  console.log(selectedSteps)

  const handleSelectStep = (steps) => {
    const indices = steps.map(step => timeserie.steps.findIndex(s => s === step))
    setSelectedSteps(indices)
  }

  useEffect(() => {
    async function getTilesUrl() {
      const geoColumn = source.endsWith('_quadkey') ? 'quadkey' : 'quadint';
      const {data, timeserie} = await fetchLayerData({
        type: MAP_TYPES.TABLE,
        connection,
        source,
        geoColumn,
        timeRangeFrom: dateRange.start.format('YYYY-MM-DD'),
        timeRangeTo: dateRange.end.format('YYYY-MM-DD'),
        aggregationExp,
        aggregationResLevel: resolution,
        format: 'tilejson',
        credentials: { apiBaseUrl, accessToken }
      })
      setMaxResolution(data.maxresolution)
      setTilesUrl(data.tiles[0])
      setTimeserie(timeserie)
      setSelectedSteps(timeserie.steps.map((_, i) => i))
    }
    getTilesUrl()

  }, [aggregationExp, resolution, connection, source, dateRange])

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[createQuadkeyTileLayer(props, selectedSteps)]}
        getTooltip={({ object }) => {
          if (!object) return;
          let html = `<strong>ID</strong>: ${object.id}<br/>`
          for (let p in object.properties) {
            html += `<strong>${p}</strong>: ${object.properties[p]}<br/>`
          }
          return {html};
        }}
        onViewStateChange={({viewState}) => {
          setZoom(Math.floor(viewState.zoom))
        }}
      >
        <StaticMap mapStyle={BASEMAP.VOYAGER_NOLABELS} />
      </DeckGL>
      <DatePicker
        value={dateRange}
        onChange={setDateRange}
        onSelectStep={handleSelectStep}
        steps={timeserie.steps}
        granularity={timeserie.granularity}
        />
    </>
  );
}


function createQuadkeyTileLayer(props, selectedStepsIndices) {
  const {aggregationResLevel, extruded, outline, transitions, tilesUrl, maxResolution} = props;

  if (!tilesUrl) return;

  return new QuadkeyTileLayer({
    data: tilesUrl,
    minZoom: 1,
    maxZoom: maxResolution - aggregationResLevel,
    tileSize: 512,
    elevationScale: 100,
    renderSubLayers: props => {
      return [
        new QuadkeyLayer(props, {
          _offset: props.tile.z,
          opacity: 0.7,
          pickable: true,
          getQuadkey: d => d.id,
          getFillColor: colorBins({
            attr: 'txnAmountAvg',
            domain: [0, 5, 10, 15, 40, 60],
            colors: 'Teal',
            attributeParseFunction: (value) => {
              const total = value.reduce((total, d, index) => {
                if (!selectedStepsIndices.includes(index)) return total
                return total + d 
              }, 0)

              return total/value.length
            }
          }),
          transitions,
        }),
        outline && BBoxTileLayer(props.tile)
      ];
    },
    updateTriggers: {
      getFillColor: selectedStepsIndices
    }
  });
}


render(<Root />, document.body.appendChild(document.createElement('div')));
