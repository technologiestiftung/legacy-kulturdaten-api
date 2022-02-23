#!/bin/bash
node ace migration:status
node ace migration:run
node ace migration:status
node server.js