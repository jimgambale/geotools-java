const javaInit = require('./javaInit');
const _ = require('lodash');

const DataStoreTypes = {
    "VPF": "org.geotools.data.vpf.VPFDataStoreFactory",
    "SHAPEFILE": "org.geotools.data.shapefile.ShapefileDataStoreFactory"
};

class Geotools {
    constructor(opts) {
        this.java = null;
        //this.opts = _.merge({},opts);
        this.opts = {}
    }
    
    waitJvm() {
     const thisObj = this;
     return new Promise(function(resolve,reject) {
         
        const testJvm = () => {
            const haveJvm = thisObj.java.isJvmCreated();
            if(haveJvm) {
                resolve(true);
            }
            else {
                console.log('jvm not ready');
                setTimeout(testJvm,1000);
            }
        }
        
        testJvm();
     });
        
    }
    
    async initJava() {
        this.javaWrapper = javaInit.getJavaInstance(this.opts);
        
        //console.log('wait ready');
        await this.javaWrapper.ready;
        //console.log('wait ready returned');
        
        this.java = this.javaWrapper.java;
        //console.log("java init complete");
        
        await this.waitJvm();
        //console.log("java ready");
        
        const logLevel = _.get(this.opts,"logLevel","WARNING");
        //console.log(logLevel);
        
        
        const level = this.java.getStaticFieldValue("java.util.logging.Level",logLevel);
        //console.log('got level: ' + level.toString());
        
        const logging = this.java.getStaticFieldValue("org.geotools.util.logging.Logging","GEOTOOLS");
        
        logging.forceMonolineConsoleOutput(level);
        
        //console.log("initJava complete");
        
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
    
    //console.log("wait load...");
    await geotools.initJava();
    //console.log("load done.");
    
    return geotools;
}
