declare global{
    namespace Express{
        export interface Request {
            user?:{
                role?: "student" | "teacher" | "admin",
            }
    }
}
}
export{}