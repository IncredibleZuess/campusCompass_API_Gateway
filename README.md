# campusCompass_API_Gateway
Gateway for application

**Gateway.config.yml**
  All instances of localhost mentions, are just for placeholder purposes. That will be where the actual hosting servers name and open ports go. 

### policies
   Made used of only 3 policies in the skeleton, namely:
  
              - proxy: for routing traffic from public facing gateway to the corresponding backend service port
              - jwt: for the authentication of the admin user, which was implemented in response to the jwt implemented by the backend team 
              - rate-limit: for ensuring that client request are kept at a reasonable amount, as not to overwhelm the API
