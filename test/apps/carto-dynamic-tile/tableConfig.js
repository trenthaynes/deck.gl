export default {
  bigquery: {
    points_1m: 'cartodb-gcp-backend-data-team.dynamic_tiling.points_1M',
    points_5m: 'cartodb-gcp-backend-data-team.dynamic_tiling.points_5M',
    censustract: 'carto-do-public-data.carto.geography_usa_censustract_2019',
    blockgroup: 'carto-do-public-data.carto.geography_usa_blockgroup_2019',
    zipcodes: 'carto-do-public-data.carto.geography_usa_zcta5_2019',
    h3: 'carto-do-public-data.carto.geography_usa_h3res8_v1',
    block: 'carto-do-public-data.carto.geography_usa_block_2019'
  },
  snowflake: {
    points_1m: 'carto_backend_data_team.dynamic_tiling.points_1M',
    points_5m: 'carto_backend_data_team.dynamic_tiling.points_5M',
    censustract: 'carto_backend_data_team.dynamic_tiling.usa_censustract_2019',
    blockgroup: 'carto_backend_data_team.dynamic_tiling.usa_blockgroup_2019',
    zipcodes: 'carto_backend_data_team.dynamic_tiling.usa_zcta5_2019',
    h3: 'carto_backend_data_team.dynamic_tiling.usa_h3res8_v1',
    block: 'carto_backend_data_team.dynamic_tiling.usa_block_2019'
  },
  redshift: {
    points_1m: 'carto_backend_data_team.dynamic_tiling.points_1m',
    points_5m: 'carto_backend_data_team.dynamic_tiling.points_5m',
    censustract: 'carto_backend_data_team.dynamic_tiling.usa_censustract_2019',
    blockgroup: 'carto_backend_data_team.dynamic_tiling.usa_blockgroup_2019',
    zipcodes: 'carto_backend_data_team.dynamic_tiling.usa_zcta5_2019',
    h3: 'carto_backend_data_team.dynamic_tiling.usa_h3res8_v1',
    block: 'carto_backend_data_team.dynamic_tiling.usa_block_2019'
  },
  postgres: {
    points_1m: 'demo.demo_tables.points_1m',
    points_5m: 'demo.demo_tables.points_5m',
    points_10m: 'demo.demo_tables.points_10m',
    censustract: 'demo.demo_tables.usa_censustract_2019',
    blockgroup: 'demo.demo_tables.usa_blockgroup_2019',
    zipcodes: 'demo.demo_tables.usa_zcta5_2019',
    county: 'demo.demo_tables.usa_county_2019',
    block: 'demo.demo_tables.usa_block_2019'
  }
};
