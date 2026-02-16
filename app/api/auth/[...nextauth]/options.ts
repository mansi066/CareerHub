
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/db/mongoDb";
import UserModel from "@/models/User.Model";
import { CompanyModel } from "@/models/company/profile/CompanyBasicInfo.Model";

type Credentials = {
    email?: string;
    password?: string;
    userType?: string;
};

const buildUsername = (email: string) =>
    email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");

export const authOptions: NextAuthOptions = {
    providers: [
        // Cast to any to avoid pnpm-linked duplicate type mismatch for OAuthConfig
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }) as any,
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                userType: { label: "User Type", type: "text" },
            },
            async authorize(credentials) {
                console.log("Authorizing with credentials:", credentials);
                await dbConnect();

                const email = credentials?.email?.toLowerCase().trim();
                const password = credentials?.password || "";
                const userType = credentials?.userType || "user";

                if (!email || !password) {
                    throw new Error("Email and password are required");
                }

                let user: any;
                let accountType = "user";

                if (userType === "company") {
                    const companyUser = await CompanyModel.findOne({ email });
                    user = companyUser;
                    accountType = "company";
                } else {
                    const appUser = await UserModel.findOne({
                        $or: [
                            { email },
                            { username: email }, // allow username login by entering username in email field
                        ],
                    });
                    user = appUser;
                }

                if (!user) {
                    throw new Error("No account found for these credentials");
                }

                if (accountType === "user" && !user?.isVarified) {
                    throw new Error("Please verify your account before logging in");
                }

                if (accountType === "company" && !user?.isVerified) {
                    throw new Error("Please verify your company account before logging in");
                }

                if (!user?.password) {
                    throw new Error("Password not set. Sign in with Google or reset your password.");
                }

                const isPasswordCorrect = await bcrypt.compare(password, user.password);

                if (!isPasswordCorrect) {
                    throw new Error("Incorrect password");
                }

                return {
                    _id: user._id,
                    email: user.email,
                    username: accountType === "user" ? user.username : undefined,
                    name: user.name,
                    image: accountType === "user" ? user.image : user.image,
                    isVarified: accountType === "user" ? user.isVarified : user.isVerified,
                    accountType,
                } as any; // cast to satisfy NextAuth return shape
            },
        }),
    ],

    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();

            const email = user.email?.toLowerCase();
            if (!email) return false;

            const existingUser = await UserModel.findOne({ email });

            // If user exists (maybe created via email+password), update with Google data
            if (existingUser) {
                await UserModel.updateOne(
                    { _id: existingUser._id },
                    {
                        $set: {
                            email,
                            name: user.name || existingUser.name,
                            image: existingUser.image || user.image || "",
                            isVarified: account?.provider === "google"
                                ? Boolean(profile?.email_verified ?? true)
                                : existingUser.isVarified,
                        },
                    }
                );
                return true;
            }

            // New Google user -> create record (without role, will trigger role selection)
            await UserModel.create({
                email,
                name: user.name || "Anonymous",
                image: user.image || "",
                username: buildUsername(email),
                isVarified: Boolean(profile?.email_verified ?? true),
                role: undefined, // Don't set role - let user choose
            });

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVarified = (user as any).isVarified ?? token.isVarified;
                token.username = (user as any).username ?? token.username;
                token.name = user.name ?? token.name;
                token.email = user.email ?? token.email;
                token.image = (user as any).image ?? token.image;
                token.role = (user as any).role ?? token.role;
            }
            return token;
        },

        async session({ session, token }) {
            await dbConnect();
            const email = session.user.email;
            const accountType = token.accountType as string || "user";

            let userData: any;
            if (accountType === "company") {
                userData = await CompanyModel.findOne({ email });
                // console.log("Company user data:", userData);
            } else {
                userData = await UserModel.findOne({ email });
            }

            const mutableUser = session.user as any;

            mutableUser._id = token._id || userData?._id?.toString();
            if (accountType === "company") {
                mutableUser.isVarified = token.isVarified || userData?.isVerified;
                mutableUser.username = token.username;
                mutableUser.name = token.name || userData?.name;
                mutableUser.image = userData?.logo || token.image || "";
                mutableUser.role = token.role || undefined;
            } else {
                mutableUser.isVarified = token.isVarified || userData?.isVarified;
                mutableUser.username = token.username || userData?.username;
                mutableUser.name = token.name || userData?.name;
                mutableUser.image = userData?.image || token.image || "";
                mutableUser.role = token.role || userData?.role || undefined;
            }

            return session;
        },
    },
};