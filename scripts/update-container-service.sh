echo "Getting latest container image ..."

CONTAINER_IMAGE=$(aws lightsail get-container-images --service-name $SERVICE_NAME | jq --raw-output ".containerImages[0].image")

echo "Latest container image: $CONTAINER_IMAGE"

echo "Building service description ..."

envsubst < container.template.json > container.json

echo "Starting service update ..."

aws lightsail create-container-service-deployment --service-name $AWS_LIGHTSAIL_SERVICE_NAME --cli-input-json file://$(pwd)/container.json