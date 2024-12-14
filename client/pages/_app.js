import 'bootstrap/dist/css/bootstrap.css';

// Overwrite default Next.js app.js file (> thin wrapper around Next screens)
// The current next screen is in Component

export default ({ Component, pageProps}) => {
    return <Component {...pageProps} />
}