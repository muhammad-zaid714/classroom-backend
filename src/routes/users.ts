import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import express from 'express'
import { user } from '../db/schema/index.js';
import { db } from '../db/index.js';
const router = express.Router();

router.get('/',async(req,res)=>{
    try {
        const {search,role,page=1,limit=10} = req.query;
        const currentPage = Math.max(1, Number(page) || 1);
        const limitPerPage = Math.max(1, Math.min(Number(limit) || 10, 100)); // also cap max limit
        const offset = (currentPage-1)*limitPerPage;
        const filterConditions = [];

        if(search){
            filterConditions.push(
                or(
                    ilike(user.name, `%${search}%`),
                    ilike(user.email, `%${search}%`)
                )
            )
        }

        if(role){
            filterConditions.push(
                eq(user.role, String(role) as any)
            )
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;
        const countResult = await db.select({count:sql<number>`count(*)`})
        .from(user)
        .where(whereClause)
        const totalCount = countResult[0]?.count ?? 0;
        const userList = await db.select(getTableColumns(user))
        .from(user)
        .where(whereClause)
        .orderBy(desc(user.createdAt))
        .limit(limitPerPage)
        .offset(offset)
        
        res.status(200).json({
            data:userList,
            pagination: {
                total:totalCount,
                page:currentPage,
                limit:limitPerPage,
                totalPages:Math.ceil(totalCount/limitPerPage)
            }
        });
    } catch (error) {
        console.error(`Get /users error:${error}`);
        res.status(500).json({message:`Failed to fetch users`})
    }
})
export default router;
