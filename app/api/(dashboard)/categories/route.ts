import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";



export const GET = async (request :Request) => {
    try  {
        const  {searchParams} = new URL (request.url) ;
        const userId = searchParams.get("userId") ;


        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message : "Invalid or missing userId"}) , {
                status :400 ,
            })
        }

        await connect() ;


        const user  = await User.findById(userId) ;
        if(!user) {
            return new NextResponse(JSON.stringify({message : "User not found in the database"}) ,
            {status :400}
        )
        }

        const categories  = await Category.find({
            user : new Types.ObjectId(userId) ,
        })

        return new NextResponse(JSON.stringify(categories) , {
            status :200 ,
        })



    } catch (error :any) {
        return new NextResponse("Error in fetching categories "+error.message , {status :500})

    }
}



export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Validate userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        // Parse the request body to get the title
        const { title } = await request.json();

        // Validate title
        if (!title || typeof title !== 'string') {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing title" }),
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

        // Create a new category
        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId),
        });
        await newCategory.save();

        // Respond with success message and category details
        return new NextResponse(
            JSON.stringify({ message: "Category is created", category: newCategory }),
            { status: 201 }
        );

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Error in creating category", error: error.message }),
            { status: 500 }
        );
    }
};
