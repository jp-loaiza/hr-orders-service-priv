To build: https://docs.docker.com/get-started/part2/#build-the-app
0. ibmcloud cr login
1. docker build --tag=hr-orders-service:0.0.1 .
2. docker tag hr-orders-service:0.0.1 us.icr.io/hrretailplatform/hr-orders-service:0.0.1
3. docker push us.icr.io/hrretailplatform/hr-orders-service:0.0.1

To deploy:
0. $: source .env 
1. $: kubectl create secret generic hr-orders-service \
  --from-literal=SFTP_HOST=$SFTP_HOST \
  --from-literal=SFTP_PORT=$SFTP_PORT \
  --from-literal=SFTP_USERNAME=$SFTP_USERNAME \
  --from-literal=SFTP_PRIVATE_KEY=$SFTP_PRIVATE_KEY \
  --from-literal=SFTP_INCOMING_ORDERS_PATH=$SFTP_INCOMING_ORDERS_PATH \
  --from-literal=INCOMING_ORDER_FIELDS=$INCOMING_ORDER_FIELDS
2. $: kubectl expose deployment hr-orders-service --type=LoadBalancer --name=hr-orders-service
