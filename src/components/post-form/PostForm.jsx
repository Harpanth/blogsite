import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../Button'
import Input from '../Input'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addPosts, updatePost } from '../../store/postSlice'
import RTE from '../RTE'
import Select from '../Select'

function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    const dispatch = useDispatch()

    // Ensure slug is always updated based on the title before submitting
    const submit = async (data) => {
        // Update slug based on title before submission
        const updatedSlug = generateSlug(data.title); // Generate slug based on title
        data.slug = updatedSlug; // Update the data object with the new slug

        if (post) {
            // Handle post update
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage); // Delete old image
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                slug: updatedSlug,  // Ensure slug is included
                featuredImage: file ? file.$id : post.featuredImage // Preserve the old image if not updated
            });

            if (dbPost) {
                dispatch(updatePost(dbPost));  // Dispatch the updated post to Redux store
                navigate(`/post/${updatedSlug}`);  // Navigate to the updated post's page using the new slug
            }
        } else {
            // Handle post creation
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                data.featuredImage = file.$id;
            }

            const dbPost = await appwriteService.createPost({
                ...data,
                userId: userData.$id,
                slug: updatedSlug  // Set the slug when creating a new post
            });

            if (dbPost) {
                dispatch(addPosts(dbPost));  // Dispatch new post to Redux store
                navigate(`/post/${dbPost.$id}`);  // Navigate to the new post
            }
        }
    }

    // Function to generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric characters with a dash
            .replace(/(^-|-$)/g, '');     // Remove any leading or trailing dashes
    }

    // Automatically update the slug when the title changes
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                const newSlug = generateSlug(value.title); // Generate new slug from title
                setValue('slug', newSlug, { shouldValidate: true }); // Set the new slug
            }
        });

        return () => {
            subscription.unsubscribe();
        }

    }, [watch, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className='w-2/3 px-2'>
                <Input
                    label="Title"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", generateSlug(e.currentTarget.value), { required: true });
                    }}
                />
                <RTE
                    label="Content"
                    name="content"
                    control={control}
                    defaultValues={getValues("content")}
                />
            </div>
            <div className='w-1/3 px-2'>
                <Input
                    label="FeaturedImage"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", "inactive")}
                />
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="width"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm;
