const geotoolsFactory = require("../index");

(async function () {
    const className = 'org.geotools.data.shapefile.ShapefileDataStoreFactory';
    const shapeFileStorePath=__dirname + '/../node_modules/geotools-node-wrapper/geotools/modules/library/sample-data/src/main/resources/org/geotools/test-data/shapes';
    
    // Will hang on OSX without these options
    const opts = {
        vmOptions: [
            '-Djava.awt.headless=true',
            '-Dawt.toolkit=sun.awt.HToolkit'
        ]
    };
    const geotools = await geotoolsFactory.getInstance(opts);
    
    const java = geotools.getJava();
    
    const factory = geotools.createDataStoreFactoryFromClass(className);
    const params = geotools.fileToUrlParams(shapeFileStorePath);
    
    const store = factory.createDataStore(params);
    
    const names = store.getTypeNames();
    
    const typeName = 'polygontest';
    const fs = store.getFeatureSource(typeName);
    
    const features = fs.getFeatures();
            
    const fjson = geotools.createFeatureJSON();
    console.log(fjson.toString(features));
})();

