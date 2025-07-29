import Validator from 'validatorjs'

const validation = (reqBody, rulse, callback)=>{
    const validate = new Validator(reqBody, rulse)
    validate.passes(()=>callback({}, true))
    validate.fails(()=>callback(validate.errors, false))
}

export {validation}