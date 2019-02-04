const path = require('path');
const java = require("java");
const readdir = require("recursive-readdir");
const _ = require('lodash');


java.asyncOptions = {
  asyncSuffix: undefined,     // Don't generate node-style methods taking callbacks
  syncSuffix: "",              // Sync methods use the base name(!!)
  promiseSuffix: "Promise",   // Generate methods returning promises, using the suffix Promise.
  promisify: require('util').promisify // Needs Node.js version 8 or greater, see comment below
};


const createInstance = function(opts) {
  return new Promise(function(resolve,reject) {
    
    const baseDir = _.get(opts,'gt-pkg',__dirname + "/../src/gt-pkg");
    
    const excludeDeps = _.get(opts,'exclude-deps',[
      "gt-epsg-postgresql"
      ,"gt-epsg-extension"
    ]);

    readdir(baseDir).then(
      function(files) {
        //console.log("files are", files);
        for(let fpath of files) {
            if(fpath.endsWith(".jar")) {
                const baseName = path.basename(fpath);
                //console.log(baseName);
                const isExcluded = _.filter(excludeDeps,
                  function(o) { 
                    return baseName.startsWith(o);
                    //console.log(o);
                  }
                )
                if(isExcluded.length > 0) {
                  //console.log("exclude: " + fpath);
                }
                else
                  java.classpath.push(fpath);
            }
        }
        //console.log("dependency load complete");
        resolve(java);
      },
      function(error) {
        console.error("error loading java dependencies", error);
        reject(error);
      }
    );
 });
}

exports.getJavaInstance = function(opts) {
    const ready = createInstance(opts);
    return {
        java,
        ready
    };
}