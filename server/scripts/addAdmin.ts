import axios from 'axios';
import * as dotenv from "dotenv";



export async function addAdmin() {
    dotenv.config();

    const { SERVICE_ROLE_KEY } = process.env;
    const { ANON_KEY } = process.env;
    const { KONG_URL } = process.env;
    
    await axios.post((KONG_URL || '')+'/auth/v1/admin/users',
    {
      "email": "admin@gmail.com",
      "password": "admin",
      "role": "admin",
      "email_confirm": true
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY || '',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY||''}`
      }
    })
    .then(response => {
      console.log("response", response.data)
      return response.data;
    })
    .catch(error => {
      console.log("error", error.response.data)
      return error;
    });
   
}