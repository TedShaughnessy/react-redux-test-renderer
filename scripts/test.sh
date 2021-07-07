#!/bin/bash -eu

source scripts/_functions.sh

echo "--- installing dependencies"
container npm i

echo "--- building package"
container npm run build

echo "--- running integration tests"
container npm run test
