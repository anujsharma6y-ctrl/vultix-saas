import os
import json

def start_auditpulse_engine():
    # AuditPulse key database for PII and Secret leaks
    patterns = {
        "Critical API Key": ["api_key", "secret_key", "aws_access"],
        "Sensitive PII": ["email", "password", "phone_number"],
        "Security Risk": ["chmod 777", "eval(", "shell_exec"]
    }
    
    scan_results = []
    
    # Scanning logic
    for root, _, files in os.walk("."):
        for file in files:
            if file.endswith((".py", ".js", ".env", ".html")):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        for i, line in enumerate(f, 1):
                            for category, keywords in patterns.items():
                                for word in keywords:
                                    if word in line.lower():
                                        scan_results.append({
                                            "type": category,
                                            "file": file,
                                            "line": i,
                                            "leak": word,
                                            "context": line.strip()[:40] + "..."
                                        })
                except: continue

    # AuditPulse Logic: Divide into Free and Pro
    report = {
        "brand": "AuditPulse",
        "readiness_score": max(100 - (len(scan_results) * 5), 35),
        "total_issues": len(scan_results),
        "free_tier_results": scan_results[:2],  # Only 2 results for free
        "pro_tier_count": max(0, len(scan_results) - 2),
        "status": "Analysis Complete"
    }

    # Saving results for the dashboard
    with open("scan_results.json", "w") as f:
        json.dump(report, f, indent=4)
    print("AuditPulse Scan Complete. Results saved to scan_results.json")

if __name__ == "__main__":
    start_auditpulse_engine()
