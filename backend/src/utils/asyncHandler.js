const asyncHandler = (fn) => async(req,res,next)=>{
    try{
        await fn(req,res,next);
    }catch(error){
        res.status(500).json({
            success: false,
            // statusCode : error.statusCode,
            message: error.message,
            errorName : error.name,
        })
    }
}

export default asyncHandler;
