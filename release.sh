echo "Starting release ..."

echo "Running migrations ..."
node ace migration:run

echo "Seeding database ..."
node ace db:seed