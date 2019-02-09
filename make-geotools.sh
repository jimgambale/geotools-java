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

cp ${GT_HOME}/pom.xml .
cp ./pom-nodocs.xml ${GT_HOME}/pom.xml

pushd ${GT_HOME}
mvn -DskipTests -Dall install
#mvn -DskipTests -Dall clean
popd

cp ./pom.xml ${GT_HOME}/
rm -f ./pom.xml