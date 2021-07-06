#!/bin/bash -eu

function container() {
  docker-compose run --rm $@
}

echo "--- installing dependencies"
container node npm i

echo "--- building package"
container node npm run build

echo "--- running integration tests"
container node npm test
