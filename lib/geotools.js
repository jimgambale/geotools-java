const javaInit = require('./javaInit');
const _ = require('lodash');

const DataStoreTypes = {
    "VPF": "org.geotools.data.vpf.VPFDataStoreFactory",
    "SHAPEFILE": "org.geotools.data.shapefile.ShapefileDataStoreFactory"
};

class Geotools {
    
    
    constructor(opts) {
        this.java = null;
        this.opts = _.merge({},opts);
    }
    
    async initJava() {
        this.javaWrapper = javaInit.getJavaInstance(this.opts);
        await this.javaWrapper.ready;
        this.java = this.javaWrapper.java;
        //console.log("java init complete");
        
        const logLevel = _.get(this.opts,"logLevel","WARNING");
        
        const level = this.java.getStaticFieldValue("java.util.logging.Level",logLevel);
        
        const logging = this.java.getStaticFieldValue("org.geotools.util.logging.Logging","GEOTOOLS");
        
        logging.forceMonolineConsoleOutput(level);
        
        return this.java;
    }
    
    getJava() {
        return this.java;
    }
    
    fileToUrl(filePath) {
        const className = "org.geotools.util.URLs";
        const file = this.java.newInstanceSync("java.io.File",filePath);
        var result = this.java.callStaticMethodSync(className, "fileToUrl", file);
        return result;
    }
    
    fileToUrlParams(filePath) {
        const url = this.fileToUrl(filePath);
        const params = this.java.newInstanceSync("org.geotools.util.KVP","url", url);
        return params;
    }
    
    getDataStoreClass(storeType) {
        return DataStoreTypes[storeType];
    }
    
    createDataStoreFactoryFromType(storeType) {
        const javaClass = DataStoreTypes[storeType];
        if(!javaClass)
            return null;
        else
            return this.createDataStoreFactoryFromClass(javaClass);
    }
    createDataStoreFactoryFromClass(className) {
        return this.java.newInstanceSync(className);
    }
    
    createFeatureJSON() {
        return this.java.newInstanceSync("org.geotools.geojson.feature.FeatureJSON");
    }
    
    createListFeatureCollection(featureType) {
        return this.java.newInstanceSync("org.geotools.data.collection.ListFeatureCollection",featureType);
    }
    
    
    
};

exports.getInstance=async function() {
    const geotools = new Geotools();
    await geotools.initJava();
    return geotools;
}
