import React from 'react'
import appwriteService from "../appwrite/config"
import { useState } from 'react'
import { useEffect } from 'react'
import Container from '../components/container/Container'
import PostCard from "../components/PostCard"
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../store/postSlice'

function Home() {

  const [post, setPost] = useState([])
  const dispatch = useDispatch()
  const posts = useSelector(state => state.post.posts)
  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])
  if (posts.length === 0) {
    return (
      <div className='w-full py-8'>
      <Container>
        <div className="flex flex-wrap">
          <h1>Login to read posts</h1>
        </div>
      </Container>
    </div>
    )
  }

  return (
    <div className='w-full py-8'>
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div className="p-2 w-1/4" key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default Home