import './globals.css'

export const metadata = {
  title: 'Movie App',
  description: 'Generated by Next.js',
  keywords: 'movies, nextjs, reactjs',
  icon: 'tmdb_logo.svg',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <link rel="icon" href="/tmdb_logo.svg" />
      <body>{children}</body>
    </html>
  )
}
