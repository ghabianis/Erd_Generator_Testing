#!/bin/bash
docker-compose --profile dev build
docker-compose --profile dev up -d
echo "Wainting for swagger file"
while ! curl --output /dev/null --silent --head --fail $api_url/nest/api-json; do
 sleep 1 && echo -n .;
done;
echo "Downloading swagger file"
curl --silent $api_url/nest/api-json -o swagger.json
echo "generating .ts from swagger"/nest/api-json
npx swagger-typescript-api -p ./swagger.json -o ./client-ui -n index.ts -t ./swagger/templates/default --union-enums <<-EOF
y
EOF