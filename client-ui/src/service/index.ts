import { Api } from "../../index";

const handleError = () => {
   localStorage.removeItem('supabase.auth.token');
   window.location.pathname = "/auth/sign-in"
 } 


const service = new Api({
   baseUrl: `${import.meta.env.VITE_API_URL}/nest`,
   handleError: handleError
});

export default service;
