export default `\
#version 300 es

#define SHADER_NAME text-background-layer-fragment-shader

precision highp float;

uniform bool stroked;

in vec4 vFillColor;
in vec4 vLineColor;
in float vLineWidth;
in vec2 uv;
in vec2 dimensions;

out vec4 fragmentColor;
void main(void) {
  geometry.uv = uv;

  vec2 pixelPosition = uv * dimensions;
  if (stroked) {
    float distToEdge = min(
      min(pixelPosition.x, dimensions.x - pixelPosition.x),
      min(pixelPosition.y, dimensions.y - pixelPosition.y)
    );
    float isBorder = smoothedge(distToEdge, vLineWidth);
    fragmentColor = mix(vFillColor, vLineColor, isBorder);
  } else {
    fragmentColor = vFillColor;
  }

  DECKGL_FILTER_COLOR(fragmentColor, geometry);
}
`;
