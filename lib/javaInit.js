const java = require("java");
const path = require('path');
const readdir = require("recursive-readdir");
const _ = require('lodash');

const addJars = function(baseDir,excludeDeps) {
  
  //console.log("addJars: " + baseDir);
  
  return new Promise(function(resolve,reject) {
     readdir(baseDir).then(
      async function(files) {
        for(let fpath of files) {
            if(fpath.endsWith(".jar")) {
                const baseName = path.basename(fpath);
                const isExcluded = _.filter(excludeDeps,
                  function(o) { 
                    return baseName.startsWith(o);
                  }
                )
                if(isExcluded.length > 0) {
                  //console.log("exclude: " + fpath);
                }
                else {
                  //console.log(fpath);
                  java.classpath.push(fpath);
                }
            }
        }
        //console.log("addJars complete: " + baseDir);
        resolve(true);
      },
      function(error) {
        console.error("error loading java dependencies", error);
        reject(error);
      }
      );
  });
  
}

const createInstance = function(opts) {
  return new Promise(function(resolve,reject) {
    
    const baseDir = _.get(opts,'gt-pkg',__dirname + "/../src/gt-jar");
    
    const excludeDeps = _.get(opts,'exclude-deps',[
    ]);
    
    const folders = [
      baseDir + '/' + 'target',
     ];
    
    const beforeJvm = async function(callback) {
       //console.log("beforeJvm");
       for(let folder of folders) {
         await addJars(folder,excludeDeps);
       }
       
       // Will hang on OSX without these options
       // https://holistictendencies.wordpress.com/2011/10/13/truly-headless-awt-operation-on-macos-x/
       const vmOptions = _.get(opts,'vmOptions',[
          '-Djava.awt.headless=true',
          '-Dawt.toolkit=sun.awt.HToolkit',
       ]);
       
       for(let vmopt of vmOptions) {
         java.options.push(vmopt);
       }
       
       java.asyncOptions = {
          asyncSuffix: undefined,     // Don't generate node-style methods taking callbacks
          syncSuffix: "",              // Sync methods use the base name(!!)
          promiseSuffix: "Promise",   // Generate methods returning promises, using the suffix Promise.
          promisify: require('util').promisify // Needs Node.js version 8 or greater, see comment below
       };
       
       const haveJvm = java.isJvmCreated();
       //console.log({haveJvm});
       
       callback();
       //console.log("beforeJvm callback called");
    };
    
    //console.log("call registerClient");
    java.registerClient(beforeJvm);
    
    java.ensureJvm((err) => {
      const haveJvm = java.isJvmCreated();
      //console.log({haveJvm});
      
      resolve(java);
    });
    
 });
}

exports.getJavaInstance = function(opts) {
    const ready = createInstance(opts);
    return {
        java,
        ready
    };
}