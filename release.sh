if [ $NODE_ENV == "beta" ]; then
  node ace migration:rollback --force --batch 0
fi

node ace migration:run

if [ $NODE_ENV == "beta" ]; then
  node ace db:seed
  node ace fixtures:crypto --file=20210429151210_User --pretty
  node ace fixtures:load
fi