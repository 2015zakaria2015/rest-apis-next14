
const validate = (token: any) => {
    const validateToken =true ;
    if(!validateToken || !token) {
        return false;
    }

    return true ;

    
} ;


export function authMiddleware (req:Request) :any {
    const token = req.headers.get("authorization")?.split("")[1] ;

    return {isValid:validate(token)} ;
}