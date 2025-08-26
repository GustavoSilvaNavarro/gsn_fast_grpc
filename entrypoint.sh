#!/bin/sh

until nc -zv $DB_HOST $DB_PORT
do
  >&2 echo "DB is unavailable at $DB_HOST and PORT: $DB_PORT - 💤 sleeping..."
  sleep 5
done

>&2 echo "🔥 DB is up - executing command"

export DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME

sh -c 'npm run migration:up'

exec npm start
