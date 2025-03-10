
#!/bin/bash

# Function to terminate all child processes when the script is stopped
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to call cleanup function when script receives SIGINT or SIGTERM
trap cleanup SIGINT SIGTERM

# Build and run the backend
echo "Building and running the backend..."
cd be
./mvnw spring-boot:run &
BE_PID=$!
cd ..

# Wait a few seconds for the backend to start
sleep 5

# Run the frontend
echo "Starting the frontend..."
npm run dev &
FE_PID=$!

# Wait for both processes to finish
wait $BE_PID $FE_PID
