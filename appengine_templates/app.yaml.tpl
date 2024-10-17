service: editing-ui
runtime: nodejs20

vpc_access_connector:
  name: projects/_PROJECT_ID/locations/europe-west2/connectors/vpcconnect

env_variables:
  VM_EXTERNAL_WEB_URL: _VM_EXTERNAL_WEB_URL
  BLAISE_API_URL: _BLAISE_API_URL
  PROJECT_ID: _PROJECT_ID
  SERVER_PARK: _SERVER_PARK
  ROLES: _ROLES
  SURVEYS: _SURVEYS

basic_scaling:
  idle_timeout: 10m
  max_instances: 10

handlers:
- url: /.*
  script: auto
  secure: always
  redirect_http_response_code: 301
