 FoodFlix Deployment Guide
==========================

This document outlines the steps required to deploy the FoodFlix system using Docker and Kubernetes.

--------------------------
1. Prerequisites
--------------------------
- Node.js and npm installed
- Docker and Docker Compose installed
- Kubernetes (Minikube or any cluster) with kubectl configured
- MongoDB connection string
- Stripe, SendGrid, and Twilio credentials

--------------------------
2.  Project Structure
--------------------------
FoodFlix/
├── auth-service/
├── restaurant-service/
├── order-service/
├── delivery-service/
├── payment-service/
├── notification-service/
├── frontend/
├── k8s/

Each service contains:
- Dockerfile
- server.js or entry point
- routes/, controllers/, models/
- k8s/deployment.yaml and service.yaml
- .env for environment variables

--------------------------
3.  Environment Variables
--------------------------
Each service has its own .env file. Example (auth-service/.env):

To build the frontend:

docker build -t foodflix-frontend ./frontend

markdown
Copy
Edit

--------------------------
5. Apply Kubernetes Configs
--------------------------
From the root folder:

kubectl apply -f k8s/

diff
Copy
Edit

Ensure the following are applied:
- Deployments for each service
- Service YAMLs for exposing containers
- MongoDB deployment and service
- ConfigMaps and Secrets for shared env vars

Optional: For testing locally with Minikube, enable Ingress and use port forwarding:

kubectl port-forward svc/auth-service 3000:3000 kubectl port-forward svc/frontend 3001:3001

markdown
Copy
Edit

--------------------------
6. Verify the Deployment
--------------------------
Run:

kubectl get pods kubectl get services

markdown
Copy
Edit

Ensure all services show STATUS = Running.

Visit the frontend (e.g., http://localhost:3001) and test authentication, ordering, payments, and delivery assignment flows.

--------------------------
7. Health Check (Optional)
--------------------------
Each service exposes a /health endpoint:

- Auth: GET /api/auth/health
- Payment: GET /api/payments/health
- Notification: GET /api/notify/health

Use Postman or browser to check service availability.

--------------------------
8. External Services Setup
--------------------------
Ensure the following services are configured and their keys are stored in your .env or Kubernetes Secrets:

- Stripe → for payment processing (use test mode keys)
- SendGrid → for sending emails
- Twilio → for SMS notifications
- MongoDB Atlas (or local MongoDB deployment)

--------------------------
9. Final Notes
--------------------------
- Keep ports and service names consistent in Kubernetes configs.
- Always update Docker images and redeploy using kubectl rollout restart deployment <service-name> if you change code.
- Logs can be viewed with kubectl logs <pod-name> for debugging.
