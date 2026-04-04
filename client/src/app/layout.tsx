import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Shell } from '@plutus/components/Shell';
import { FontsStyle, themeConfig } from '@plutus/components/Theme';
import { ReactQueryProvider } from '@plutus/libs/query-client';

export const metadata = { title: 'Ad Operations Billing' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <FontsStyle />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={themeConfig}>
          <ReactQueryProvider>
            <ModalsProvider>
              <Notifications position="top-right" />
              <Shell>{children}</Shell>
            </ModalsProvider>
          </ReactQueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
