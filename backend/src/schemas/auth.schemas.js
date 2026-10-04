import {z} from "zod";

const nameSchema = z.string({required_error: "Name is required"})
                    .trim()
                    .min(4, "Name must be atleast 4 character long")
                    .max(70, "Name is too long");

const emailSchema = z.string({required_error: "Email is required"})
                    .trim()
                    .min(1, "Email cannot be empty")
                    .toLowerCase()
                    .pipe(z.email("Invalid email address"));

const passwordSchema = z.string({required_error: "Password is required"})
                        .trim()
                        .min(6, "Password must be atleast 6 character long")
                        .max(256, "Password is too long");

export const signupSchema = z.object({
    fullname: nameSchema,
    email: emailSchema,
    password: passwordSchema
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})