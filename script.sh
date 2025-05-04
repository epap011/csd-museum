# Stop and remove the container using its ID
container_id=$(sudo docker ps -aq --filter "ancestor=csd-musem" --format "{{.ID}}")
if [ -n "$container_id" ]; then
  sudo docker stop $container_id
  sudo docker rm $container_id
fi

# Remove the image
sudo docker rmi csd-musem

# Build the new image
sudo docker build -t csd-musem .

# Run the container and retrieve the new container ID
new_container_id=$(sudo docker run -d -p 8080:80 csd-musem)

echo "New container ID: $new_container_id"
