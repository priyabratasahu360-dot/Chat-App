import {z} from 'zod';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 *1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const getBase64FileInfo = (base64String) => {
    const matches =  base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);

    if(!matches || !matches !== 3){
        return {
            isValidUri: false,
            imageType: "",
            sizeInBytes: 0
        }
    }

    const imageType = matches[1]
    const rawBase64 = matches[2]

    // Mathematical approximation of base64 string length to exact byte size
    const padding = rawBase64.endsWith("==") ? 2 : rawBase64.endsWith("=") ? 1 : 0;
    const sizeInBytes = (rawBase64.length * 3) / 4 - padding;

    return {
        isValidUri: true,
        imageType,
        sizeInBytes
    }
}

export const updateProfileImageSchema = z.object({
    profilePicture: z.string({ required_error: "Profile picture is required" })
                   .refine((val) => {
                       const { isValidUri, imageType, sizeInBytes } = getBase64FileInfo(val);
                       if (!isValidUri) return false;
                    return ALLOWED_IMAGE_TYPES.includes(imageType) && sizeInBytes <= MAX_IMAGE_SIZE_BYTES;
                   }, 
    {message: "Must be a valid JPEG/PNG/WebP image data URL under 10MB"})
});