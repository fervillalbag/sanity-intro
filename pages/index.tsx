import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'

import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface HomeIprops {
  posts: [Post]
}

const Home: React.FC<HomeIprops> = ({ posts }) => {
  console.log(posts)

  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Sanity</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex justify-between border border-black border-y-white bg-yellow-400 py-10">
        <div className="space-y-5 px-10">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="underline decoration-4 underline-offset-2">
              Medium
            </span>{' '}
            is a place to write, read and connect
          </h1>
          <h2 className="">
            It's easy and free to post your thinking on any topic and connect
            with millions of readers
          </h2>
        </div>

        <div className="pr-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Medium_logo_Monogram.svg/1200px-Medium_logo_Monogram.svg.png"
            className="hidden w-24 object-contain sm:block lg:w-32"
            alt=""
          />
        </div>
      </div>

      {/* Post */}
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-6 md:gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer overflow-hidden rounded-lg border">
              <img
                src={urlFor(post.mainImage).url()!}
                alt={post.title}
                className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
              />

              <div className="flex justify-between bg-white p-5">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="mt-1 text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>

                <img
                  src={urlFor(post.author.image).url()!}
                  alt=""
                  className="h-12 w-12 rounded-full"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `
    *[_type == 'post'] {
      _id,
      title,
      slug,
      author -> {
        name,
        image
      },
      body,
      description,
      mainImage
    }
  `
  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}

export default Home
