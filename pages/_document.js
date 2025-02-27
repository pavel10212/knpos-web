import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* This script suppresses hydration warnings from browser extensions like Grammarly */}
        <Script id="suppress-hydration-warnings" strategy="afterInteractive">
          {`
            (function() {
              // List of attributes added by browser extensions that cause hydration mismatches
              const attributesToSuppress = [
                'data-new-gr-c-s-check-loaded',
                'data-gr-ext-installed'
              ];
              
              const originalConsoleError = console.error;
              console.error = function(msg, ...args) {
                // Check if this is a hydration error related to browser extensions
                if (typeof msg === 'string' && 
                    msg.includes('did not match') && 
                    attributesToSuppress.some(attr => msg.includes(attr))) {
                  // Suppress the error
                  return;
                }
                // Otherwise, pass through to original console.error
                return originalConsoleError.apply(console, [msg, ...args]);
              };
            })();
          `}
        </Script>
      </body>
    </Html>
  )
}
