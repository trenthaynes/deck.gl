export default {
  bigquery: {
    points_10k: `select * from carto-dev-data.public.points_10k`,
    points_1m: `select * from carto-dev-data.public.points_1m`,
    points_5m: `select * from carto-dev-data.public.points_5m`,
    points_10m: `select * from carto-dev-data.public.points_10m`,
    censustract: `select * from carto-dev-data.public.geography_usa_censustract_2019`,
    censustract_demographics: `select g.*, d.total_pop from carto-dev-data.public.geography_usa_censustract_2019 g
                      left join carto-dev-data.public.demographics_sociodemographics_usa_censustract_2015_5yrs_20142018 d ON g.geoid=d.geoid`,
    county: 'select * carto-dev-data.public.geography_usa_county_2019',
    county_demographics: `select g.*, d.total_pop from carto-dev-data.public.geography_usa_county_2019 g
                        left join carto-dev-data.public.demographics_sociodemographics_usa_county_2015_yearly_2018 d ON g.geoid=d.geoid`,
    blockgroup: `select * from carto-dev-data.public.geography_usa_blockgroup_2019`,
    blockgroup_demographics: `select g.*, d.total_pop from carto-dev-data.public.geography_usa_blockgroup_2019 g
                      left join carto-dev-data.public.demographics_sociodemographics_usa_blockgroup_2019_yearly_2020 d ON g.geoid=d.geoid`,
    zipcodes: `select * from carto-dev-data.public.geography_usa_zcta5_2019`,
    zipcodes_demographics: `select g.*, d.total_pop from carto-dev-data.public.geography_usa_zcta5_2019 g
                      left join carto-dev-data.public.demographics_sociodemographics_usa_zcta5_2015_yearly_2017 d ON g.geoid=d.geoid`,
    block: 'select * from carto-dev-data.public.geography_usa_block_2019'
  },
  snowflake: {
    points_10k: `select * from carto_dev_data.public.points_10ka`,
    points_1m: `select * from carto_dev_data.public.points_1m`,
    points_5m: `select * from carto_dev_data.public.points_5m`,
    points_10m: `select * from carto_dev_data.public.points_10m`,
    censustract: `select * from carto_dev_data.public.geography_usa_censustract_2019`,
    censustract_demographics: `select g.*, d.total_pop from carto_dev_data.public.geography_usa_censustract_2019 g
                  left join carto_dev_data.public.demographics_sociodemographics_usa_censustract_2015_5yrs_20142018 d ON g.geoid=d.geoid`,
    county: 'select * from carto_dev_data.public.geography_usa_county_2019',
    county_demographics: `select g.*, d.total_pop from carto_dev_data.public.geography_usa_county_2019 g
                  left join carto_dev_data.public.demographics_sociodemographics_usa_county_2015_yearly_2018 d ON g.geoid=d.geoid`,
    blockgroup: `select * from carto_dev_data.public.geography_usa_blockgroup_2019`,
    blockgroup_demographics: `select g.*, d.total_pop from carto_dev_data.public.geography_usa_blockgroup_2019 g
                        left join carto_dev_data.public.demographics_sociodemographics_usa_blockgroup_2019_yearly_2020 d ON g.geoid=d.geoid`,
    zipcodes: `select * from carto_dev_data.public.geography_usa_zcta5_2019`,
    zipcodes_demographics: `select g.*, d.total_pop from carto_dev_data.public.geography_usa_zcta5_2019 g
               left join carto_dev_data.public.demographics_sociodemographics_usa_zcta5_2015_yearly_2017 d ON g.geoid=d.geoid`,
    block: 'select * from carto_dev_data.public.geography_usa_block_2019'
  },
  redshift: {
    points_10k: `select * from public.points_10k`,
    points_1m: `select * from public.points_1m`,
    points_5m: `select * from public.points_5m`,
    points_10m: `select * from public.points_10m`,
    censustract: `select * from public.geography_usa_censustract_2019`,
    censustract_demographics: `select g.*, d.total_pop from public.geography_usa_censustract_2019 g
          left join public.demographics_sociodemographics_usa_censustract_2015_5yrs_20142018 d ON g.geoid=d.geoid`,
    county: 'select * from public.geography_usa_county_2019',
    county_demographics: `select g.*, d.total_pop from public.geography_usa_county_2019 g
                  left join public.demographics_sociodemographics_usa_county_2015_yearly_2018 d ON g.geoid=d.geoid`,
    blockgroup: `select * from public.geography_usa_blockgroup_2019`,
    blockgroup_demographics: `select g.*, d.total_pop from public.geography_usa_blockgroup_2019 g
             inner join public.demographics_sociodemographics_usa_blockgroup_2019_yearly_2020 d ON g.geoid=d.geoid`,
    zipcodes: `select * from public.geography_usa_zcta5_2019`,
    zipcodes_demographics: `select g.*, d.total_pop from public.geography_usa_zcta5_2019 g
      left join public.demographics_sociodemographics_usa_zcta5_2015_yearly_2017 d ON g.geoid=d.geoid`,
    block: 'select * from public.geography_usa_block_2019'
  },
  postgres: {
    points_10k: `select * from public.points_10k`,
    points_1m: `select * from public.points_1m`,
    points_5m: `select * from public.points_5m`,
    points_10m: `select * from public.points_10m`,
    censustract: `select * from public.geography_usa_censustract_2019`,
    censustract_demographics: `select g.*, d.total_pop from public.geography_usa_censustract_2019 g
          left join public.demographics_sociodemographics_usa_censustract_2015_5yrs_20142018 d ON g.geoid=d.geoid`,
    county: 'select * from public.geography_usa_county_2019',
    county_demographics: `select g.*, d.total_pop from public.geography_usa_county_2019 g
                  left join public.demographics_sociodemographics_usa_county_2015_yearly_2018 d ON g.geoid=d.geoid`,
    blockgroup: `select * from public.geography_usa_blockgroup_2019`,
    blockgroup_demographics: `select g.*, d.total_pop from public.geography_usa_blockgroup_2019 g
             inner join public.demographics_sociodemographics_usa_blockgroup_2019_yearly_2020 d ON g.geoid=d.geoid`,
    zipcodes: `select * from public.geography_usa_zcta5_2019`,
    zipcodes_demographics: `select g.*, d.total_pop from public.geography_usa_zcta5_2019 g
      left join public.demographics_sociodemographics_usa_zcta5_2015_yearly_2017 d ON g.geoid=d.geoid`,
    block: 'select * from public.geography_usa_block_2019'
  },
};
