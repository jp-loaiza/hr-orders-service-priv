# update existing configmap
kubectl create configmap hr-orders-service \
  --from-literal=SFTP_HOST=$SFTP_HOST_KUBERNETES \
  --from-literal=SFTP_PORT=$SFTP_PORT \
  --from-literal=SFTP_INCOMING_ORDERS_PATH=$SFTP_INCOMING_ORDERS_PATH \
  --from-literal=CT_PROJECT_KEY=$CT_PROJECT_KEY \
  --from-literal=CT_OAUTH_HOST=$CT_OAUTH_HOST \
  --from-literal=CT_HOST=$CT_HOST \
  --from-literal=ORDER_UPLOAD_INTERVAL=$ORDER_UPLOAD_INTERVAL \
  --from-literal=EMAIL_API_URL=$EMAIL_API_URL_KUBERNETES \
  --from-literal=SHOULD_RUN_JOBS=$SHOULD_RUN_JOBS \
  --from-literal=SEND_NOTIFICATIONS_INTERVAL=$SEND_NOTIFICATIONS_INTERVAL \
  -o yaml --dry-run | kubectl apply -f -

# update existing secret
kubectl create secret generic hr-orders-service \
  --from-literal=SFTP_USERNAME=$SFTP_USERNAME \
  --from-literal=SFTP_PRIVATE_KEY=$SFTP_PRIVATE_KEY \
  --from-literal=CT_CLIENT_ID=$CT_CLIENT_ID \
  --from-literal=CT_CLIENT_SECRET=$CT_CLIENT_SECRET \
  --from-literal=EMAIL_API_USERNAME=$EMAIL_API_USERNAME \
  --from-literal=EMAIL_API_PASSWORD=$EMAIL_API_PASSWORD \
  --from-literal=HEALTHZ_AUTHORIZATION=$HEALTHZ_AUTHORIZATION \
  -o yaml --dry-run | kubectl apply -f -  

sed "s~{IMAGE}~$IMAGE~g; s~{HEALTHZ_AUTHORIZATION}~$HEALTHZ_AUTHORIZATION~g;" ./deployment.yaml > ./deployment-populated.yaml
kubectl apply -f ./deployment-populated.yaml

# cleanup temporary files
rm ./deployment-populated.yaml
