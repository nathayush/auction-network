#!/bin/bash
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images | grep fabcar | awk '{print $3}')
./stop.sh && ./teardown.sh
