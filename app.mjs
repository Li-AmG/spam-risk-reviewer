import { normalizePolicy, reviewSpamRisk } from './core.mjs';
import { scenarios, scenarioInputs } from './scenarios.mjs';
import { reviewSummary } from './summary.mjs';
const $ = id => document.getElementById(id);
const form = $('review-form');
const card = document.querySelector('.result-card');
let report = null;
function resetResult(edited=false) {
  report=null;
  delete card.dataset.state;
  $('status-pill').textContent=edited?'CHECK NEEDED':'NOT CHECKED';
  $('result-title').textContent=edited?'Ready for a fresh check.':'Ready when you are.';
  $('result-description').textContent=edited?'Your inputs have changed. Check the campaign to see an updated result.':'Add your campaign details, or load an example to see how the review works.';
  $('result-icon').textContent='◎';
  $('blockers').replaceChildren();
  $('result-stats').hidden=true;
  $('result-details').hidden=true;
  $('json-output').textContent='';
  $('copy-summary').textContent='Copy summary';
}
function clearErrors(){ $('form-error').hidden=true; for(const el of form.querySelectorAll('[aria-invalid]'))el.removeAttribute('aria-invalid'); }
for (const [key,id] of [['low','low-example'],['launch','launch-example'],['wording','wording-example'],['reactivation','reactivation-example'],['high','high-example']]) {
  $(id).addEventListener('click',()=>{ for(const [field,value] of Object.entries(scenarios[key].fields)) $(field).value=value; clearErrors(); resetResult(true); });
}
form.addEventListener('input',()=>{clearErrors();resetResult(true);});
form.addEventListener('change',()=>{clearErrors();resetResult(true);});
form.addEventListener('reset',()=>{clearErrors();resetResult();});
function validationMessage(el){
  const label=document.querySelector(`label[for="${el.id}"]`).textContent;
  if(!el.value.trim())return `${label}: Please enter a value.`;
  if(el.validity.typeMismatch)return `${label}: Enter a valid email address.`;
  if(el.validity.rangeUnderflow)return `${label}: Use ${el.min} or more.`;
  if(el.validity.rangeOverflow)return `${label}: Use ${el.max} or less.`;
  if(el.validity.stepMismatch)return `${label}: Enter a whole number.`;
  if(el.validity.tooLong)return `${label}: Keep this under ${el.maxLength} characters.`;
  return `${label}: Check this value.`;
}
function validate(){
  const errors=[];
  for(const el of form.querySelectorAll('input,textarea')) {
    if(!el.checkValidity() || !el.value.trim()) {
      el.setAttribute('aria-invalid','true');
      errors.push(validationMessage(el));
    }
  }
  return errors;
}
function friendly(reason) {
  if(reason==='SPF did not pass'||reason==='DKIM did not pass'||reason==='DMARC did not pass')return `${reason.split(' ')[0]}: ${$(reason.split(' ')[0].toLowerCase()).value==='unknown'?'result is unknown':'reported as failed'}. Confirm a passing result with your email provider.`;
  if(reason.startsWith('bounce_rate'))return `Bounce rate is ${$('bounce').value}%, above the 2% limit.`;
  if(reason.startsWith('complaint_rate'))return `Complaint rate is ${$('complaint').value}%, above the 0.1% limit.`;
  if(reason.startsWith('list freshness'))return `List age is ${$('freshness').value} days, above the 90-day limit.`;
  if(reason.startsWith('warm_up_days'))return `Sender warm-up is ${$('warmup').value} days. The rule requires at least 14.`;
  if(reason.startsWith('content risk flag:'))return `Wording to review: ${reason.slice('content risk flag: '.length)}.`;
  return reason;
}
form.addEventListener('submit',event=>{
  event.preventDefault(); clearErrors(); resetResult();
  const errors=validate();
  if(errors.length){$('form-error').textContent=errors.join(' ');$('form-error').hidden=false;form.querySelector('[aria-invalid=true]').focus();return;}
  const fields={sender:$('sender').value.trim(),subject:$('subject').value.trim(),summary:$('summary').value.trim(),size:Number($('size').value),freshness:Number($('freshness').value),bounce:Number($('bounce').value),complaint:Number($('complaint').value),warmup:Number($('warmup').value),spf:$('spf').value,dkim:$('dkim').value,dmarc:$('dmarc').value};
  const inputs=scenarioInputs(fields);
  const policy=normalizePolicy();
  const verdict=reviewSpamRisk(inputs,policy);
  const messages=verdict.blockers.map(friendly);
  report={schema:'spam-risk-reviewer.web-demo.v1',reviewed_at:new Date().toISOString(),mode:'local-rule-check',inputs,reported_auth_status:{spf:$('spf').value,dkim:$('dkim').value,dmarc:$('dmarc').value},policy,verdict,review_notes:messages,limitations:['Caller-provided signals; no independent authentication verification.','Simple keyword checks, not a complete spam or security assessment.','No sending authorization or inbox delivery guarantee.']};
  card.dataset.state=verdict.risk_level;
  const states={pass:['RULES PASSED','No blockers in these inputs.','The supplied signals meet these rules. Confirm consent, content, and your sending provider’s requirements before taking action.','✓'],hold:['HOLD FOR REVIEW','A few things need attention.','Review the items below before moving this campaign forward. These findings are based on the values you supplied.','!'],review:['REVIEW NEEDED','Take another look.','Some inputs need human review before moving this campaign forward.','!']};
  const [pill,title,description,icon]=states[verdict.risk_level];
  $('status-pill').textContent=pill;$('result-title').textContent=title;$('result-description').textContent=description;$('result-icon').textContent=icon;
  $('blocker-count').textContent=messages.length;$('blocker-label').textContent=messages.length===1?'item to review':'items to review';$('result-stats').hidden=false;
  for(const message of messages){const li=document.createElement('li');li.textContent=message;$('blockers').append(li);}
  $('json-output').textContent=JSON.stringify(report,null,2);$('result-details').hidden=false;
  if(window.innerWidth<850)card.scrollIntoView({behavior:'smooth',block:'start'});
});
$('download').addEventListener('click',()=>{
  if(!report)return;
  const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)+'\n'],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='spam-risk-review.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('copy-summary').addEventListener('click',async()=>{
  if(!report)return;
  const text=reviewSummary(report);
  try {
    await navigator.clipboard.writeText(text);
    $('copy-summary').textContent='Copied';
    setTimeout(()=>$('copy-summary').textContent='Copy summary',1500);
  } catch {
    window.prompt('Copy this review summary:',text);
  }
});
