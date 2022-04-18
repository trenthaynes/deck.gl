export default {
  bigquery: {
    points_1M: `select * from \`cartodb-gcp-backend-data-team.dynamic_tiling.points_1M\``,
    points_5M: `select * from \`cartodb-gcp-backend-data-team.dynamic_tiling.points_5M\``,
    censustract: `select * from \`carto-do-public-data.carto.geography_usa_censustract_2019\``,
    blockgroup: 'select * from `carto-do-public-data.carto.geography_usa_blockgroup_2019`',
    zipcodes: 'select * from `carto-do-public-data.carto.geography_usa_zcta5_2019`'
  }
};
