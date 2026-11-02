import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Start</h1>
      <Link href="/old" id="go-old">Go to /old (redirects to /new in next.config.js)</Link>
    </main>
  )
}
