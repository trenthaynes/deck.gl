import {_flatten as flatten} from '@deck.gl/core';
import {H3HexagonLayer, TileLayer} from '@deck.gl/geo-layers';
import H3Tileset2D from './h3-tileset-2d';
import BBoxTileLayer from './BBoxTileLayer';

const h3Available = [
  '8148bf',
  '82488f',
  '82489f',
  '8248af',
  '824887',
  '824897',
  '8248a7',
  '8248b7'
].map(q => `${q}fffffffff`);

const defaultProps = {};

export default class H3TileLayer extends TileLayer {
  // Duplicate implementation from TileLayer so we can change Tileset2D
  updateState({props, changeFlags}) {
    let {tileset} = this.state;
    if (!tileset) {
      tileset = new H3Tileset2D(this._getTilesetOptions(props));
      this.setState({tileset});
    }

    super.updateState({props, changeFlags});
  }

  getTileData(tile) {
    const {data, fetch} = this.props;
    const {index, signal} = tile;
    tile.url = data.replace(/\{i\}/g, index);

    // HACK skip tiles without data
    if (!h3Available.includes(index)) return [];

    if (tile.url) {
      return fetch(tile.url, {propName: 'data', layer: this, signal});
    }
    return null;
  }

  renderLayers() {
    return this.state.tileset.tiles.map(tile => {
      const outline = new H3HexagonLayer({
        ...this.props,
        id: `${this.id}-${tile.index}-outline`,
        tile,

        data: [tile.index],
        getHexagon: d => d,
        highPrecision: true,
        centerHexagon: tile.index,

        // Style
        extruded: false,
        filled: false,
        stroked: true,
        getLineWidth: 1,
        lineWidthUnits: 'pixels'
      });
      const viz = this.renderSubLayers({
        ...this.props,
        id: `${this.id}-${tile.index}`,
        data: tile.content,
        tile
      });

      // const bbox = BBoxTileLayer(tile);

      return flatten([outline, viz], Boolean);
    });
  }
}
H3TileLayer.layerName = 'H3TileLayer';
H3TileLayer.defaultProps = defaultProps;
