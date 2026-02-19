import os
import json

# Configuration: In keywords ko scan kiya jayega
SENSITIVE_DATA = {
    "GDPR_RISK": ["email", "address", "phone", "ip_address", "credit_card", "passport"],
    "SECURITY_RISK": ["api_key", "password", "secret", "db_password", "token"]
}

def start_compliance_audit():
    print("🚀 TrustShield Engine: Starting deep scan...")
    audit_results = {
        "score": 100,
        "vulnerabilities": [],
        "status": "Incomplete"
    }
    
    # Har file ko scan karna
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith((".py", ".js", ".env", ".json")):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', errors='ignore') as f:
                        content = f.read().lower()
                        for category, keywords in SENSITIVE_DATA.items():
                            for word in keywords:
                                if word in content:
                                    audit_results["vulnerabilities"].append({
                                        "file": file,
                                        "type": category,
                                        "found": word
                                    })
                                    audit_results["score"] -= 7 # Har issue par score kam hoga
                except Exception as e:
                    continue

    audit_results["score"] = max(audit_results["score"], 0)
    audit_results["status"] = "Complete"
    
    # Report file generate karna
    with open("scan_results.json", "w") as report_file:
        json.dump(audit_results, report_file, indent=4)
    
    print(f"✅ Audit Finished. Score: {audit_results['score']}%")
    return audit_results

if __name__ == "__main__":
    start_compliance_audit()
