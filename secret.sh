#!/bin/bash

PRIVATE_KEY_KEYPAIR_NAME="private-key"
PRIVATE_KEY_VALUE_FILE_NAME="private-key.pem"

aws secretsmanager create-secret \
   --name ${PRIVATE_KEY_KEYPAIR_NAME} \
   --secret-string file://${PRIVATE_KEY_VALUE_FILE_NAME} \
   --region eu-central-1
