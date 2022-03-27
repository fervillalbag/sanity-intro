import React, { useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import Header from '../../components/Header'

interface BlogIprops {
  post: Post
}

interface FormIprops {
  _id: string
  name: string
  email: string
  comment: string
}

const Blog: React.FC<BlogIprops> = ({ post }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormIprops>()

  const [isSummitted, setIsSummitted] = useState<boolean>(false)

  const onSubmit: SubmitHandler<FormIprops> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setIsSummitted(true)
  }

  return (
    <main>
      <Header />

      <img
        className="h-60 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="mx-auto w-11/12 max-w-6xl">
        <h2 className="mt-10 mb-3 text-3xl">{post.title}</h2>
        <h4 className="text-gray-400">{post.description}</h4>

        <div className="mt-2 flex items-center">
          <img
            className="w-14 rounded-full border border-slate-200"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="ml-2 text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {''}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc text-slate-600">{children}</li>
              ),
            }}
          />
        </div>
      </article>

      <hr className="my-10 mx-auto max-w-lg border border-yellow-500" />

      {isSummitted ? (
        <span className="block text-xl text-green-700">Summitted</span>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input
            type="hidden"
            {...register('_id')}
            value={post._id}
            name="_id"
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name:</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow"
              type="text"
              placeholder="Fernando Villalba"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email:</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow"
              type="text"
              placeholder="fer@correo.com"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment:</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full resize-none rounded border py-2 px-3 shadow"
              rows={6}
              placeholder="Lorem ipsum.."
            />
          </label>

          <div className="mb-5">
            {errors.name && (
              <span className="block text-red-500">
                The namefield is required
              </span>
            )}
            {errors.comment && (
              <span className="block text-red-500">
                The comment is required
              </span>
            )}
            {errors.email && (
              <span className="block text-red-500">Email is required</span>
            )}
          </div>

          <button type="submit" className="rounded border py-3 shadow">
            Send
          </button>
        </form>
      )}
    </main>
  )
}

export default Blog

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `
    *[_type == 'post'] {
      _id,
      slug
    }
  `

  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `   
    *[_type == 'post' && slug.current == $slug][0] {
      _id,
      title,
      slug,
      author -> {
        name,
        image
      },
      body,
      description,
      mainImage,
      _createdAt
    }
  `

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
