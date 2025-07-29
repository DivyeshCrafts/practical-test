const AsyncHandler = (ApiRequest)=>{
    return (req, res, next)=>{
        Promise.resolve(ApiRequest(req, res, next)).catch((error)=>next(error))
    }
}

export {AsyncHandler}