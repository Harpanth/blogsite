import React, { useEffect, useState } from 'react'
import Container from '../components/container/Container'
import PostForm from '../components/post-form/PostForm'
import appwriteService from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

function EditPost() {
    const [post,setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()
    const posts = useSelector(state => state.post.posts)
    useEffect(()=> {
        if(slug){
            appwriteService.getPost(slug).then((post)=> {
                if(post){
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    },[slug, navigate])

  return post ? (
    <div className="py-8">
        <Container>
            <PostForm post={post}/>
        </Container>
    </div>
  ) : null
}

export default EditPost

