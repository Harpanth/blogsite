import React from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric characters with a dash
        .replace(/(^-|-$)/g, '');     // Remove any leading or trailing dashes
}

function PostCard({ $id, title, featuredImage }) {
    console.log("POSTCARD ",$id, title, featuredImage);
    return (
        <Link to={`/post/${generateSlug(title)}`}>
            <div className='w-full bg-gray-100 rounded-2xlxml p-4'>
                <div className='w-full justify-center mb-4'>
                    <img src={appwriteService.getFilePreview(featuredImage)} alt={title} />
                </div>
                <h2
                    className='text-xl'
                >{title}</h2>
            </div>
        </Link>
    )
}

export default PostCard