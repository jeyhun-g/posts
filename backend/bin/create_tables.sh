#!/bin/bash

set -e

ENDPOINT_URL="--endpoint-url http://localhost:8000"
echo "Creating tables in local DynamoDB..."

# Create PostsBlogUrlsRaw table
echo "Creating table: PostsBlogUrlsRaw"
aws dynamodb create-table $ENDPOINT_URL \
    --table-name PostsBlogUrlsRaw \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=createdAt,AttributeType=N \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=createdAt,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    || echo "Table PostsBlogUrlsRaw may already exist"

# Create BlogsData table
echo "Creating table: BlogsData"
aws dynamodb create-table $ENDPOINT_URL \
    --table-name BlogsData \
    --attribute-definitions \
        AttributeName=pk,AttributeType=S \
        AttributeName=sk,AttributeType=S \
    --key-schema \
        AttributeName=pk,KeyType=HASH \
        AttributeName=sk,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    || echo "Table BlogsData may already exist"

echo "Done! Tables created successfully."