import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blog";
import { error } from "console";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // Validate userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    // Validate categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    // Validate blogId
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    // Find the blog with matching userId, categoryId, and blogId
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    // Check if blog exists
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found" }),
        { status: 404 }
      );
    }

    // Return the blog
    return new NextResponse(
      JSON.stringify({ blog }),
      { status: 200 }
    );

  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching blog", error: error.message }),
      { status: 500 }
    );
  }
};


export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;
  
  try {
    const body = await request.json();
    const {title , description} =body ;
    const {searchParams } = new URL(request.url) ;
    const userId = searchParams.get("userId") ;

    if(!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message : "Invalid or missing userId"}) ,
        {status :400}
      )
    }

    if(!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or misssing blogId"}) ,
        {status :400}
      )
    }
    
    await connect();

    const user = await User.findById(userId);
    if(!user) {
      return new NextResponse(JSON.stringify({message: "User not found"}) , {
        status:404,
      })
    }
    const blog = await Blog.findOne({_id:blogId ,user:userId});

    if(!blog) {
      return new NextResponse(JSON.stringify({message: "Blog not found"}) , {
        status:404,
      })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId ,
      {title ,description} ,
      {new :true}
    );

    return new NextResponse(
      JSON.stringify({message:"Blog updated" ,blog:updatedBlog}),
      {status:200}
    )
  } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ message: "Error updating  blog", error: error.message }),
        { status: 500 }
      );
    }
};

export const DELETE = async (request:Request ,context : {params:any}) => {
  const blogId = context.params.blog ;


  try {
    const {searchParams} = new URL(request.url) ;
    const userId = searchParams.get("userId");

    if(!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing userId"}) ,
        {status:400}
      )
    }

    if(!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({message: "Invalid or missing blogId"})
      )
    }

    await connect();

    const user = await User.findById(userId) ;
    if(!user) {
      return new NextResponse(JSON.stringify({message: "User not found"}) , {
        status: 404
      })
    }

    const blog = await Blog.findById(blogId) ;
    if(!blog) {
      return new NextResponse(JSON.stringify({message : "Blog not found"}) , {
        status :404,
      })
    }

    await Blog.findByIdAndDelete(blogId) ;

    return new NextResponse(JSON.stringify({message: "Blog is deleted"}) , {
      status:200,
    })


  } catch (error :any) {
    return new NextResponse("Error in deleting  blog" + error.message ,{
      status:500 ,
    })
  }
}
