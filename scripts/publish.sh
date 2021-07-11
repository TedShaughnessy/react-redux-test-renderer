#!/bin/bash -eu

source scripts/_functions.sh

echo "--- running integration tests"
container npm run test | tee test.log

echo "--- publishing package"
container npm run publish-package | publish.log