declare global{
    namespace Express{
        export interface Request {
            user?:{
                id: string,
                role?: "student" | "teacher" | "admin",
            }
    }
}
}
export{}