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
* The geotools JAR files and dependencies are generated using the following shell script
```bash
$ ./makegt.sh node_modules/geotools
```
* The packaged geotools JARs are placed in geotools-java/src/gt-pkg

## Simple Example
```javascript
const geotoolsFactory = require("geotools-java");

(async function () {
    const className = 'org.geotools.data.shapefile.ShapefileDataStoreFactory';
    const shapeFileStorePath=__dirname + '/../node_modules/geotools/modules/library/sample-data/src/main/resources/org/geotools/test-data/shapes';
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

```

# Release Notes

### v0.1.0

* Initial release