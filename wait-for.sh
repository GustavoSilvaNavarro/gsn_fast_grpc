#!/bin/sh

set -e
host="$1"
shift

until curl -s $host
do
  >&2 echo "Service is unavailable - sleeping 💤"
  sleep 5
done

>&2 echo "Service is 🚀 up - executing command"
exec "$@"
