import Document, { Html, Head, Main, NextScript } from 'next/document';

class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          ></meta>
          <link rel="icon" href="/favicon.svg" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link rel="manifest" href="/manifest.json"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Raleway:ital,wght@1,900&display=swap"
            rel="preload"
            as="style"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Raleway:ital,wght@1,900&display=swap"
            rel="stylesheet"
            media="print"
            onLoad="this.media='all'"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
