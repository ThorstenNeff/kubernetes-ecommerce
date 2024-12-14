import buildClient from "../api/build-client"

const LandingPage = ({currentUser}) => {
  console.log("Current user: ", currentUser);
  if (currentUser) {
    return <h1>You are signed in</h1>;
  } else {
    return <h1>You are not signed in</h1>;
  }
};
  
LandingPage.getInitialProps = async (context) => {
  const {data} = await buildClient(context).get('/api/users/currentuser');
  return data; 
};

export default LandingPage;
