if [ $NODE_ENV == "beta" ]; then
  node ace migration:rollback --force --batch 0
fi

node ace migration:run

if [ $NODE_ENV == "beta" ]; then
  node ace fixtures:load
  node ace db:seed
fi