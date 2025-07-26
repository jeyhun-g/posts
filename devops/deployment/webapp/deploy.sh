deploy() {
  echo "Deploying..."
  aws amplify start-job --app-id $WEBAPP_APP_ID --branch-name main --job-type RELEASE
}

deploy