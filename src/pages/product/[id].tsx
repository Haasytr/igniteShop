import { stripe } from '@/lib/stripe';
import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product';
import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import path from 'path';
import React from 'react';
import Stripe from 'stripe';

// import { Container } from './styles';

interface ProductProps {
  product: {
    id: string,
    name: string,
    image_url: string,
    price: string,
    description: string,
    defaultPriceId: string,
  }
}

const Product: React.FC = ({ product }: ProductProps) => {
  async function handleBuyProduct() {
    try {
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (err) {
      alert('Falha dog')
    }
  }

  const { query, isFallback } = useRouter()

  if (isFallback) {
    return <p>loading...</p>
  }


  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.image_url} width={520} height={480} alt="" />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>
          <button onClick={handleBuyProduct}>Comprar agora</button>
        </ProductDetails>
      </ProductContainer>
    </>

  )
}

export default Product;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_NKKEU4zMNuwNKo' } }
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        image_url: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Number(price.unit_amount) / 100),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1
  }
}