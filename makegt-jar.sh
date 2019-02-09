#!/bin/bash
pushd src/gt-jar
rm -rf target
mvn -DskipTests package
popd