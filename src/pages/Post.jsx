import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"

import appwriteService from "../appwrite/config"
import Button from "../components/Button"
import Container from "../components/container/Container"
import parse from "html-react-parser"
import { useDispatch, useSelector } from "react-redux"
import { fetchPosts } from '../store/postSlice'

// Function to generate slug from post title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric characters with a dash
    .replace(/(^-|-$)/g, '');     // Remove any leading or trailing dashes
}

function Post() {
  const [post, setPost] = useState(null)
  const { slug } = useParams() // Get slug from URL params
  const navigate = useNavigate() // To navigate to different pages
  const userData = useSelector((state) => state.auth.userData) // User data from redux
  const dispatch = useDispatch() // Dispatch actions for fetching posts
  const posts = useSelector(state => state.post.posts) // Posts from redux store

  // Determine if the user is the author of the post
  const isAuthor = post && userData ? post.userId === userData.$id : false

  // Fetch posts if they are not loaded yet
  useEffect(() => {
    if (posts.length === 0) {
      console.log("Fetching posts...");
      dispatch(fetchPosts())
    } else {
      console.log("Posts already available:", posts);
    }
  }, [dispatch, posts.length]);

  // Find the post by slug when the slug or posts change
  useEffect(() => {
    if (slug) {
      console.log("Searching for post with slug:", slug); // Log the current slug in the URL

      // Generate the slug for each post to compare with the URL slug
      const foundPost = posts.find(post => {
        const postSlug = generateSlug(post.title); // Slug generated from post title
        console.log("Generated post slug:", postSlug); // Log the generated slug for comparison
        return postSlug === slug;
      });

      if (foundPost) {
        setPost(foundPost);  // Set the found post to state
      } else {
        console.log("Post not found with slug:", slug);
      }
    }
  }, [slug, posts]); // Run effect when slug or posts change

  // Delete post function
  const deletePost = () => {
    if (post) {
      appwriteService.deletePost(post.$id).then((status) => {
        if (status) {
          appwriteService.deleteFile(post.featuredImage);  // Delete associated image
          navigate("/")  // Navigate back to home
        }
      })
    }
  }

  return post ? (
    <div className="py-8">
      <Container>
        <div className='w-full flex justify-center mb-4 relative border rounded-xl p-2'>
          <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className='rounded-xl' />
          {isAuthor && (
            <div className="absolute-right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">Edit</Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>Delete</Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="browser-css">
            {parse(post.content)}
          </div>
        </div>
      </Container>
    </div>
  ) : (
    <div>Loading...</div> // Show loading text if post is not available
  )
}

export default Post;
