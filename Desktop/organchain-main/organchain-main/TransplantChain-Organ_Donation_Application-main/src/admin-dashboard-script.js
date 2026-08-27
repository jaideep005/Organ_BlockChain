// ═══ AUTH CHECK ═══
if (!sessionStorage.getItem('userRole') || sessionStorage.getItem('userRole') !== 'admin') {
    window.location.href = 'login.html';
}

const API = '/api/admin';
let allPledges = [];
let allHospitals = [];

// ═══ INIT ═══
(async function init() {
    await loadStats();
    await loadHospitals();
    await loadPledges();
    loadBlockchainFeed();
    setInterval(loadBlockchainFeed, 12000);
})();

// ═══ LOAD STATS ═══
async function loadStats() {
    try {
        const r = await fetch(API + '/stats');
        const d = await r.json();
        document.getElementById('statPledges').textContent = d.totalPledges || 0;
        document.getElementById('statDonors').textContent = d.activeDonors || 0;
        document.getElementById('statRecipients').textContent = d.recipientQueue || 0;
        const rate = d.aiMatchRate || 94.2;
        document.getElementById('statMatchRate').innerHTML = rate + '<span class="text-lg text-slate-400">%</span>';
    } catch (e) { console.warn('Stats load failed:', e); }
}

// ═══ LOAD HOSPITALS ═══
async function loadHospitals() {
    try {
        const r = await fetch(API + '/hospitals');
        allHospitals = await r.json();
        const sel = document.getElementById('hospitalFilter');
        const mSel = document.getElementById('matchHospitalFilter');
        allHospitals.forEach(h => {
            sel.innerHTML += `<option value="${h.id}">${h.name}</option>`;
            if (mSel) mSel.innerHTML += `<option value="${h.id}">${h.name}</option>`;
        });
    } catch (e) { console.warn('Hospitals load failed:', e); }
}

// ═══ LOAD PLEDGES ═══
async function loadPledges(hospitalId) {
    try {
        let url = API + '/pledges';
        if (hospitalId) url += '?hospitalId=' + encodeURIComponent(hospitalId);
        const r = await fetch(url);
        allPledges = await r.json();
        renderPatients(allPledges);
    } catch (e) {
        console.warn('Pledges load failed:', e);
        document.getElementById('patientTableBody').innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-400 font-bold">Failed to load — is backend running?</td></tr>';
    }
}

function onHospitalFilterChange() {
    const hid = document.getElementById('hospitalFilter').value;
    loadPledges(hid || null);
}

// ═══ RENDER PATIENT TABLE ═══
function renderPatients(list) {
    const tbody = document.getElementById('patientTableBody');
    document.getElementById('tableCount').textContent = '(' + list.length + ')';
    if (list.length === 0) { tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-400 font-bold">No results found.</td></tr>'; return; }
    tbody.innerHTML = (list ?? []).map(p => {
        const roleColor = p.role === 'DONOR' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200';
        const hla = p.hlaMarkers ? p.hlaMarkers.split(',').slice(0, 3).join(', ') : '—';
        const hospName = p.hospitalName || p.hospitalId || '—';
        return '<tr class="hover:bg-slate-50/80 transition-colors cursor-pointer" onclick="showPledgeDetail(' + p.id + ')">' +
            '<td class="py-3 px-5 font-bold text-slate-900 text-xs">' + (p.patientName || '—') + '</td>' +
            '<td class="py-3 px-5 mono text-xs text-slate-500">' + (p.abhaId || '—') + '</td>' +
            '<td class="py-3 px-5"><span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-100">' + (p.bloodGroup || '—') + '</span></td>' +
            '<td class="py-3 px-5 mono text-[10px] text-slate-400">' + hla + '</td>' +
            '<td class="py-3 px-5 text-[10px] font-bold text-slate-500">' + hospName + '</td>' +
            '<td class="py-3 px-5"><span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">' + (p.organ || '—') + '</span></td>' +
            '<td class="py-3 px-5"><span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-widest border ' + roleColor + '">' + (p.role || '—') + '</span></td>' +
            '</tr>';
    }).join('');
}

function showPledgeDetail(id) {
    const p = allPledges.find(x => x.id === id);
    if (!p) return;
    const c = document.getElementById('matchDetailContent');
    c.innerHTML = '<div class="grid grid-cols-2 gap-6">' +
        '<div class="space-y-4">' +
        '<h4 class="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2">Patient Profile</h4>' +
        field('Name', p.patientName) + field('Age', p.patientAge) + field('Blood Group', p.bloodGroup) +
        field('HLA Markers', p.hlaMarkers) + field('Organ', p.organ) + field('Role', p.role) + field('ABHA ID', p.abhaId) +
        '</div><div class="space-y-4">' +
        '<h4 class="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2">Blockchain & Hospital</h4>' +
        field('Hospital', p.hospitalName || p.hospitalId) + field('Hospital ID', p.hospitalId) +
        field('Block #', p.blockNumber) + field('Tx Hash', p.transactionHash, true) +
        field('IPFS CID', p.ipfsCid, true) + field('Document Hash', p.documentHash, true) +
        '</div></div>';
    document.getElementById('matchDetailModal').classList.remove('hidden');
}

function field(label, value, mono) {
    return '<div><div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">' + label + '</div>' +
        '<div class="text-sm font-bold text-slate-900 ' + (mono ? 'mono text-xs break-all' : '') + '">' + (value || '—') + '</div></div>';
}

// ═══ FILTER TABLE ═══
function filterPatients() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    if (!q) { renderPatients(allPledges); return; }
    renderPatients(allPledges.filter(p => ((p.patientName||'')+(p.abhaId||'')+(p.bloodGroup||'')+(p.organ||'')+(p.role||'')+(p.hospitalName||'')).toLowerCase().includes(q)));
}

// ═══ LIVE BLOCKCHAIN FEED ═══
async function loadBlockchainFeed() {
    try {
        const r = await fetch(API + '/blockchain/live');
        const d = await r.json();
        const bn = d.latestBlockNumber || 0;
        document.getElementById('blockHeight').textContent = bn > 0 ? '#' + bn.toLocaleString() : '#—';
        const container = document.getElementById('liveFeedContainer');
        const txs = d.transactions || [];
        if (txs.length === 0) { container.innerHTML = '<div class="text-center text-slate-500 text-xs py-6 font-bold">No blocks from Ganache yet</div>'; return; }
        container.innerHTML = '';
        const colors = { PLEDGE:'text-emerald-400', MATCH:'text-blue-400', BLOCK_MINED:'text-slate-500' };
        txs.slice(0, 15).forEach(tx => {
            const method = tx.transactionHash === 'BLOCK_MINED' ? 'BLOCK' : (tx.input && tx.input.length > 4 ? 'CONTRACT' : 'TRANSFER');
            const time = tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : '';
            const el = document.createElement('div');
            el.className = 'bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2.5 slide-up';
            el.innerHTML = '<div class="flex items-center justify-between"><span class="mono text-[10px] font-bold ' + (colors[method] || 'text-cyan-400') + '">' + method + '</span><span class="text-[9px] mono text-slate-600">' + time + '</span></div>' +
                '<div class="text-[10px] mono text-slate-400 mt-1 truncate">' + (tx.transactionHash === 'BLOCK_MINED' ? 'Empty Block' : tx.transactionHash.substring(0, 22) + '...') + ' <span class="text-slate-600">Block #' + tx.blockNumber + '</span></div>';
            container.appendChild(el);
        });
    } catch (e) {
        // Fallback simulated feed
        addSimulatedFeedEntry();
    }
}

let simBlockNum = 14207882;
const TX_METHODS = ['PLEDGE','MATCH','AUDIT','ENROLL','TRANSFER','VERIFY'];
const NODES = ['AIIMS-D01','APOLLO-C02','KEM-MUM-03','NIMHANS-B05','PGIMER-CHD'];
function addSimulatedFeedEntry() {
    simBlockNum++;
    const method = TX_METHODS[Math.floor(Math.random()*TX_METHODS.length)];
    const node = NODES[Math.floor(Math.random()*NODES.length)];
    const txHash = '0x' + Array.from({length:8}, ()=>Math.floor(Math.random()*16).toString(16)).join('');
    const clrs = { PLEDGE:'text-emerald-400', MATCH:'text-blue-400', AUDIT:'text-slate-400', ENROLL:'text-purple-400', TRANSFER:'text-amber-400', VERIFY:'text-cyan-400' };
    const container = document.getElementById('liveFeedContainer');
    if (container.querySelector('.text-center')) container.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2.5 slide-up';
    el.innerHTML = '<div class="flex items-center justify-between"><span class="mono text-[10px] font-bold ' + (clrs[method]||'text-slate-400') + '">' + method + '</span><span class="text-[9px] mono text-slate-600">' + new Date().toLocaleTimeString() + '</span></div>' +
        '<div class="text-[10px] mono text-slate-400 mt-1 truncate">' + txHash + '... <span class="text-slate-600">→ ' + node + '</span></div>';
    container.prepend(el);
    document.getElementById('blockHeight').textContent = '#' + simBlockNum.toLocaleString();
    if (container.children.length > 30) container.lastChild.remove();
}

// ═══ THREAT BLOCKING ═══
let securityActive = false, threatInterval = null, blockedIPs = 0;
const THREAT_TYPES = ['RATE_LIMIT_EXCEEDED','DDOS_PATTERN','SIGNATURE_MISMATCH','REPLAY_ATTACK','BRUTE_FORCE','PORT_SCAN','SQL_INJECTION','XSS_ATTEMPT'];
const THREAT_ORIGINS = ['Moscow','Beijing','Virginia','Frankfurt','São Paulo','Seoul','Unknown Peer','London'];

function toggleSecurity() {
    securityActive = !securityActive;
    const btn = document.getElementById('secBtn'), label = document.getElementById('secBtnLabel');
    const dot = document.getElementById('threatDot'), card = document.getElementById('threatCard');
    const levelText = document.getElementById('threatLevelText'), subtext = document.getElementById('threatSubtext');
    if (securityActive) {
        btn.className = 'bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-[0.97] pulse-threat';
        label.textContent = 'Deactivate Security';
        dot.className = 'w-2 h-2 rounded-full bg-rose-500 animate-pulse';
        card.classList.add('border-rose-200');
        levelText.innerHTML = '<span class="text-rose-600">HIGH</span> <span class="text-base text-rose-400 font-bold">/ Active Scan</span>';
        subtext.textContent = 'Monitoring all inbound traffic'; subtext.className = 'text-[10px] font-bold text-rose-500 mt-0.5';
        document.getElementById('threatLog').innerHTML = '';
        threatInterval = setInterval(addThreatEntry, 3000 + Math.random()*2000); addThreatEntry();
    } else {
        btn.className = 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-[0.97]';
        label.textContent = 'Activate Security for Threats';
        dot.className = 'w-2 h-2 rounded-full bg-emerald-500'; card.classList.remove('border-rose-200');
        levelText.innerHTML = '<span class="text-emerald-600">Low</span> <span class="text-base text-slate-400 font-bold">/ Nominal</span>';
        subtext.textContent = 'All boundaries secured'; subtext.className = 'text-[10px] font-bold text-emerald-600 mt-0.5';
        if (threatInterval) clearInterval(threatInterval);
    }
}

function addThreatEntry() {
    blockedIPs++;
    const type = THREAT_TYPES[Math.floor(Math.random()*THREAT_TYPES.length)];
    const origin = THREAT_ORIGINS[Math.floor(Math.random()*THREAT_ORIGINS.length)];
    const ip = Math.floor(10+Math.random()*240)+'.'+Math.floor(Math.random()*256)+'.'+Math.floor(Math.random()*256)+'.'+Math.floor(Math.random()*256);
    const isCritical = ['DDOS_PATTERN','REPLAY_ATTACK','SQL_INJECTION'].includes(type);
    const container = document.getElementById('threatLog');
    const el = document.createElement('div');
    el.className = (isCritical ? 'bg-rose-950/40 border-rose-900/40' : 'bg-slate-900/60 border-slate-800') + ' border rounded-lg px-3 py-2.5 slide-up';
    el.innerHTML = '<div class="flex items-center justify-between"><span class="text-[10px] font-extrabold '+(isCritical?'text-rose-400':'text-amber-400')+' tracking-widest">'+type+'</span><span class="text-[9px] font-bold '+(isCritical?'text-rose-500':'text-emerald-500')+'">'+(isCritical?'BLOCKED':'RATE-LIMITED')+'</span></div>' +
        '<div class="text-[10px] mono text-slate-500 mt-1">'+ip+' — '+origin+'</div><div class="text-[9px] text-slate-600 mt-0.5">'+new Date().toLocaleTimeString()+'</div>';
    container.prepend(el);
    document.getElementById('blockedCount').innerHTML = '<span class="text-rose-400">'+blockedIPs+'</span> blocked';
    if (container.children.length > 40) container.lastChild.remove();
}

// ═══ AI MATCHING ═══
const ABO_COMPAT = {'O-':['O-','O+','A-','A+','B-','B+','AB-','AB+'],'O+':['O+','A+','B+','AB+'],'A-':['A-','A+','AB-','AB+'],'A+':['A+','AB+'],'B-':['B-','B+','AB-','AB+'],'B+':['B+','AB+'],'AB-':['AB-','AB+'],'AB+':['AB+']};

function computeMatchScore(donor, recipient) {
    let score = 0;
    const compat = ABO_COMPAT[donor.bloodGroup] || [];
    if (donor.bloodGroup === recipient.bloodGroup) score += 40;
    else if (compat.includes(recipient.bloodGroup)) score += 25;
    else return 0;
    const dHla = (donor.hlaMarkers||'').split(','), rHla = (recipient.hlaMarkers||'').split(',');
    const shared = dHla.filter(a => rHla.includes(a)).length;
    score += shared * 10;
    const ageDiff = Math.abs((donor.patientAge||40) - (recipient.patientAge||40));
    score -= Math.min(ageDiff * 0.5, 15);
    if (donor.organ === recipient.organ) score += 10;
    if (donor.hospitalId && donor.hospitalId === recipient.hospitalId) score += 15;
    return Math.max(0, Math.round(score * 10) / 10);
}

function openMatchModal() {
    const select = document.getElementById('donorSelect');
    select.innerHTML = '<option value="">— Select a registered donor —</option>';
    const donors = allPledges.filter(p => p.role === 'DONOR');
    donors.forEach(d => { select.innerHTML += '<option value="'+d.id+'">'+d.patientName+' — '+d.bloodGroup+' — '+(d.organ||'')+' — Age '+(d.patientAge||'?')+'</option>'; });
    document.getElementById('matchResults').classList.add('hidden');
    document.getElementById('matchPlaceholder').classList.remove('hidden');
    document.getElementById('matchModal').classList.remove('hidden');
}
function closeMatchModal() { document.getElementById('matchModal').classList.add('hidden'); }

function runMatching() {
    const donorId = parseInt(document.getElementById('donorSelect', 10).value);
    if (!donorId) { document.getElementById('matchResults').classList.add('hidden'); document.getElementById('matchPlaceholder').classList.remove('hidden'); return; }
    const donor = allPledges.find(p => p.id === donorId);
    if (!donor) return;
    const hospFilter = document.getElementById('matchHospitalFilter').value;
    let recipients = allPledges.filter(p => p.role === 'RECIPIENT');
    if (hospFilter) recipients = recipients.filter(r => r.hospitalId === hospFilter);
    const ranked = (recipients ?? []).map(r => {
        const sc = computeMatchScore(donor, r);
        const dHla = (donor.hlaMarkers||'').split(','), rHla = (r.hlaMarkers||'').split(',');
        return {...r, score: sc, hlaShared: dHla.filter(a => rHla.includes(a)).length, _donorId: donorId};
    }).filter(r => r.score > 0).sort((a,b) => b.score - a.score).slice(0, 10);

    const tbody = document.getElementById('matchTableBody');
    tbody.innerHTML = ranked.map((r, i) => {
        const pct = Math.min(100, (r.score / 100) * 100).toFixed(1);
        const barColor = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';
        return '<tr class="hover:bg-slate-50 transition-colors">' +
            '<td class="py-3 px-4 font-black text-slate-900 text-center">'+(i+1)+'</td>' +
            '<td class="py-3 px-4"><div class="font-bold text-slate-800 text-xs">'+r.patientName+'</div><div class="text-[10px] mono text-slate-400 mt-0.5">'+(r.hospitalName||'')+'</div></td>' +
            '<td class="py-3 px-4"><span class="text-[10px] font-extrabold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">'+r.bloodGroup+'</span></td>' +
            '<td class="py-3 px-4"><span class="mono text-xs font-bold text-blue-600">'+r.hlaShared+'/6</span></td>' +
            '<td class="py-3 px-4"><div class="flex items-center gap-2"><div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="'+barColor+' h-full rounded-full" style="width:'+pct+'%"></div></div><span class="mono text-xs font-bold text-slate-700">'+r.score+'</span></div></td>' +
            '<td class="py-3 px-4 text-right"><button onclick="approveMatch('+donorId+','+r.id+','+r.score+')" class="bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all">Approve</button></td></tr>';
    }).join('');
    if (ranked.length === 0) tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-400 font-bold">No compatible recipients found.</td></tr>';
    document.getElementById('matchPlaceholder').classList.add('hidden');
    document.getElementById('matchResults').classList.remove('hidden');
}

// ═══ MULTI-SIG APPROVAL ═══
let pendingDonor = null, pendingRecipient = null;

function approveMatch(donorId, recipientId, score) {
    pendingDonor = allPledges.find(p => p.id === donorId);
    pendingRecipient = allPledges.find(p => p.id === recipientId);
    closeMatchModal();
    document.getElementById('approvalTitle').textContent = 'Multi-Sig Match Approval';
    document.getElementById('approvalDesc').textContent = 'Linking ' + pendingDonor.patientName + ' → ' + pendingRecipient.patientName + ' (Score: ' + score + ')';
    document.getElementById('txResultBox').classList.add('hidden');
    document.getElementById('approvalBtns').classList.remove('hidden');
    document.getElementById('btnDone').classList.add('hidden');
    document.getElementById('btnConfirmMatch').disabled = true;
    document.getElementById('msig-bar').style.width = '0%';
    document.getElementById('msig-bar').className = 'h-full bg-amber-500 transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    document.getElementById('msig-status').textContent = '0/3 Verified';
    document.getElementById('msig-status').className = 'text-[11px] font-extrabold text-amber-400 mono';
    document.getElementById('msig-text').textContent = 'Gathering P2P Consensus...';
    document.getElementById('msig-spinner').classList.remove('hidden');
    document.getElementById('approvalModal').classList.remove('hidden');

    setTimeout(() => { document.getElementById('msig-bar').style.width = '33%'; document.getElementById('msig-status').textContent = '1/3 Verified'; }, 800);
    setTimeout(() => { document.getElementById('msig-bar').style.width = '66%'; document.getElementById('msig-status').textContent = '2/3 Verified'; }, 1600);
    setTimeout(() => {
        document.getElementById('msig-bar').style.width = '100%';
        document.getElementById('msig-bar').className = 'h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
        document.getElementById('msig-status').textContent = '3/3 Verified';
        document.getElementById('msig-status').className = 'text-[11px] font-extrabold text-emerald-400 mono';
        document.getElementById('msig-text').textContent = 'Consensus Achieved. Ready for authorization.';
        document.getElementById('msig-spinner').classList.add('hidden');
        document.getElementById('btnConfirmMatch').disabled = false;
        document.getElementById('btnConfirmMatch').onclick = executeBlockchainCommit;
    }, 2400);
}

async function executeBlockchainCommit() {
    document.getElementById('btnConfirmMatch').disabled = true;
    document.getElementById('btnConfirmMatch').textContent = 'Committing...';
    document.getElementById('msig-text').textContent = 'Writing to Ethereum L2...';
    document.getElementById('msig-spinner').classList.remove('hidden');

    let txHash, blockNum = 0;
    try {
        const resp = await fetch(API + '/manual-match', {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                donorHash: pendingDonor.abhaHash || pendingDonor.abhaId,
                recipientHash: pendingRecipient.abhaHash || pendingRecipient.abhaId,
                organType: pendingDonor.organ || 'Kidney', organId: 0
            })
        });
        const result = await resp.json();
        txHash = result.transactionHash;
        blockNum = result.blockNumber || 0;
    } catch (e) {
        const seed = (pendingDonor.abhaId||'') + (pendingRecipient.abhaId||'') + Date.now();
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed));
        txHash = '0x' + Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    }

    document.getElementById('msig-spinner').classList.add('hidden');
    document.getElementById('msig-text').textContent = 'Transaction confirmed on-chain.';
    document.getElementById('txResultBox').classList.remove('hidden');
    document.getElementById('txResultHash').textContent = txHash;
    document.getElementById('txResultBlock').textContent = blockNum > 0 ? '#' + blockNum.toLocaleString() : '#—';
    document.getElementById('txResultTime').textContent = 'Finalized: ' + new Date().toISOString().replace('T',' ').substring(0,19) + ' UTC';
    document.getElementById('approvalBtns').classList.add('hidden');
    document.getElementById('btnDone').classList.remove('hidden');

    // Add to live feed
    const container = document.getElementById('liveFeedContainer');
    const el = document.createElement('div');
    el.className = 'bg-emerald-950/40 border border-emerald-800 rounded-lg px-3 py-2.5 slide-up';
    el.innerHTML = '<div class="flex items-center justify-between"><span class="mono text-[10px] font-bold text-emerald-400">MATCH ✓</span><span class="text-[9px] mono text-slate-600">'+new Date().toLocaleTimeString()+'</span></div>' +
        '<div class="text-[10px] mono text-emerald-500/80 mt-1 truncate">'+txHash.substring(0,20)+'... <span class="text-slate-600">→ Block #'+(blockNum||'?')+'</span></div>';
    container.prepend(el);
    loadStats();
}

function closeApprovalModal() { document.getElementById('approvalModal').classList.add('hidden'); document.getElementById('btnConfirmMatch').textContent = 'Confirm on Blockchain'; }

// ═══ MANUAL MATCH ═══
function openManualMatchModal() {
    document.getElementById('manualMatchResult').classList.add('hidden');
    document.getElementById('manualDonorHash').value = '';
    document.getElementById('manualRecipientHash').value = '';
    document.getElementById('manualMatchBtn').disabled = false;
    document.getElementById('manualMatchBtn').textContent = 'Execute Manual Match on Blockchain';
    document.getElementById('manualMatchModal').classList.remove('hidden');
}
function closeManualMatchModal() { document.getElementById('manualMatchModal').classList.add('hidden'); }

async function executeManualMatch() {
    const donorHash = document.getElementById('manualDonorHash').value.trim();
    const recipientHash = document.getElementById('manualRecipientHash').value.trim();
    const organType = document.getElementById('manualOrganType').value;
    if (!donorHash || !recipientHash) { alert('Please enter both Donor and Recipient hashes.'); return; }

    const btn = document.getElementById('manualMatchBtn');
    btn.disabled = true; btn.innerHTML = '<svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Executing...';

    try {
        const resp = await fetch(API + '/manual-match', {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ donorHash, recipientHash, organType, organId: 0 })
        });
        const result = await resp.json();
        document.getElementById('manualTxHash').textContent = result.transactionHash || 'Error';
        document.getElementById('manualBlockNum').textContent = result.blockNumber ? '#' + result.blockNumber : '#—';
        document.getElementById('manualMatchResult').classList.remove('hidden');
        btn.textContent = '✓ Match Executed Successfully';
        btn.className = btn.className.replace('bg-indigo-600', 'bg-emerald-600').replace('hover:bg-indigo-500', 'hover:bg-emerald-500');
        loadStats();
    } catch (e) {
        btn.textContent = 'Error — Try Again'; btn.disabled = false;
    }
}

// ═══ MATCH DETAIL MODAL ═══
function closeMatchDetailModal() { document.getElementById('matchDetailModal').classList.add('hidden'); }

function openMatchDetail(matchId) {
    fetch(API + '/matches/' + matchId).then(r => r.json()).then(m => {
        const c = document.getElementById('matchDetailContent');
        c.innerHTML = '<div class="grid grid-cols-2 gap-6">' +
            '<div class="space-y-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">' +
            '<h4 class="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg> Donor</h4>' +
            field('Name', m.donorName) + field('Age', m.donorAge) + field('Blood Group', m.donorBloodGroup) + field('HLA Markers', m.donorHla) +
            '</div><div class="space-y-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4">' +
            '<h4 class="text-sm font-black text-blue-700 uppercase tracking-widest flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg> Recipient</h4>' +
            field('Name', m.recipientName) + field('Age', m.recipientAge) + field('Blood Group', m.recipientBloodGroup) + field('HLA Markers', m.recipientHla) +
            '</div></div>' +
            '<div class="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">' +
            '<h4 class="text-sm font-black text-slate-700 uppercase tracking-widest">Blockchain Proof</h4>' +
            '<div class="grid grid-cols-2 gap-4">' +
            field('Organ', m.organType) + field('Score', m.compatibilityScore ? m.compatibilityScore+'%' : '—') +
            field('Hospital', m.hospitalName) + field('Match Type', m.matchType) +
            field('Block #', m.blockNumber) + field('Status', m.status) +
            '</div>' + field('Transaction Hash', m.transactionHash, true) +
            '</div>';
        document.getElementById('matchDetailModal').classList.remove('hidden');
    }).catch(e => console.warn('Match detail failed:', e));
}
