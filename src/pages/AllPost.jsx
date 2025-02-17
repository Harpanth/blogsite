import React from 'react'
import appwriteService from "../appwrite/config"
// import { useState } from 'react'
import { useEffect } from 'react'
import Container from '../components/container/Container'
import PostCard from "../components/PostCard"
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../store/postSlice'
import { Loader2Icon } from 'lucide-react'

function AllPosts() {
    //   const [posts, setPosts] = useState([])
    const posts = useSelector(state => state.post.posts)
    const loading = useSelector(state => state.post.loading)
    const error = useSelector(state => state.post.error)

    const dispatch = useDispatch()
    useEffect(() => {

        dispatch(fetchPosts())

        // appwriteService.getPosts([]).then((posts) => {
        //   if (posts) {
        //     setPosts(posts.documents)
        //   }
        // })

    }, [dispatch])

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <h1 className='text-red-500 font-bold text-xl'>Error: {error}</h1>
            </div>
        )

    }
    //TODO: add case for array length 0
    return loading
        ? (<div className="flex justify-center items-center h-screen">
            <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
        </div>
        )
        : (
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

export default AllPosts