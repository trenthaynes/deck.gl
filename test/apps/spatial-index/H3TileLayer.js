import {_flatten as flatten} from '@deck.gl/core';
import {H3HexagonLayer, TileLayer} from '@deck.gl/geo-layers';
import H3Tileset2D from './h3-tileset-2d';

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

  renderLayers() {
    return this.state.tileset.h3Indices.map(h3Index => {
      const layer = new H3HexagonLayer({
        ...this.props,
        id: `${this.id}-${h3Index}`,
        // Hack to keep layer happy
        tile: {
          isVisible: true
        },

        data: [h3Index],
        getHexagon: d => d,
        highPrecision: true,
        centerHexagon: h3Index,

        // Style
        filled: false,
        wireframe: true
      });

      return layer;
    });
  }
}
H3TileLayer.layerName = 'H3TileLayer';
H3TileLayer.defaultProps = defaultProps;
