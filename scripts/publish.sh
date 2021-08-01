#!/bin/bash

set -euxo pipefail

source scripts/_functions.sh

echo "--- installing dependencies" | tee install.log
container npm i

echo "--- building package"
container npm run build | tee build.log

echo "--- publishing package"
container npm run publish-package | tee publish.log