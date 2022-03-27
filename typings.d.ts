export interface Post {
  _id: string
  _createdAt: string
  title: string
  author: {
    name: string
    image: string
  }
  description: string
  slug: {
    current: string
  }
  mainImage: {
    asset: {
      _ref: string
    }
  }
  body: [object]
}
