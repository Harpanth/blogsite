import React,{useState, useEffect} from 'react'
import PostCard from '../components/PostCard'
import Container from '../components/container/Container'
import appwriteService from '../appwrite/config'
function AllPost() {
    const [post,setPosts] = useState([])
    useEffect(()=> {
        appwriteService.getPost([]).then((posts)=> {
            if(posts){
                setPosts(posts.documents)
            }
        })
    },[])
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post)=> (
                    <div className="p-2 w-1/4" key={post.$id}>
                        <PostCard post={post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPost