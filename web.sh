#!/bin/bash
echo "Running migrations ..." &&
node ace migration:run --force -c pg &&
echo "Starting server ..." &&
node server.js