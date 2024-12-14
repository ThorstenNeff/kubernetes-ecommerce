import axios from 'axios';

const LandingPage = ({currentUser}) => {
  console.log("Current user: ", currentUser);
  return <h1>Landing Page</h1>;
};
  
LandingPage.getInitialProps = async ({req}) => {
  if (typeof window === 'undefined') {
    console.log("getInitialProps on the server");
    const response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
      {
        headers: req.headers
      })
    return response.data;
  } else {
    console.log("getInitialProps on the browser");
    const response = await axios.get('/api/users/currentuser');
    return response.data;
  }
};

export default LandingPage;
