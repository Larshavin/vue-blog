#!/bin/bash
mkdir dist

cd dist
git init
git remote add origin https://github.com/Larshavin/Larshavin.github.io.git
git checkout main
cd ..

git submodule add https://github.com/Larshavin/Larshavin.github.io.git dist

git submodule init
git submodule update