#!/usr/bin/env bash

set -e

options=("development" "production")
echo "Select environment:"
select env_choice in "${options[@]}"; do
  if [[ "$env_choice" == "development" ]]; then
    env_file=".env.dev"
    break
  elif [[ "$env_choice" == "production" ]]; then
    env_file=".env.prod"
    break
  else
    echo "Invalid choice. Please try again."
  fi
done

if [ ! -f "$env_file" ]; then
  echo "Environment file '$env_file' not found!"
  exit 1
fi

echo "Sourcing $env_file..."
set -o allexport
source "$env_file"
set +o allexport

# Run your target script with the loaded env
sh ./backend/deploy.sh
