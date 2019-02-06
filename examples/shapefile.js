const geotoolsFactory = require("../index");

(async function () {
    const className = 'org.geotools.data.shapefile.ShapefileDataStoreFactory';
    const shapeFileStorePath=__dirname + '/../node_modules/geotools-node-wrapper/geotools/modules/library/sample-data/src/main/resources/org/geotools/test-data/shapes';
    const geotools = await geotoolsFactory.getInstance();
    
    const java = geotools.getJava();
    const factory = await geotools.createDataStoreFactoryFromClass(className);
    const params = geotools.fileToUrlParams(shapeFileStorePath);
    
    const store = factory.createDataStore(params);
    
    const names = store.getTypeNames();
    console.log(names);
    
    const typeName = 'polygontest';
    const fs = store.getFeatureSource(typeName);
    
    const features = fs.getFeatures();
            
    const fjson = geotools.createFeatureJSON();
    console.log(fjson.toString(features));
})();

