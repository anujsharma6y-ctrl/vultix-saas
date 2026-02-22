const logs = ["> Initializing scan...", "> Fetching IAM policies...", "> Checking S3 bucket ACLs...", "> ANALYSIS COMPLETE."];

function selectTool(tool, el) {
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('v-map-box').style.display = (tool === 'blast-radius') ? 'block' : 'none';
}

document.getElementById('v-scan-btn').onclick = function() {
    const term = document.getElementById('v-terminal');
    term.style.display = 'block';
    term.innerHTML = '';
    let i = 0;
    
    const interval = setInterval(() => {
        if(i < logs.length) {
            term.innerHTML += logs[i] + "<br>";
            i++;
        } else {
            clearInterval(interval);
            document.getElementById('v-score').innerText = "24%";
            document.getElementById('v-vuln').innerText = "7 Issues";
            if(document.getElementById('v-map-box').style.display === 'block') {
                document.getElementById('v-map').innerHTML = '<div class="node red">API Gateway</div> → <div class="node">DB Access</div>';
            }
        }
    }, 600);
};
