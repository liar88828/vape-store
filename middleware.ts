import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { signJwt, verifyJwt } from "@/action/jwt-token";

const protectedPaths = [
    "/dashboard", '/pos', '/test', "/profile", "/settings",//
    '/products', '/inventory', '/customers',//
    '/reports',//
];
const guestOnlyPaths = [ "/login", "/register" ];

const REFRESH_THRESHOLD_SECONDS = 60 * 5; // 5 minutes before expiry, refresh token

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    if (!token) {
        // No token, handle protected routes
        if (protectedPaths.some((path) => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    const payload = await verifyJwt(token);

    const isAuthenticated = payload && typeof payload !== "string";

    // Redirect logged-in users away from login/register pages
    if (guestOnlyPaths.includes(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isAuthenticated) {
        // Invalid token
        if (protectedPaths.some((path) => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    // If token is about to expire soon, refresh it
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const exp = (payload as any).exp;

    if (exp && exp - currentTimestamp < REFRESH_THRESHOLD_SECONDS) {
        // Generate a new token with the same payload (except exp)
        const { exp, iat, ...userPayload } = payload as any; // exclude exp and iat from payload when signing new token
        const newToken = await signJwt(userPayload);

        // Create response and set updated cookie
        const response = NextResponse.next();

        response.cookies.set({
            name: "token",
            value: newToken,
            httpOnly: true,
            path: "/",
            maxAge: 60 * 15, // 15 minutes
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
