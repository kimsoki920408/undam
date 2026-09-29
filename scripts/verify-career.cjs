const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname,'..'));
const ts = require(path.join(root,'node_modules/typescript'));
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file,module);
  const code = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, {filename:file})((name) => {
    if(name === 'server-only') return {};
    if(name.startsWith('@/')) return load(path.join(root,name.slice(2)+'.ts'));
    if(name.startsWith('.')) return load(path.resolve(path.dirname(file),name+'.ts'));
    return require(name);
  },module,module.exports);
  return module.exports;
}
const { buildCareerSignals } = load(root+'/lib/fortune/build-career-signals.ts');
const { createCareerNarrative, normalizeCareerSignals } = load(root+'/lib/ai/career-narrative.ts');
const { generateCareerNarrative, validateCareerResponse } = load(root+'/lib/ai/career-provider.ts');
const { generatePaidFortune } = load(root+'/lib/ai/generate-paid-fortune.ts');
const gods = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'];
const input = { nickname:'검수용', birthDate:'1990-01-01', birthTimeMode:'exact', birthTime:'12:00', birthShichen:null, calendarType:'solar', isLeapMonth:false, gender:'male', birthRegion:'서울' };
function fixture(element='목', stem='비견', branch='편재') {
  return {
    dayMaster:{korean:{목:'갑',화:'병',토:'무',금:'경',수:'임'}[element],hanja:{목:'甲',화:'丙',토:'戊',금:'庚',수:'壬'}[element],element,yinYang:'양'},
    fiveElements:{목:3,화:1,토:2,금:1,수:1,total:8},
    tenGods:{month:{stem,branch}},
    majorLuck:{direction:'순행',precision:'approximate',startAge:9,pillars:['을사','병오','정미','무신','기유'].map((korean,i)=>({age:9+i*10,korean,hanja:['乙巳','丙午','丁未','戊申','己酉'][i]}))},
  };
}
(async()=>{
  process.env.CAREER_AI_PROVIDER='rules';
  let count=0, minimum=Infinity;
  const variants = new Set();
  for(const element of ['목','화','토','금','수']) for(const stem of gods) for(const branch of gods) {
    const result = await generatePaidFortune({productCode:'career',input,calculation:fixture(element,stem,branch)});
    assert.equal(result.version,'paid-career-rule-0.4.0');
    assert.equal(result.sections.length,10);
    assert.equal(new Set(result.sections.map(s=>s.id)).size,10);
    for(const section of result.sections) {
      assert.equal(section.content.length,3);
      assert.ok(section.content.join('').length >= 390,`${section.id} too short`);
      assert.equal(new Set(section.content).size,3);
    }
    const length=result.sections.flatMap(s=>s.content).join('').length;
    minimum=Math.min(minimum,length);
    variants.add(JSON.stringify(result.sections)); count++;
  }
  assert.equal(variants.size,500);
  const base=fixture();
  const signals=buildCareerSignals(base);
  for(const precision of ['exact','approximate','sequence-only','unknown']) {
    const changed=structuredClone(signals); changed.majorLuck.precision=precision;
    const text=JSON.stringify(createCareerNarrative(changed).find(s=>s.id==='career-major-luck'));
    if(['sequence-only','unknown'].includes(precision)) assert.doesNotMatch(text,/\d+세/);
  }
  for(const startAge of [null,NaN,-1]) {
    const changed=structuredClone(signals); changed.majorLuck.startAge=startAge;
    assert.doesNotMatch(JSON.stringify(createCareerNarrative(changed).find(s=>s.id==='career-major-luck')),/\d+세/);
  }
  const missing=fixture(); missing.majorLuck=null; missing.tenGods.month=null;
  const missingResult=await generatePaidFortune({productCode:'career',input,calculation:missing});
  assert.match(missingResult.sections[6].content.join(''),/정보가 없습니다/);
  const equal=fixture(); equal.fiveElements={목:1,화:1,토:1,금:1,수:1,total:5};
  assert.match(createCareerNarrative(buildCareerSignals(equal))[1].content.join(''),/서열을 붙이지/);
  const full=await generatePaidFortune({productCode:'full_saju',input,calculation:base});
  assert.equal(full.sections.length,16);
  assert.equal(new Set(full.sections.map(s=>s.id)).size,16);
  const before=process.argv[3];
  if(before) {
    const old=load(before);
    for(const productCode of ['wealth','love']) {
      const a=await old.generatePaidFortune({productCode,input,calculation:base});
      const b=await generatePaidFortune({productCode,input,calculation:base});
      delete a.generatedAt; delete b.generatedAt; assert.deepEqual(a,b);
    }
    const oldFull=await old.generatePaidFortune({productCode:'full_saju',input,calculation:base});
    assert.deepEqual(full.sections.slice(0,6),oldFull.sections.slice(0,6));
  }
  const normalized=normalizeCareerSignals(signals);
  const draft=createCareerNarrative(normalized);
  const valid={sections:draft.map(s=>({id:s.id,summary:s.summary.length>=20?s.summary:s.summary+' — 실제 업무에서 확인할 방향입니다',content:s.content.map((p,i)=>p.length>=150?p:p+` 이 문단의 점검 ${i+1}을 실제 경험에 적용할 때에는 결과를 먼저 기록하고, 상대가 필요로 하는 변화가 무엇인지 확인해 다음 행동을 정리해보세요.`),basisIds:normalized.signals.filter(sig=>s.basis.some(b=>b.label===sig.label&&b.value===sig.value)).map(sig=>sig.id)}))};
  valid.sections[1].content = valid.sections[1].content.map(p=>p.replace(/신강·신약, 용신/g,'종합적인 균형'));
  // This is a provider transport/validation fixture, not a live model quality evaluation.
  validateCareerResponse(valid,normalized,draft);
  const fail = (change) => { const v=structuredClone(valid); change(v); assert.throws(()=>validateCareerResponse(v,normalized,draft)); };
  fail(v=>v.sections.pop()); fail(v=>v.sections[1].id=v.sections[0].id);
  fail(v=>v.sections[0].content[0]='짧음'); fail(v=>v.sections[0].basisIds=['fake']);
  fail(v=>v.sections[0].content[0]+=' 39세에 반드시 성공합니다.');
  fail(v=>v.sections[0].content[0]+=' 용신이 당신을 돕습니다.');
  fail(v=>v.sections[0].content[0]+=' 정관의 기운입니다.');
  fail(v=>v.sections[0].content[1]=v.sections[0].content[0]);
  const realFetch=global.fetch;
  process.env.CAREER_AI_PROVIDER='openai';process.env.OPENAI_API_KEY='test-key-not-real';process.env.CAREER_AI_MODEL='test-model';
  global.fetch=async(url,options)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    const body=JSON.parse(options.body);
    assert.equal(body.store,false); assert.equal(body.text.format.strict,true);
    assert.ok(!body.input.includes(input.nickname)); assert.ok(!body.input.includes(input.birthDate));
    return {ok:true,json:async()=>({status:'completed',output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:JSON.stringify(valid)}]}]})};
  };
  const ai=await generateCareerNarrative(signals);
  assert.equal(ai.version,'paid-career-ai-1.0.0'); assert.deepEqual(ai.sections[6],draft[6]);
  assert.deepEqual(ai.sections[0].basis,draft[0].basis);
  for(const response of [
    {ok:false,status:429},
    {ok:true,json:async()=>({status:'incomplete',output:[]})},
    {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'no'}]}]})},
    {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'invalid'}]}]})},
  ]) { global.fetch=async()=>response; await assert.rejects(generateCareerNarrative(signals),/다시 시도/); }
  global.fetch=async()=>{throw Error('timeout private diagnostic')};
  await assert.rejects(generateCareerNarrative(signals),/다시 시도/);
  delete process.env.CAREER_AI_MODEL;
  await assert.rejects(generateCareerNarrative(signals),/서버 설정/);
  global.fetch=realFetch;process.env.CAREER_AI_PROVIDER='rules';delete process.env.OPENAI_API_KEY;
  const sample=await generatePaidFortune({productCode:'career',input,calculation:base});
  if(process.env.CAREER_SAMPLE_PATH) fs.writeFileSync(process.env.CAREER_SAMPLE_PATH,JSON.stringify(sample,null,2));
  console.log(JSON.stringify({passed:true,combinations:count,distinctNarratives:variants.size,minimumBodyCharacters:minimum,regressionCompared:!!before,provider:'mocked; no live key',edgeCases:'missing/tied/unknown timing, schema, grounding, duplicate, refusal, HTTP, incomplete, timeout'},null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
