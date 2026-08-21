import{runMediaPipeline}from'./core.mjs';
import{lfPrinterProject}from'./projects/lf-printer.mjs';

const values=process.argv.slice(2),value=name=>values.find(item=>item.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const projects=new Map([[lfPrinterProject.id,lfPrinterProject]]),projectId=value('project')??'lf-printer',project=projects.get(projectId);
if(!project)throw new Error(`Proyecto Media Pipeline desconocido: ${projectId}`);
await runMediaPipeline(project,{processExternal:values.includes('--process-external'),reviewExisting:values.includes('--review-existing'),assetId:value('id'),approve:value('approve')});
