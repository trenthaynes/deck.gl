export default {
  bigquery: {
    points_10k: `select * from carto-dev-data.public.points_10k`,
    points_1m: `select * from carto-dev-data.public.points_1m`,
    points_5m: `select * from carto-dev-data.public.points_5m`,
    points_10m: `select * from carto-dev-data.public.points_10m`,
    censustract: `select * from carto-dev-data.public.geography_usa_censustract_2019`,
    county: 'select * carto-dev-data.public.geography_usa_county_2019',
    blockgroup: `select * from carto-dev-data.public.geography_usa_blockgroup_2019`,
    zipcodes: `select * from carto-dev-data.public.geography_usa_zcta5_2019`,
    block: 'select * from carto-dev-data.public.geography_usa_block_2019'
  },
  snowflake: {
    points_10k: `select * from carto_dev_data.public.points_10k`,
    points_1m: `select * from carto_dev_data.public.points_1m`,
    points_5m: `select * from carto_dev_data.public.points_5m`,
    points_10m: `select * from carto_dev_data.public.points_10m`,
    censustract: `select * from carto_dev_data.public.geography_usa_censustract_2019`,
    county: 'select * from carto_dev_data.public.geography_usa_county_2019',
    blockgroup: `select * from carto_dev_data.public.geography_usa_blockgroup_2019`,
    zipcodes: `select * from carto_dev_data.public.geography_usa_zcta5_2019`,
    block: 'select * from carto_dev_data.public.geography_usa_block_2019'
  },
  redshift: {
    points_10k: `select * from public.points_10k`,
    points_1m: `select * from public.points_1m`,
    points_5m: `select * from public.points_5m`,
    points_10m: `select * from public.points_10m`,
    censustract: `select * from public.geography_usa_censustract_2019`,
    county: 'select * from public.geography_usa_county_2019',
    blockgroup: `select * from public.geography_usa_blockgroup_2019`,
    zipcodes: `select * from public.geography_usa_zcta5_2019`,
    block: 'select * from public.geography_usa_block_2019'
  },
  postgres: {
    points_10k: `select * from public.points_10k`,
    points_1m: `select * from public.points_1m`,
    points_5m: `select * from public.points_5m`,
    points_10m: `select * from public.points_10m`,
    censustract: `select * from public.geography_usa_censustract_2019`,
    county: 'select * from public.geography_usa_county_2019',
    blockgroup: `select * from public.geography_usa_blockgroup_2019`,
    zipcodes: `select * from public.geography_usa_zcta5_2019`,
    block: 'select * from public.geography_usa_block_2019'
  }
};
