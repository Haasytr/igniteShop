import { stripe } from '@/lib/stripe';
import { SuccessContainer, ImageContainer } from '@/styles/pages/success';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Stripe from 'stripe';

// import { Container } from './styles';

interface SuccessProps {
  customerName: string,
  product: {
    name: string,
    imageUrl: string
  }
}

const Success: React.FC = ({ customerName, product }: SuccessProps) => {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>
      <SuccessContainer>
        <h1>Compra efetuada</h1>

        <ImageContainer>
          <Image src={product.imageUrl} alt="camiseta" width={120} height={110} />
        </ImageContainer>
        <p>Uhuu <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho de sua casa</p>

        <Link href="/">
          Voltar ao catálogo
        </Link>
      </SuccessContainer>
    </>
  )
}

export default Success;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.sessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details.name
  const product = session.line_items.data[0].price.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0]
      }
    }
  }
}