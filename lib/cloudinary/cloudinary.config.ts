import { ApiError } from "@/utils/ApiError";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";



type SignedUploadOptions = {
    folder?: string;
    uploadPreset?: string;
    resourceType?: "image" | "auto" | "video" | "raw";
};

export type SignedUploadPayload = {
    uploadUrl: string;
    cloudName: string;
    resourceType: string;
    expiresAt: number;
    fields: {
        api_key: string;
        timestamp: number;
        signature: string;
        folder?: string;
        public_id?: string;
        upload_preset?: string;
    };
};

export type CloudinaryUploadResult = {
    publicId: string;
    url: string;
    secureUrl: string;
    bytes: number;
    format?: string;
    width?: number;
    height?: number;
};

const ensureConfig = () => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new ApiError(
            500,
            "Cloudinary environment variables are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
        );
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });
};

const buildSignedUploadPayload = (options: SignedUploadOptions = {}): SignedUploadPayload => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_PRESET } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new ApiError(
            500,
            "Cloudinary environment variables are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
        );
    }

    const resourceType = options.resourceType ?? "image";
    const uploadPreset = options.uploadPreset ?? CLOUDINARY_UPLOAD_PRESET;
    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign: Record<string, string | number> = { timestamp };
    if (options.folder) paramsToSign.folder = options.folder;
    if (uploadPreset) paramsToSign.upload_preset = uploadPreset;

    const signature = cloudinary.utils.api_sign_request(paramsToSign, CLOUDINARY_API_SECRET);

    return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        cloudName: CLOUDINARY_CLOUD_NAME,
        resourceType,
        expiresAt: timestamp + 600, // 10 minutes buffer for the client to use the signature
        fields: {
            api_key: CLOUDINARY_API_KEY,
            timestamp,
            signature,
            folder: options.folder,
            upload_preset: uploadPreset,
        },
    };
};



const deleteImageByPublicId = async (imageurl: string) => {
    if (!imageurl) {
        throw new ApiError(400, "imageurl is required to delete an asset");
    }

    ensureConfig();
    const urlParts = imageurl.split("/");
    const publicIdWithExtension = urlParts.slice(7).join("/").split(".")[0];
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove file extension if present
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    if (result.result !== "ok" && result.result !== "not found") {
        throw new ApiError(500, `Failed to delete asset ${publicId}`);
    }

    return result.result;
};

export { cloudinary, deleteImageByPublicId, buildSignedUploadPayload };
