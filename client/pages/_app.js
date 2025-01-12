import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Link from 'next/link';
import AppHeader from '../appcomponents/app-header';
// Overwrite default Next.js app.js file (> thin wrapper around Next screens)
// The current next screen is in Component

const AppComponent =  ({ Component, pageProps, currentUser}) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
      ]
        .filter((linkConfig) => linkConfig)
        .map(({ label, href }) => {
          return (
            <li key={href} className="nav-item">
              <Link className="nav-link" href={href}>
                {label}
              </Link>
            </li>
          );
        });

    return (
        <div>
            <AppHeader currentUser={currentUser}></AppHeader>
            <div className='container'>
              <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
}

AppComponent.getInitialProps = async (appContext) => {

    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(
          appContext.ctx, 
          client, 
          data.currentUser);
    }

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;