echo "Building new image ..."
docker build -t $AWS_LIGHTSAIL_SERVICE_NAME:release .

echo "Pushing image ..."
aws lightsail push-container-image --region $AWS_REGION --service-name $AWS_LIGHTSAIL_SERVICE_NAME --label $AWS_LIGHTSAIL_SERVICE_NAME --image $AWS_LIGHTSAIL_SERVICE_NAME:release