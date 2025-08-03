docker run  \
-e POSTGRES_USER='uprise_radiyo' \
-e POSTGRES_PASSWORD='test1234' \
-e POSTGRES_DB='uprise_radiyo_dev' \
-p 3001:5432 \
-v "uprise-db-volume":/var/lib/postgresql/data \
--name uprise_radiyo_dev \
-d sathish0x1/uprise-postgis:1.0
