import {QuadkeyLayer, TileLayer} from '@deck.gl/geo-layers';

const defaultProps = {
  renderSubLayers: {type: 'function', value: props => new QuadkeyLayer(props), compare: false}
};

export default class QuadkeyTileLayer extends TileLayer {
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
