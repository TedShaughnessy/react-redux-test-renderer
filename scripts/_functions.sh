#!/bin/bash -eu

function container() {
  docker-compose run --rm container $@
}
