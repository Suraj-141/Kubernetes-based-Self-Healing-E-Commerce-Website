# Premium E-Commerce Microservices Architecture

This project is a fully containerized, microservices-based e-commerce platform orchestrated with Kubernetes. It features a premium, modern frontend (glassmorphism, animations) and robust, scalable backend services.

## Architecture

*   **Frontend**: React, Vite, Lucide Icons, Glassmorphism UI
*   **User Service**: Node.js, Express, PostgreSQL, JWT Authentication
*   **Product Service**: Node.js, Express, PostgreSQL, Auto-scaling (HPA) enabled
*   **Order Service**: Node.js, Express, PostgreSQL, Inter-service communication
*   **Payment Service**: Node.js, Express, Mock Payment Gateway
*   **Database**: PostgreSQL
*   **Orchestration**: Kubernetes (Docker Desktop / Kind)
*   **Routing**: NGINX Ingress Controller

## Running the Project

### Prerequisites
*   Docker Desktop with Kubernetes enabled (or kind installed)
*   `kubectl` CLI

### Quick Start (Kubernetes)
1. Apply the NGINX Ingress controller:
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
   ```
2. Apply all Kubernetes manifests:
   ```bash
   kubectl apply -f k8s/
   ```
3. Access the application at `http://localhost`.

### Auto-Scaling Demo
To test Horizontal Pod Autoscaling (HPA) on the Product Service:
1. Ensure the metrics-server is running in your cluster.
2. Watch pods and HPA in real-time: `kubectl get pods,hpa -w`
3. Hit the high-CPU endpoint repeatedly: `http://localhost/api/products/compute`
4. Watch new product-service pods spin up automatically to handle the load!
