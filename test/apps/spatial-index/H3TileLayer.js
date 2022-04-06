import H3Tileset2D from './h3-tileset-2d';
import {TileLayer} from '@deck.gl/geo-layers';

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
}
H3TileLayer.layerName = 'H3TileLayer';
H3TileLayer.defaultProps = defaultProps;
