#!/bin/bash
BASEDIR=$(dirname $0)
source $BASEDIR/helpers.sh

BACKEND_DIR=../../backend

# use linux platform when building docker images
export DOCKER_DEFAULT_PLATFORM=linux/amd64

# check if access to ECR is available
command=$(aws ecr describe-images --repository-name $REPO_NAME)
command_exit_code=$?
if [[ "$command_exit_code" -ne 0 ]]
then
  print_error "No access to the ECR repo"
  exit 1
fi

# check docker version
command=$(docker -v)
command_exit_code=$?
if [[ "$command_exit_code" -ne 0 ]]
then
  print_error "Docker not available"
  exit 1
fi

# docker build
command=$(docker build --no-cache -t $REPO_NAME $BACKEND_DIR)
command_exit_code=$?
if [[ "$command_exit_code" -ne 0 ]]
then
  print_error "Couldn't build dockerfile"
  exit 1
fi

# docker upload
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $REPO_LOCATION
docker build -t $REPO_NAME .
docker tag $REPO_NAME:latest $REPO_ARN:latest
docker push $REPO_ARN:latest

# deploy
# aws apprunner start-deployment --service-arn arn:aws:apprunner:us-east-1:620526827136:service/qrguard-backend-api/796e227ec8ca49bbb4da6603a1e38b7b