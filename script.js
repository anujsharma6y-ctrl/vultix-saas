let currentTool = 'dashboard';

function selectTool(tool, element) {
    currentTool = tool;
    document.querySelectorAll('.side-nav a').forEach(a => a.classList.remove('active'));
    element.classList.add('active');
    
    // Toggle Blast Radius Section
    document.getElementById('blast-radius-container').style.display = (tool === 'blast-radius') ? 'block' : 'none';
    
    const titles = {
        'dashboard': 'Infrastructure Health Overview',
        'secrets': 'Credential Leak Intelligence',
        'blast-radius': 'Attack Path Visualization',
        'threat-lab': 'Malicious Actor Simulation'
    };
    document.getElementById('main-title').innerText = titles[tool];
}

document.getElementById('scan-btn').onclick = function() {
    const url = document.getElementById('repo-url').value;
    if(!url) { alert("Please target a system first."); return; }

    this.innerHTML = "🔍 Running Day 3 Simulation...";
    this.disabled = true;

    setTimeout(() => {
        let score = (currentTool === 'threat-lab' || currentTool === 'blast-radius') ? 34 : 92;
        let findings = (score < 50) ? 14 : 0;

        document.getElementById('main-score').innerText = score + "%";
        document.getElementById('vuln-count').innerText = findings;
        
        if(currentTool === 'blast-radius') renderNodes();
        
        document.getElementById('security-report').style.display = 'block';
        updateResults(currentTool, score);
        
        this.innerHTML = "Launch Security Audit";
        this.disabled = false;
    }, 1500);
};

function renderNodes() {
    const map = document.getElementById('visual-map');
    map.innerHTML = `
        <div class="node" style="top:20%; left:45%; background:#ef4444; box-shadow:0 0 20px #ef4444;">EXPOSED API</div>
        <div class="node" style="top:60%; left:25%; background:#f59e0b;">S3 BUCKET (PROD)</div>
        <div class="node" style="top:60%; left:65%; background:#3b82f6;">IAM ROLE: ADMIN</div>
    `;
}

function updateResults(tool, score) {
    const list = document.getElementById('report-details-list');
    const logs = {
        'dashboard': 'No unauthorized access detected in current perimeter.',
        'secrets': 'Checked 4,500 lines. 0 hardcoded keys found.',
        'blast-radius': 'Attack Path: Exposed API -> IAM Role -> Database Compromise.',
        'threat-lab': 'Critical: Privilege escalation successful via AssumeRole abuse.'
    };
    
    list.innerHTML = `<div class="compliance-row">
        <div><strong>${tool.toUpperCase()} INSIGHT</strong><p style="color:#9ca3af; margin-top:5px;">${logs[tool]}</p></div>
        <div style="font-weight:bold; color:${score < 50 ? '#ef4444' : '#10b981'}">${score < 50 ? 'CRITICAL' : 'SECURE'}</div>
    </div>`;
}
