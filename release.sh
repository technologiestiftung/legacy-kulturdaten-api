echo "Starting release ..."
if [ $NODE_ENV == "beta" ]; then
  echo "Rolling back migrations ..."
  node ace migration:rollback --force --batch 0
fi

echo "Running migrations ..."
node ace migration:run

if [ $NODE_ENV == "beta" ]; then
  echo "Loading fixtures ..."
  node ace fixtures:load --verbose
  echo "Seeding database ..."
  node ace db:seed
fi