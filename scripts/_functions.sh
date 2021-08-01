#!/bin/bash

set -euxo pipefail

function container() {
  docker-compose run --rm container $@
}
