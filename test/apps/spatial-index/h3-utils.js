import {polyfill, getRes0Indexes, h3ToGeoBoundary, h3ToParent} from 'h3-js';

// Number of hexagons at resolution 10 in tile x:497 y:505 z:10
// This tile is close to the equator and includes a pentagon 8a7400000007fff
// which makes it denser than other tiles
const HEX_COUNT_ZOOM_10_RES_10 = 166283;
// size multiplier when zoom increases by 1
const ZOOM_FACTOR = 1 / 4;
// size multiplier when resolution increases by 1
// h3.numHexagons(n + 1) / h3.numHexagons(n)
const RES_FACTOR = 7;

export function getHexagonsInBoundingBox({west, north, east, south}, resolution) {
  if (resolution === 0) {
    return getRes0Indexes();
  }
  if (east - west > 180) {
    // This is a known issue in h3-js: polyfill does not work correctly
    // when longitude span is larger than 180 degrees.
    return getHexagonsInBoundingBox({west, north, east: 0, south}, resolution).concat(
      getHexagonsInBoundingBox({west: 0, north, east, south}, resolution)
    );
  }

  // `polyfill()` fills based on hexagon center, which means tiles vanish
  // prematurely. Get more accurate coverage by oversampling
  const oversample = 1;
  const h3Indices = polyfill(
    [
      [
        [west, north],
        [west, south],
        [east, south],
        [east, north],
        [west, north]
      ]
    ],
    resolution + oversample,
    true
  );

  return oversample ? [...new Set(h3Indices.map(i => h3ToParent(i, resolution)))] : h3Indices;
}

export function tileToBoundingBox(index) {
  const coordinates = h3ToGeoBoundary(index);
  const latitudes = coordinates.map(c => c[0]);
  const longitudes = coordinates.map(c => c[1]);
  const west = Math.min(...longitudes);
  const south = Math.min(...latitudes);
  const east = Math.max(...longitudes);
  const north = Math.max(...latitudes);
  return {west, south, east, north};
}
