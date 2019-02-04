#!/bin/bash
if [ -z "$1" ]
  then
    echo "usage: makegt.sh GT_HOME"
    exit
fi
GT_HOME=$1

if [ ! -d "$GT_HOME" ]; then
  echo "${GT_HOME} doesn't exist "
  exit
fi

pushd src
rm -rf gt-pkg
mkdir -p gt-pkg/dependency
WD=$(pwd)
popd

pushd ${GT_HOME}

mvn -DskipTests package

pushd ./modules/library
mvn -DskipTests dependency:copy-dependencies
popd

pushd ./modules/extension
mvn -DskipTests dependency:copy-dependencies
popd

pushd ./modules/plugin
mvn -DskipTests dependency:copy-dependencies
popd

pushd ./modules/unsupported
mvn -DskipTests dependency:copy-dependencies
popd

find ./modules/library -wholename '*/dependency/*.jar' \
! -wholename '*dependency/gt-*.jar' \
! -name '*-sources.jar' \
-print  \
 -exec cp {} $WD/gt-pkg/dependency/ \;
 
find ./modules/extension -wholename '*/dependency/*.jar' \
! -wholename '*dependency/gt-*.jar' \
! -name '*-sources.jar' \
-print  \
 -exec cp {} $WD/gt-pkg/dependency/ \;
 
find ./modules/plugin -wholename '*/dependency/*.jar' \
! -wholename '*dependency/gt-*.jar' \
! -name '*-sources.jar' \
-print  \
 -exec cp {} $WD/gt-pkg/dependency/ \;
 
find ./modules/unsupported -wholename '*/dependency/*.jar' \
! -wholename '*dependency/gt-*.jar' \
! -name '*-sources.jar' \
-print  \
 -exec cp {} $WD/gt-pkg/dependency/ \;
 

find ./modules/library -name '*.jar' \
! -wholename '*dependency/*.jar' \
! -name '*-sources.jar' \
-print  \
 | zip -9yqq $WD/gt-pkg/lib.zip -@
 
find ./modules/extension -name '*.jar' \
! -wholename '*dependency/*.jar' \
! -name '*-sources.jar' \
-print  \
 | zip -9yqq $WD/gt-pkg/extension.zip -@
 
find ./modules/plugin -name '*.jar' \
! -wholename '*dependency/*.jar' \
! -name '*-sources.jar' \
-print  \
 | zip -9yqq $WD/gt-pkg/plugin.zip -@
 
find ./modules/unsupported -name '*.jar' \
! -wholename '*dependency/*.jar' \
! -name '*-sources.jar' \
-print  \
 | zip -9yqq $WD/gt-pkg/unsupported.zip -@
 
mvn -DskipTests clean
 
popd

pushd src/gt-pkg
zip -9ryqq dependency dependency
unzip -qq lib.zip
unzip -qq extension.zip
unzip -qq plugin.zip
unzip -qq unsupported.zip
popd