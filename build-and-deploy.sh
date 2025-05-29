#!/bin/bash

# MateTrack PWA Build and Deploy Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="matetrack"
IMAGE_TAG="latest"
NAMESPACE="default"

echo -e "${GREEN}🍻 MateTrack PWA Build and Deploy Script${NC}"
echo "========================================"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_warning "kubectl not found. Install kubectl for Kubernetes deployment."
fi

print_status "Building Docker image..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully!"
else
    print_error "Docker build failed!"
    exit 1
fi

# Ask user what they want to do
echo ""
echo "What would you like to do?"
echo "1) Run locally with Docker"
echo "2) Deploy to Kubernetes"
echo "3) Both"
echo "4) Just build (already done)"
read -p "Enter your choice (1-4): " choice

case $choice in
    1|3)
        print_status "Starting container locally..."
        docker stop matetrack-local 2>/dev/null || true
        docker rm matetrack-local 2>/dev/null || true
        docker run -d -p 8080:80 --name matetrack-local ${IMAGE_NAME}:${IMAGE_TAG}
        print_status "MateTrack is running locally at: http://localhost:8080"
        ;;
esac

case $choice in
    2|3)
        if command -v kubectl &> /dev/null; then
            print_status "Deploying to Kubernetes..."
            
            # Check if namespace exists, create if not
            kubectl get namespace ${NAMESPACE} > /dev/null 2>&1 || kubectl create namespace ${NAMESPACE}
            
            # Apply Kubernetes manifests
            kubectl apply -f kubernetes.yaml -n ${NAMESPACE}
            
            print_status "Waiting for deployment to be ready..."
            kubectl wait --for=condition=available --timeout=300s deployment/matetrack-pwa -n ${NAMESPACE}
            
            # Get service information
            print_status "Deployment successful!"
            echo ""
            echo "Service information:"
            kubectl get service matetrack-service -n ${NAMESPACE}
            
            # Try to get external IP
            EXTERNAL_IP=$(kubectl get service matetrack-service -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
            if [ -n "$EXTERNAL_IP" ]; then
                print_status "MateTrack is available at: http://${EXTERNAL_IP}"
            else
                print_warning "External IP not yet assigned. Use 'kubectl get service matetrack-service -n ${NAMESPACE}' to check status."
            fi
        else
            print_error "kubectl not found. Cannot deploy to Kubernetes."
            exit 1
        fi
        ;;
    4)
        print_status "Build completed. Image ready: ${IMAGE_NAME}:${IMAGE_TAG}"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
print_status "Script completed successfully!"
echo ""
echo "Quick commands:"
echo "- View local logs: docker logs matetrack-local"
echo "- Stop local container: docker stop matetrack-local"
echo "- View k8s pods: kubectl get pods -n ${NAMESPACE}"
echo "- View k8s logs: kubectl logs -f deployment/matetrack-pwa -n ${NAMESPACE}"
echo "- Delete k8s deployment: kubectl delete -f kubernetes.yaml -n ${NAMESPACE}"