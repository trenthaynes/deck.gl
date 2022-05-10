import {scaleThreshold} from 'd3-scale';
import getPalette, {Color, DEFAULT_PALETTE, NULL_COLOR} from './palette';
import {assert, AttributeSelector, getAttrValue} from './utils';

export default function colorBins({
  attr,
  domain,
  colors = DEFAULT_PALETTE,
  nullColor = NULL_COLOR,
  attributeParseFunction
}: {
  attr: AttributeSelector;
  domain: number[];
  colors?: string | Color[];
  nullColor?: Color;
  attributeParseFunction?: (value) => number
}): AttributeSelector {
  assert(Array.isArray(domain), 'Expected "domain" to be an array of numbers');

  const palette = typeof colors === 'string' ? getPalette(colors, domain.length + 1) : colors;

  const color = scaleThreshold<number, Color>().domain(domain).range(palette);

  return d => {
    let parsedValue
    const originalValue = getAttrValue(attr, d);
    if (attributeParseFunction) {
      parsedValue = attributeParseFunction(originalValue)
    }
    const value = typeof parsedValue === 'number' && Number.isFinite(parsedValue) ? parsedValue : originalValue
    return typeof value === 'number' && Number.isFinite(value) ? color(value) : nullColor;
  };
}
