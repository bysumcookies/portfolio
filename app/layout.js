import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://bytesumcookies.com'),

  title: {
    default: 'bytesumcookies | Portfolio',
    template: '%s | bytesumcookies',
  },

  description: 'Cloud security portfolio & study log.',

  openGraph: {
    title: 'bytesumcookies | Portfolio',
    description: 'Cloud security portfolio & study log.',
    url: 'https://bytesumcookies.com',
    siteName: 'bytesumcookies',
    type: 'website',

    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'bytesumcookies portfolio',
      },
    ],
  },

  icons: {
    icon: '/icon.png',
  },
}


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <footer className="border-t border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur-sm">
            <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
                <div className="text-xs text-[var(--fg-muted)]">
                  © 2026 AltOr Portfolio (Demo)
                </div>
                <div className="flex items-center gap-6 text-xs text-[var(--fg-muted)]">
                  <a
                  href="/about#contact"
                  className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
