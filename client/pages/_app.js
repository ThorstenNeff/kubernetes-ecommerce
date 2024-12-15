import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

// Overwrite default Next.js app.js file (> thin wrapper around Next screens)
// The current next screen is in Component

const AppComponent =  ({ Component, pageProps, currentUser}) => {
    return (
        <div>
            <h1>Ticketing {currentUser.email}</h1>
            <Component {...pageProps} />
        </div>
    );
}

AppComponent.getInitialProps = async (appContext) => {

    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
        pageProps,
        currentUser: data.currentUser
    };
};

export default AppComponent;