import Head from 'next/head'

import DefaultLayout from '~/components/Layouts/Default'
import PacmanGame from '~/components/Pacman'

export default function Pacman() {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <DefaultLayout>
        <PacmanGame />
      </DefaultLayout>
    </>
  )
}
