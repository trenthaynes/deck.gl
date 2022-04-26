export default {
  bigquery: {
    points_1m: `select * from carto-dev-data.public.points_1m`,
    points_5m: `select * from carto-dev-data.public.points_5m`,
    censustract: `select * from carto-dev-data.public.geography_usa_censustract_2019`,
    blockgroup: `select * from carto-dev-data.public.geography_usa_blockgroup_2019`,
    zipcodes: `select * from carto-dev-data.public.geography_usa_zcta5_2019`
  }
};
