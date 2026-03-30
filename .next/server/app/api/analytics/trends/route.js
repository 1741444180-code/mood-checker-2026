"use strict";(()=>{var e={};e.id=3962,e.ids=[3962],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61212:e=>{e.exports=require("async_hooks")},61282:e=>{e.exports=require("child_process")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},20629:e=>{e.exports=require("fs/promises")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},74175:e=>{e.exports=require("tty")},21764:e=>{e.exports=require("util")},45018:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>D,patchFetch:()=>x,requestAsyncStorage:()=>y,routeModule:()=>w,serverHooks:()=>E,staticGenerationAsyncStorage:()=>T});var a={};r.r(a),r.d(a,{GET:()=>h});var o=r(49303),n=r(88716),s=r(60670),d=r(87070),i=r(13538);let u=null,c=!!process.env.REDIS_URL;async function l(){if(!c)return null;if(u)return u;try{return u=new(r(Object(function(){var e=Error("Cannot find module 'ioredis'");throw e.code="MODULE_NOT_FOUND",e}())))(process.env.REDIS_URL)}catch(e){return console.error("Failed to connect to Redis:",e),null}}let p={HOT:300,AGG:1800},m=new Map;async function h(e){let t=Date.now();try{let r=e.nextUrl.searchParams,a=r.get("userId"),o=parseInt(r.get("days")||"30",10),n=r.get("granularity")||"day",s="true"===r.get("forceRefresh");if(!a)return d.NextResponse.json({error:"userId is required"},{status:400});if(o<1||o>365)return d.NextResponse.json({error:"days must be between 1 and 365"},{status:400});if(!["day","week","month"].includes(n))return d.NextResponse.json({error:"granularity must be day, week, or month"},{status:400});let i=`analytics:trends:${a}:${n}:${o}`,u="day"===n?p.HOT:p.AGG;if(!s&&c){let e=await l();if(e){let t=await e.get(i);if(t){let e=JSON.parse(t);return console.log(`[Trends API] Cache hit (Redis): ${i}`),d.NextResponse.json(e)}}}if(!s){let e=m.get(i);if(e&&Date.now()-e.timestamp<1e3*u)return console.log(`[Trends API] Cache hit (Memory): ${i}`),d.NextResponse.json(e.data)}let h=new Date;h.setHours(23,59,59,999);let R=new Date;R.setDate(R.getDate()-o+1),R.setHours(0,0,0,0);let w=[],y=(w="day"===n?await f(a,R,h):"week"===n?await A(a,R,h):await g(a,R,h)).filter(e=>e.count>0).map(e=>e.mood),T={average:y.length>0?Math.round(y.reduce((e,t)=>e+t,0)/y.length*100)/100:0,min:y.length>0?Math.min(...y):0,max:y.length>0?Math.max(...y):0,trend:function(e){let t=e.filter(e=>e.count>0);if(t.length<2)return"stable";let r=t.slice(-7),a=t.slice(-14,-7);if(0===a.length)return"stable";let o=r.reduce((e,t)=>e+t.mood,0)/r.length-a.reduce((e,t)=>e+t.mood,0)/a.length;return o>.2?"up":o<-.2?"down":"stable"}(w)},E={data:w,period:{start:R.toISOString().split("T")[0],end:h.toISOString().split("T")[0],days:o},statistics:T};if(c){let e=await l();if(e)try{await e.setex(i,u,JSON.stringify(E)),console.log(`[Trends API] Cached to Redis: ${i}`)}catch(e){console.error("Failed to cache to Redis:",e)}}m.set(i,{data:E,timestamp:Date.now()});let D=Date.now()-t;console.log(`[Trends API] Response time: ${D}ms`);let x=d.NextResponse.json(E);return x.headers.set("X-Response-Time",`${D}ms`),x.headers.set("X-Cache-Source","miss"),x}catch(e){return console.error("[Trends API] Error:",e),d.NextResponse.json({error:"Failed to fetch trend data",message:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function f(e,t,r){return R(await i._.$queryRaw`
    SELECT 
      DATE("createdAt") as date,
      AVG("mood") as mood,
      COUNT(*) as count
    FROM "CheckIn"
    WHERE "userId" = ${e}
      AND "createdAt" >= ${t}
      AND "createdAt" <= ${r}
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt") ASC
  `,t,r,"day")}async function A(e,t,r){return R(await i._.$queryRaw`
    SELECT 
      DATE("createdAt", 'weekday 0') as date,
      AVG("mood") as mood,
      COUNT(*) as count
    FROM "CheckIn"
    WHERE "userId" = ${e}
      AND "createdAt" >= ${t}
      AND "createdAt" <= ${r}
    GROUP BY DATE("createdAt", 'weekday 0')
    ORDER BY DATE("createdAt", 'weekday 0') ASC
  `,t,r,"week")}async function g(e,t,r){return R(await i._.$queryRaw`
    SELECT 
      STRFTIME('%Y-%m-01', "createdAt") as date,
      AVG("mood") as mood,
      COUNT(*) as count
    FROM "CheckIn"
    WHERE "userId" = ${e}
      AND "createdAt" >= ${t}
      AND "createdAt" <= ${r}
    GROUP BY STRFTIME('%Y-%m-01', "createdAt")
    ORDER BY STRFTIME('%Y-%m-01', "createdAt") ASC
  `,t,r,"month")}function R(e,t,r,a){let o=new Map;e.forEach(e=>{let t=e.date instanceof Date?e.date.toISOString().split("T")[0]:e.date;o.set(t,{mood:Math.round(100*Number(e.mood))/100,count:Number(e.count)})});let n=[];if("day"===a)for(let e=new Date(t);e<=r;e.setDate(e.getDate()+1)){let t=e.toISOString().split("T")[0],r=o.get(t);n.push({date:t,mood:r?.mood??0,count:r?.count??0})}else"week"===a?e.forEach(e=>{let t=e.date instanceof Date?e.date.toISOString().split("T")[0]:e.date;n.push({date:t,mood:Math.round(100*Number(e.mood))/100,count:Number(e.count)})}):e.forEach(e=>{let t=e.date instanceof Date?e.date.toISOString().split("T")[0]:e.date;n.push({date:t,mood:Math.round(100*Number(e.mood))/100,count:Number(e.count)})});for(let e=1;e<n.length;e++)n[e].count>0&&n[e-1].count>0&&(n[e].moodChange=Math.round((n[e].mood-n[e-1].mood)*100)/100);return n}let w=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/analytics/trends/route",pathname:"/api/analytics/trends",filename:"route",bundlePath:"app/api/analytics/trends/route"},resolvedPagePath:"/Users/lijianquan/.openclaw/workspace/projects/mood-checker/src/app/api/analytics/trends/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:y,staticGenerationAsyncStorage:T,serverHooks:E}=w,D="/api/analytics/trends/route";function x(){return(0,s.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:T})}},13538:(e,t,r)=>{r.d(t,{Z:()=>n,_:()=>o});var a=r(50);let o=globalThis.prisma??new a.PrismaClient,n=o}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[8948,6883,7070],()=>r(45018));module.exports=a})();