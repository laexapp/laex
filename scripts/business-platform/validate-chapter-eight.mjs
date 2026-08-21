import { readFile } from "node:fs/promises";
const source=await readFile("tests/business-engine/chapter-seven-onboarding.test.ts","utf8"),password=source.match(/password="([^"]+)"/)?.[1];
const login=await fetch("http://localhost:3000/api/business-app/empresa-limpia-c7/session",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"owner@empresa-limpia-c7.local",password})}),setCookie=login.headers.get("set-cookie")??"",cookie=setCookie.split(";")[0];
const report=await fetch("http://localhost:3000/api/business-app/empresa-limpia-c7/reports?type=inventory&from=2026-08-01&to=2026-08-10",{headers:{cookie}});
console.log(`business_login=${login.status===200}`);console.log(`inventory_report_authorized=${report.status===200}`);console.log(`business_cookie_only=${setCookie.includes("laex_business_session=")&&!setCookie.includes("laex_control_session=")}`);
if(login.status!==200||report.status!==200)process.exitCode=1;
