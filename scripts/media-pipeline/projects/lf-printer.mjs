import path from 'node:path';

export const lfPrinterProject={
  id:'lf-printer',
  assetKind:'printers',
  requiredAssetIds:[
    'l121','l1250','l3210','l3250','l4260','l5290','l5590',
    'wf-3820','wf-4810','wf-c4810','wf-4830','wf-4833','wf-4834','wf-7820','wf-7840',
    'xp-4105','xp-4205','l1212',
    'pixma-g2170','pixma-g3170','pixma-g4170','maxify-gx4010','imageclass-mf264dw-ii',
    'smart-tank-580','smart-tank-720','laserjet-pro-mfp-4103fdw','color-laserjet-pro-mfp-3303fdw','officejet-pro-9125e',
    'dcp-t420w','dcp-t720dw','mfc-t920dw','hl-l2405w','mfc-l3780cdw',
  ],
  externalTrialAssetIds:[
    'wf-4830',
    'wf-4833',
    'wf-4834',
    'wf-7820',
    'wf-7840',
    'xp-4105',
    'xp-4205',
    'l3250',
  ],
  minimumLongestSide:2000,
  temporaryManualPolicy:{
    minimumLongestSide:640,
    label:'Temporal manual LF-PRINTER - Pendiente de sustitucion',
    assetIds:['l1250','wf-4830','wf-4833','wf-4834','wf-4810','wf-c4810','wf-7820','wf-7840','xp-4105','xp-4205','l3250','l1212'],
  },
  paths:{
    source:path.resolve('assets/lf-printer/official-source/printers'),
    archive:path.resolve('assets/lf-printer/official-archive/printers'),
    review:path.resolve('assets/lf-printer/official-review/printers'),
    working:path.resolve('assets/lf-printer/official-work/printers'),
    published:path.resolve('public/assets/lf-printer/official/printers'),
    registry:path.resolve('assets/lf-printer/official/media-registry.json'),
  },
  renditions:[{name:'desktop',width:1600,quality:90},{name:'tablet',width:1200,quality:88},{name:'mobile',width:800,quality:86}],
};
