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

pushd ${GT_HOME}
mvn -DskipTests -Dall install
#mvn -DskipTests -Dall clean
popd

pushd src/gt-jar
rm -rf target
mvn -DskipTests package
popd