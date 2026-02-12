import { auth } from "@/auth"

export default auth((req) => {
    // Мұнда қосымша логика жазуға болады, мысалы:
    // Егер қолданушы кірмеген болса, Dashboard-қа жібермеу
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/auth', req.nextUrl))
    }
})

// Middleware қай беттерде жұмыс істеу керек екенін көрсетеміз
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}