import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '.././Button'
import Input from '.././Input'
import Logo from '.././Logo'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RTE from '../RTE'

function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValue } = useForm({
        defaultValues: {
            tite: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

            if (file) {
                appwriteService.deleteFile(post.featuredImage)
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined
            })

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0])

            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id
                })
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '-')
                .replace(/\s/g, "-")
        return ""
    }, [])

    useEffect(() => {
        //  value is an object from  react hook form 
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue('slug', slugTransform(value.tite, { shouldValidate: true }))
            }
        })

        return () => {
            subscription.unsubscribe()
        }

    }, [watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(submit)}>
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
                        setValue("slug", slugTransform(e.currentTarget.value), { required: true })
                    }}
                />
                <RTE
                    label="content"
                    name="content"
                    control={control}
                    defaultValues={getValue("content")}
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
                        <img src={appwriteSerice.getFilePreview(post.featuredImage)} alt={post.title}
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
                >{post ? "Update" : "Submit"}</Button>
            </div>
        </form>
    )
}

export default PostForm