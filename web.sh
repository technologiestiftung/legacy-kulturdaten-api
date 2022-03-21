#!/bin/bash
echo "Running migrations ..." &&
node ace migration:run --force -c pg &&
echo "Running seeders ..." &&
node ace db:seed -c pg &&
echo "Starting server ..." &&
node server.js