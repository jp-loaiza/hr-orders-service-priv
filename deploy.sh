set -e # abort execution and exit with failure a code if any command fails

# update existing configmap
kubectl create configmap hr-orders-service \
  --from-literal=ALGOLIA_APP_ID=$ALGOLIA_APP_ID \
  --from-literal=SFTP_HOST=$SFTP_HOST_KUBERNETES \
  --from-literal=SFTP_PORT=$SFTP_PORT \
  --from-literal=SFTP_INCOMING_ORDERS_PATH=$SFTP_INCOMING_ORDERS_PATH \
  --from-literal=CJ_CID=$CJ_CID \
  --from-literal=CJ_CONVERSION_BASE_URL=$CJ_CONVERSION_BASE_URL \
  --from-literal=CJ_TYPE=$CJ_TYPE \
  --from-literal=CT_PROJECT_KEY=$CT_PROJECT_KEY \
  --from-literal=CT_OAUTH_HOST=$CT_OAUTH_HOST \
  --from-literal=CT_HOST=$CT_HOST \
  --from-literal=ENVIRONMENT=$ENVIRONMENT \
  --from-literal=ORDER_UPLOAD_INTERVAL=$ORDER_UPLOAD_INTERVAL \
  --from-literal=ORDER_UPDATE_INTERVAL=$ORDER_UPDATE_INTERVAL \
  --from-literal=EMAIL_API_URL=$EMAIL_API_URL_KUBERNETES \
  --from-literal=JESTA_API_HOST=$JESTA_API_HOST \
  --from-literal=SEND_ALGOLIA_INFO_INTERVAL=$SEND_ALGOLIA_INFO_INTERVAL \
  --from-literal=SEND_CJ_CONVERSIONS_INTERVAL=$SEND_CJ_CONVERSIONS_INTERVAL \
  --from-literal=SHOULD_CHECK_FOR_STUCK_ORDERS=$SHOULD_CHECK_FOR_STUCK_ORDERS \
  --from-literal=SHOULD_SEND_ORDER_UPDATES=$SHOULD_SEND_ORDER_UPDATES \
  --from-literal=SHOULD_SEND_ALGOLIA_INFO=$SHOULD_SEND_ALGOLIA_INFO \
  --from-literal=SHOULD_SEND_CJ_CONVERSIONS=$SHOULD_SEND_CJ_CONVERSIONS \
  --from-literal=SHOULD_UPLOAD_ORDERS=$SHOULD_UPLOAD_ORDERS \
  --from-literal=SHOULD_SEND_NOTIFICATIONS=$SHOULD_SEND_NOTIFICATIONS \
  --from-literal=STALE_ORDER_CUTOFF_TIME_MS=$STALE_ORDER_CUTOFF_TIME_MS \
  --from-literal=STUCK_ORDER_CHECK_INTERVAL=$STUCK_ORDER_CHECK_INTERVAL \
  --from-literal=SEND_NOTIFICATIONS_INTERVAL=$SEND_NOTIFICATIONS_INTERVAL \
  --from-literal=NEWRELIC_APP_NAME=$NEWRELIC_APP_NAME \
  --from-literal=MAXIMUM_RETRIES=$MAXIMUM_RETRIES \
  --from-literal=JOB_TASK_TIMEOUT=$JOB_TASK_TIMEOUT \
  -o yaml --dry-run | kubectl apply -f -

# update existing secret
kubectl create secret generic hr-orders-service \
  --from-literal=ALGOLIA_API_KEY=$ALGOLIA_API_KEY \
  --from-literal=SFTP_USERNAME=$SFTP_USERNAME \
  --from-literal=SFTP_PRIVATE_KEY=$SFTP_PRIVATE_KEY \
  --from-literal=CJ_SIGNATURE=$CJ_SIGNATURE \
  --from-literal=CT_CLIENT_ID=$CT_CLIENT_ID \
  --from-literal=CT_CLIENT_SECRET=$CT_CLIENT_SECRET \
  --from-literal=EMAIL_API_USERNAME=$EMAIL_API_USERNAME \
  --from-literal=EMAIL_API_PASSWORD=$EMAIL_API_PASSWORD \
  --from-literal=JESTA_API_USERNAME=$JESTA_API_USERNAME \
  --from-literal=JESTA_API_PASSWORD=$JESTA_API_PASSWORD \
  --from-literal=HEALTHZ_AUTHORIZATION=$HEALTHZ_AUTHORIZATION \
  --from-literal=NEWRELIC_LICENSE_KEY=$NEWRELIC_LICENSE_KEY \
  -o yaml --dry-run | kubectl apply -f -  

sed "s~{IMAGE}~$IMAGE~g; s~{HEALTHZ_AUTHORIZATION}~$HEALTHZ_AUTHORIZATION~g;" ./deployment.yaml > ./deployment-populated.yaml
kubectl apply -f ./deployment-populated.yaml

# cleanup temporary files
rm ./deployment-populated.yaml

# verify that the deployment succeeded
kubectl rollout status deployment hr-orders-service
