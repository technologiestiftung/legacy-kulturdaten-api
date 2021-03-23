#!/usr/bin/env bash
if [ $NODE_ENV == "beta" ]; then
  node ace migration:rollback --force --batch 0
fi

node ace migration:run