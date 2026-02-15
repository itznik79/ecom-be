import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: Joi.ObjectSchema) { }

    transform(value: any, metadata: any) {
        console.log('JoiPipe:', metadata.type, JSON.stringify(value));
        const { error, value: validatedValue } = this.schema.validate(value, {
            abortEarly: false, // Include all errors
            stripUnknown: true, // Remove unknown fields
        });

        if (error) {
            const errorMessages = error.details.map((detail) => detail.message).join(', ');
            throw new BadRequestException(`${errorMessages}. Received: ${JSON.stringify(value)}`);
        }
        return validatedValue;
    }
}
