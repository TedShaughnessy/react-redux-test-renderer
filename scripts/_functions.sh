#!/bin/bash -eu

function container() {
  docker-compose run --rm test $@
}

function package() {
  docker-compose run --rm package $@
}
