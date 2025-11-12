import {body, param, query, validationResult} from "express-validator"

export const validate = (validations) => {
    return async (req, res, next) => {
        //run all validation
        await Promise.all(validations.map(validation.run(req)))

        const errors = validationResult(req)
        if(errors.isEmpty()){
            return next()
        }

        const extractedError = errors.array().map(arr => ({
            field: err.path,
            message: err.msg
        }))

        throw new Error("validation error");
    }
}

export const commonValidations = {
    pagination: [
        query('page')
            .optional()
            .isInt({min: 1})
            .withMessage('page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({min: 1, max: 100})
            .withMessage('limit must be a between 1 and 100'),
    ],
    email:
      body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
      name: body('name')
        .trim()
        .isLength({ min: 2, max: 50})
        .withMessage("please provide a valid name"),
};

export const validateSignUp = validate([commonValidations.email, commonValidations.name]);