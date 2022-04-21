import {PathLayer} from '@deck.gl/layers';

export default function (tile) {
  const index = tile.index || `${tile.x}-${tile.y}-${tile.z}`;
  const {
    bbox: {west, south, east, north}
  } = tile;
  return new PathLayer({
    tile,
    id: `${index}-bbox`,
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
  });
}
