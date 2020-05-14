echo -e "Building container image"
set -x
ibmcloud cr build -t $IMAGE .
set +x
