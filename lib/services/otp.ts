import redis from "@/db/redis";



export async function createAndStoreOTP(email: string, otp: Number, length: number = 6, expiry: number = 300): Promise<string> {
    await redis.set(`otp:${email}`, String(otp), { EX: expiry }); // Store OTP with expiry time
    return String(otp);
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = await redis.get(`otp:${email}`);
    if (storedOTP === otp) {
        await redis.del(`otp:${email}`); // OTP is valid, delete it after verification
        return true;
    }
    return false;
}