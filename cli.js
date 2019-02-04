const geotoolsFactory = require("./index");
const _ = require('lodash');

require('yargs')
  .command({
      command: 'getNames <dataStoreUrl>', 
      desc: 'Get the names of all entries or types provided by the datastore',
      builder: (yargs) => {
          yargs
          .positional('dataStoreUrl',{
              describe: 'The URL for the data store',
              type: 'string'
            }
          )
          .options({
              'c': {
                  alias: 'className',
                  //default: 'org.geotools.data.shapefile.ShapefileDataStoreFactory',
                  default: 'org.geotools.data.vpf.VPFDataStoreFactory',
                  describe: 'Concreate Java class name for the ContentDataStore instance',
                  type: 'string'
              },
              'd': {
                  alias: 'dataStoreTypeName',
                  //default: 'SHAPEFILE',
                  //default: 'VPF',
                  default: null,
                  describe: 'Type name of data store',
                  type: 'string'
              },
          })
      },
      handler: async (argv) => {
        const geotools = await geotoolsFactory.getInstance();
        
        const className = !_.isNil(argv.dataStoreTypeName) ? 
         geotools.getDataStoreClass(argv.dataStoreTypeName) : argv.className;
        const factory = geotools.createDataStoreFactoryFromClass(className);
        
        var libName = factory.getDisplayName();
        
        const params = geotools.fileToUrlParams(argv.dataStoreUrl);
        const store = factory.createDataStore(params);
        
        const names = store.getTypeNames();
        
        
        const json = {
            "dataStoreUrl": argv.dataStoreUrl,
            "className": className,
            "libraryType": libName,
            "names": names
        };
        
        console.log(JSON.stringify(json,null,2));
        
      } 
  })
  .command({
      command: 'getFeatures <dataStoreUrl> <typeName>', 
      desc: 'Get the features with typeName from the datastore',
      builder: (yargs) => {
          yargs
          .positional('dataStoreUrl',{
              describe: 'The URL for the data store',
              type: 'string'
            }
          )
          .options({
              'c': {
                  alias: 'className',
                  default: 'org.geotools.data.shapefile.ShapefileDataStoreFactory',
                  //default: 'org.geotools.data.vpf.VPFDataStoreFactory',
                  describe: 'Concreate Java class name for the ContentDataStore instance',
                  type: 'string'
              },
              'd': {
                  alias: 'dataStoreTypeName',
                  //default: 'SHAPEFILE',
                  //default: 'VPF',
                  default: null,
                  describe: 'Type name of data store',
                  type: 'string'
              },
          })
      },
      handler: async (argv) => {
        try {
            const geotools = await geotoolsFactory.getInstance();
            
            const className = !_.isNil(argv.dataStoreTypeName) ? 
             geotools.getDataStoreClass(argv.dataStoreTypeName) : argv.className;
            const factory = geotools.createDataStoreFactoryFromClass(className);
            
            var libName = factory.getDisplayName();
            
            const params = geotools.fileToUrlParams(argv.dataStoreUrl);
            const store = factory.createDataStore(params);
            
            const fs = store.getFeatureSource(argv.typeName);
            
            /*
            const featureType = fs.getSchema();
            const features = geotools.createListFeatureCollection(featureType);
            const rdr = fs.getReader();
            while(rdr.hasNext()) {
                const feature = rdr.next();
                //console.log(fjson.toString(feature));
                features.add(feature);
            }
            */
            
            const features = fs.getFeatures();
            
            const fjson = geotools.createFeatureJSON();
            console.log(fjson.toString(features));
            
        }
        catch(e) {
            console.log(e);
        }
        
        
      } 
  })
.help()
.argv