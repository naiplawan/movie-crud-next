import './globals.css'

export const metadata = {
  title: 'Movie App',
  description: 'Generated by Next.js',
  keywords: 'movies, nextjs, reactjs',
  icon: 'icons8-film-roll-32.png',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <link rel="icon" href="/icons8-film-roll-32.png" />
      <body>{children}</body>
    </html>
  )
}
