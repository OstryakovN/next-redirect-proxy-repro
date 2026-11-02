import type { GetServerSideProps } from 'next'

type Props = { slug?: string }

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  return { props: { slug: String(params?.slug) } }
}

export default function Page({ slug }: Props) {
  return <h1 id="title">Page: {slug ?? 'EMPTY PROPS'}</h1>
}
