/* ============================================================================
   DFSA — canonical knowledge catalogue (the living index)
   ----------------------------------------------------------------------------
   This file IS the archive. To add or update a knowledge product, append/edit
   an entry below and commit — every index view rebuilds from it automatically.
   The Archive & Index page also lets you capture entries in-browser and EXPORT
   a refreshed version of this file (drafts are held in localStorage until then).

   Entry schema
   ------------
   {
     id:       unique slug (kebab-case)
     title:    display name
     summary:  one or two sentences
     type:     'framework' | 'module' | 'programme' | 'case' | 'tool'
               | 'story' | 'policy' | 'dataset'
     pillars:  array of pillar ids — coordination | assessment | production
               | gender | monitoring | knowledge | finance
     source:   how it ENTERED the archive —
               'direct'   = direct technical input
               'reference'= reference file shared
               'exchange' = Regional Exchange Mechanism (REM)
               'hub'      = external knowledge hub
     origin:   free text — who / where it came from
     status:   'validated' | 'pending'
     url:      link (relative to site root, or external)
     tags:     array of keywords
     added:    'YYYY-MM-DD'   (first archived)
     updated:  'YYYY-MM-DD'   (last revised)
   }
   ============================================================================ */

window.DRIP_ARCHIVE_META = {
  version: 1,
  updated: '2026-06-13',
  channels: {
    direct:    { label: 'Direct technical input', icon: 'keyboard',     note: 'Entered directly by the team — notes, drafts, products built in-house.' },
    reference: { label: 'Reference file shared',  icon: 'file-text',    note: 'A document or dataset shared with the platform and catalogued.' },
    exchange:  { label: 'Regional Exchange (REM)', icon: 'git-fork',    note: 'Arrived through the Regional Exchange Mechanism — country docking, CoPs, working groups.' },
    hub:       { label: 'Knowledge hub',          icon: 'database',     note: 'Pulled from a connected global / regional / national knowledge hub.' }
  },
  types: {
    framework: 'Framework', module: 'Module', programme: 'Programme', case: 'Case',
    tool: 'Tool / platform', story: 'Story', policy: 'Policy', dataset: 'Dataset'
  }
};

window.DRIP_ARCHIVE = [
  { id:'marvel', title:'MARVEL — Monitoring & Results dashboard', type:'tool', pillars:['monitoring'],
    source:'direct', origin:'DFSA / GCP MEL working group', status:'validated',
    url:'MARVEL.html',
    summary:'Monitoring, Assessment, Reporting, Verification, Evaluation and Learning — the participatory M&E architecture and live results dashboard; results flow from communities up to GEF reporting.',
    tags:['MEL','MRV','dashboard','PIR','indicators','GEB'], added:'2026-07-11', updated:'2026-07-11' },

  { id:'ilam', title:'ILAM — Integrated Landscape Assessment Methodology', type:'framework', pillars:['assessment'],
    source:'reference', origin:'FAO working paper (2024)', status:'validated',
    url:'ILAM Integrated Landscape Assessment Methodology.html',
    summary:'A five-module evidence base — from remote sensing to household surveys — that defines each landscape’s baseline and core theme.',
    tags:['assessment','remote sensing','SHARP','LDN','baseline'], added:'2024-09-12', updated:'2025-05-20' },

  { id:'drylands', title:'What are drylands? — definition, boundaries & the DFSA interpretation', type:'dataset', pillars:['assessment'],
    source:'reference', origin:'UNEP-WCMC (2007); FAO Working Paper 30 (2022)', status:'validated',
    url:'drylands.html',
    summary:'The aridity index, the four UNCCD/UNEP-WCMC zones, and why DFSA also counts the presumed drylands — with an interactive global dryland map.',
    tags:['drylands','presumed drylands','aridity index','UNEP-WCMC','UNCCD','CBD','map'], added:'2026-07-11', updated:'2026-07-11' },

  { id:'slpf', title:'SLPF — Sustainable Landscape Production Framework', type:'framework', pillars:['production'],
    source:'reference', origin:'FAO working paper (2024)', status:'validated',
    url:'SLPF Sustainable Landscape Production Framework.html',
    summary:'The integrated Farmer Field School + Community Seed Bank + green value-chain framework, contextualised per landscape via the ICDIP.',
    tags:['SLM','SFM','FFS','seed banks','value chains'], added:'2024-10-05', updated:'2025-06-01' },

  { id:'slpf-peer-learning', title:'Peer-Farmer Learning (SLPF module)', type:'module', pillars:['production'],
    source:'direct', origin:'DFSA — restructured from SLPF paper', status:'pending',
    url:'pillars/slpf/peer-farmer-learning.html',
    summary:'The experiential, farmer-to-farmer engine of the SLPF — knowledge co-created in the field, delivered through the FFS programme.',
    tags:['FFS','peer learning','capacity','extension'], added:'2026-06-13', updated:'2026-06-13' },

  { id:'slpf-ffs', title:'Farmer Field School Programme', type:'programme', pillars:['production'],
    source:'direct', origin:'DFSA — restructured from SLPF paper', status:'pending',
    url:'pillars/slpf/ffs-program.html',
    summary:'Seasonal, field-based learning cycles on demonstration plots, with partners and mid-term results. The worked example of the drill-down.',
    tags:['FFS','IIRR','demonstration plots','results'], added:'2026-06-13', updated:'2026-06-13' },

  { id:'rem', title:'REM — Regional Exchange Mechanism', type:'framework', pillars:['coordination'],
    source:'reference', origin:'GCP coordination paper', status:'validated',
    url:'REM Regional Exchange Mechanism.html',
    summary:'The bridge through which the GCP aligns plans, pools expertise and docks with the child projects.',
    tags:['coordination','docking','CoP','regional'], added:'2024-08-20', updated:'2025-04-10' },

  { id:'financial-architecture', title:'Financial architecture', type:'framework', pillars:['finance'],
    source:'reference', origin:'One-FAO finance note', status:'validated',
    url:'DSL-IP Financial Architecture.html',
    summary:'How the Programme’s funds and fee distribution are structured across the One-FAO delivery model.',
    tags:['finance','governance','fee distribution','GEF'], added:'2025-02-14', updated:'2025-02-14' },

  { id:'when-women-lead', title:'When Women Lead', type:'story', pillars:['gender'],
    source:'exchange', origin:'CoP3 Gender (WeCaN)', status:'validated',
    url:'When Women Lead.html',
    summary:'A field story on how women’s leadership and the land’s recovery move together.',
    tags:['gender','leadership','field story','restoration'], added:'2025-03-08', updated:'2025-03-08' },

  { id:'gender-action-plan', title:'Global Gender Action Plan', type:'policy', pillars:['gender'],
    source:'reference', origin:'DSL-IP gender stream', status:'validated',
    url:'Global Gender Action Plan.html',
    summary:'The Programme’s gender-responsiveness commitments and the actions that put women’s empowerment at the centre.',
    tags:['gender','policy','inclusion','commitments'], added:'2025-03-08', updated:'2025-09-12' },

  { id:'sisteminha-ifes', title:'Sisteminha · IFES Malawi', type:'case', pillars:['production'],
    source:'exchange', origin:'Malawi child project · Embrapa', status:'validated',
    url:'Sisteminha-IFES-Malawi-DSL-IP.html',
    summary:'Integrated Food and Energy Systems in practice — the SLPF streams converging on pigeon-pea, fuelwood and nutrition.',
    tags:['IFES','Malawi','Embrapa','case'], added:'2025-07-19', updated:'2025-07-19' },

  { id:'sna-tutume', title:'Knowledge-flow Social Network Analysis (Tutume-Mosetse)', type:'case', pillars:['coordination','gender'],
    source:'exchange', origin:'Botswana child project · A. Buhrow, FAO', status:'validated',
    url:'SNA_Tutume_Mosetse.html',
    summary:'A social network analysis of two Botswana producer organizations — mapping how SLM knowledge flows, who the influencers are, and where the bottlenecks lie.',
    tags:['SNA','knowledge flow','Botswana','FFPO','gender','Gephi'], added:'2026-06-14', updated:'2026-06-14' },

  { id:'dfsm-campaign', title:'DFSM Campaign', type:'story', pillars:['knowledge'],
    source:'direct', origin:'DSL-IP communications', status:'validated',
    url:'DFSM Campaign.html',
    summary:'Dryland Forest & Sustainable Management — the Programme’s outward-facing campaign and its core messages.',
    tags:['campaign','communications','drylands','outreach'], added:'2025-10-01', updated:'2025-10-01' },

  { id:'cofo-working-group', title:'COFO Working Group on Dryland Forests & Agrosilvopastoral Systems', type:'programme', pillars:['finance'],
    source:'reference', origin:'FAO · Committee on Forestry (COFO)', status:'validated',
    url:'COFO Working Group.html',
    summary:'FAO’s intergovernmental Working Group on Dryland Forests and Agrosilvopastoral Systems — a COFO subsidiary body since 2014, and the governance mandate behind the dryland-forests agenda.',
    tags:['governance','COFO','mandate','agrosilvopastoral'], added:'2026-06-16', updated:'2026-06-16' },

  { id:'wecan', title:'WeCaN — Community of Practice for Women in Dryland Forests', type:'programme', pillars:['gender'],
    source:'reference', origin:'FAO Dryland Forestry', status:'validated',
    url:'WeCaN Community of Practice.html',
    summary:'A community of practice linking national and regional women’s networks across South–South cooperation countries — sharing best practices and carrying women’s voices to global advocacy.',
    tags:['gender','community of practice','women','advocacy'], added:'2026-06-16', updated:'2026-06-16' },

  { id:'mev-cam', title:'MEV-CAM — Making Every Voice Count for Adaptive Management', type:'programme', pillars:['monitoring'],
    source:'reference', origin:'FAO Dryland Forestry', status:'validated',
    url:'MEV-CAM Making Every Voice Count.html',
    summary:'A participatory-video approach that brings policymakers and rural communities together — letting dryland communities document and share restoration knowledge in their own voice.',
    tags:['monitoring','participatory video','community','LDN'], added:'2026-06-16', updated:'2026-06-16' }
];
