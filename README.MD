To build: https://docs.docker.com/get-started/part2/#build-the-app
0. ibmcloud cr login
1. docker build --tag=hr-orders-service:0.0.1 .
2. docker tag hr-orders-service:0.0.1 us.icr.io/hrretailplatform/hr-orders-service:0.0.1
3. docker push us.icr.io/hrretailplatform/hr-orders-service:0.0.1

To deploy:
