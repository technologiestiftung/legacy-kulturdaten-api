if [ $NODE_ENV == "beta" ]; then
  node ace migration:rollback --force --batch 0
  node ace db:seed
fi

node ace migration:run