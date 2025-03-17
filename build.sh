#!/bin/bash

echo "Building and deploying Diah_Ayu application..."

echo "Step 1: Clearing Angular cache..."
rm -rf .angular/cache

echo "Step 2: Building Angular application..."
ng build --configuration production

if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    
    echo "Step 3: Deploying to Firebase..."
    firebase deploy
    
    if [ $? -eq 0 ]; then
        echo "Deployment completed successfully!"
        echo "Your application is now live!"
    else
        echo "Error: Firebase deployment failed."
        exit 1
    fi
else
    echo "Error: Angular build failed."
    exit 1
fi