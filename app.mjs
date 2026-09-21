import { normalizePolicy, reviewSpamRisk } from './core.mjs';
const $ = id => document.getElementById(id);
const form = $('review-form');
const card = document.querySelector('.result-card');
let report = null;
const fixtures = {
  low: { sender:'newsletter@example.com', subject:'Weekly product update', summary:'Short opt-in newsletter for existing customers with unsubscribe footer.', size:4200, freshness:14, bounce:0.8, complaint:0.02, warmup:45, spf:'pass', dkim:'pass', dmarc:'pass' },
  launch: { sender:'updates@saas-example.com', subject:'New dashboard is available for your workspace', summary:'Product launch email to active trial and paid users. It explains the new dashboard, links to release notes, and keeps the standard unsubscribe footer.', size:18000, freshness:32, bounce:1.4, complaint:0.05, warmup:28, spf:'pass', dkim:'pass', dmarc:'pass' },
  reactivation: { sender:'hello@retail-example.com', subject:'We miss you - here is what changed', summary:'Reactivation email to customers who have not opened recently. The audience is older, opt-out is included, and no purchase deadline is used.', size:64000, freshness:145, bounce:3.2, complaint:0.18, warmup:21, spf:'pass', dkim:'pass', dmarc:'unknown' },
  high: { sender:'promo@example.net', subject:'URGENT discount expires tonight', summary:'Promotional blast to a stale imported list with aggressive urgency language.', size:28000, freshness:190, bounce:8.5, complaint:0.6, warmup:3, spf:'pass', dkim:'fail', dmarc:'pass' }
};
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
}
function clearErrors(){ $('form-error').hidden=true; for(const el of form.querySelectorAll('[aria-invalid]'))el.removeAttribute('aria-invalid'); }
for (const [key,id] of [['low','low-example'],['launch','launch-example'],['reactivation','reactivation-example'],['high','high-example']]) {
  $(id).addEventListener('click',()=>{ for(const [field,value] of Object.entries(fixtures[key])) $(field).value=value; clearErrors(); resetResult(true); });
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
  const inputs={
    campaign_draft:{from:$('sender').value.trim(),subject:$('subject').value.trim(),content_digest:$('summary').value.trim()},
    list_metadata:{size:Number($('size').value),bounce_rate:Number($('bounce').value)/100,complaint_rate:Number($('complaint').value)/100,freshness:Number($('freshness').value)},
    sender_auth_posture:{spf_pass:$('spf').value==='pass',dkim_pass:$('dkim').value==='pass',dmarc_pass:$('dmarc').value==='pass',warm_up_days:Number($('warmup').value)}
  };
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
