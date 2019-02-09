# geotools-java

Bridge API to connect node.js with geotools Java APIs

### Other projects that might be helpful

* [geotools](https://github.com/geotools/geotools) - Open source Java library that provides tools for geospatial data.
* [node-java](https://github.com/joeferner/node-java) - Bridge API to connect with existing Java APIs.

## Installation

```bash
$ npm install --save geotools-java
```

Notes:

* Refer to [node-java](https://github.com/joeferner/node-java) for node-java installaton prerequisites

### Installation Prerequisites

* JDK 8 or newer, Apache Maven, C++ compiler, python 2.7.x, zip, unzip

## GeoTools Build and Packaging

* The npm install process clones the geotools repo to node_modules/geotools.
* The geotools JAR files and dependencies are packaged using te Maven Shade Plugin.
* The makegt-jar.sh script is used to generate an Uber JAR containing the dependencies:
```bash
$ ./makegt-jar.sh node_modules/geotools-node-wrapper/geotools
```
* The packaged geotools dependencies are placed in geotools-java/src/gt-jar/target/node-geotools-1.x.jar

## Simple Example
```javascript
const geotoolsFactory = require("geotools-java");

(async function () {
    const className = 'org.geotools.data.shapefile.ShapefileDataStoreFactory';
    const shapeFileStorePath=__dirname + '/../geotools/modules/library/sample-data/src/main/resources/org/geotools/test-data/shapes';
    
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
```

# Release Notes

### v0.1.0

* Initial release
