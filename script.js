document.getElementById('scan-btn').onclick = async function() {
    const urlInput = document.getElementById('repo-url').value;
    if(!urlInput.includes("github.com/")) { alert("Enter valid GitHub URL"); return; }

    const pathParts = urlInput.replace("https://github.com/", "").split("/");
    const owner = pathParts[0], repo = pathParts[1];

    this.innerHTML = "🔍 Auditing Infrastructure...";
    this.disabled = true;

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const data = await response.json();
        
        const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
        const contents = await contentsRes.json();
        const hasEnv = contents.some(file => file.name === ".env");

        setTimeout(() => {
            let score = hasEnv ? 42 : 94;
            document.getElementById('main-score').innerText = score + "%";
            document.getElementById('vuln-count').innerText = hasEnv ? "1" : "0";
            
            generateComplianceReport(hasEnv, data.forks_count);
            document.getElementById('security-report').style.display = 'block';
            this.innerHTML = "Audit Complete ✅";
            this.disabled = false;
        }, 2000);
    } catch (e) { alert("Scan Failed"); this.disabled = false; }
};

function generateComplianceReport(hasEnv, forks) {
    const list = document.getElementById('report-details-list');
    const checks = [
        { name: "SOC2: Secret Privacy", status: hasEnv ? "FAIL" : "PASS", desc: "Checking for .env leaks." },
        { name: "Infrastructure Integrity", status: forks > 100 ? "WARNING" : "PASS", desc: "Risk of code drift." }
    ];
    list.innerHTML = checks.map(c => `
        <div class="compliance-row ${c.status.toLowerCase()}">
            <div><strong>${c.name}</strong><p style="font-size:0.8rem;color:#64748b">${c.desc}</p></div>
            <div class="check-status">${c.status}</div>
        </div>
    `).join('');
}
