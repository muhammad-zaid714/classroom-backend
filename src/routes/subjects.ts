import { and, desc, eq, getTableColumns, ilike, or, sql ,} from 'drizzle-orm';
import express from 'express'
import { departments, subjects } from '../db/schema';
import { db } from '../db';
const router = express.Router();

router.get('/',async(req,res)=>{
    try {
        const {search,department,page=1,limit=10} = req.query;
        const currentPage = Math.max(1,+page);
        const limitPerPage = Math.max(1,+limit);
        const offset = (currentPage-1)*limitPerPage;

        const filterConditions = [];

        if(search){
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}`),
                    ilike(subjects.code, `%${search}%`)
                )
            )
        }

        if(department){
            filterConditions.push(
                ilike(departments.name, `%${department}%`)
            )
        }
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;
        const countResult = await db.select({count:sql<number>`count(*)`})
        .from(subjects)
        .leftJoin(departments,eq(subjects.departmentId,departments.dept_id))
        .where(whereClause)
        const totalCount = countResult[0]?.count ?? 0;
        const subjectList = await db.select({
            ...getTableColumns(subjects),
            department:{...getTableColumns(departments)}
        }).from(subjects).leftJoin(departments,eq(subjects.departmentId,departments.dept_id))
        .where(whereClause)
        .orderBy(desc(subjects.created_at))
        .limit(limitPerPage)
        .offset(offset)
        
        res.status(200).json({
            data:subjectList,
            pagination: {
                total:totalCount,
                page:currentPage,
                limit:limitPerPage,
                totalCount:Math.ceil(totalCount/limitPerPage)
            }
        });
    } catch (error) {
        console.error(`Get /subjects error:${error}`);
        res.status(500).json({message:`Failed to fetch subjects`})
    }
})
export default router;