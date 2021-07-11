#!/bin/bash -eu

source scripts/_functions.sh

echo "--- installing dependencies" | tee install.log
container npm i

echo "--- building package"
container npm run build | tee build.log

echo "--- running integration tests"
container npm run test | tee test.log
