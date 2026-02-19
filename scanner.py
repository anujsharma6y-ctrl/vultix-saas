import os
import json

def start_compliance_audit():
    results = {
        "score": 100,
        "free_issues": [], # Ye dashboard par dikhenge
        "paid_issues_count": 0, # Inke liye paise maangenge
        "status": "Complete"
    }
    
    keywords = ["email", "password", "api_key", "phone", "secret", "token"]
    
    for root, _, files in os.walk("."):
        for file in files:
            if file.endswith((".py", ".js", ".env")):
                try:
                    with open(os.path.join(root, file), 'r') as f:
                        content = f.read().lower()
                        for word in keywords:
                            if word in content:
                                results["score"] -= 5
                                # Pehle 2 issues free dikhao, baaki lock kar do
                                if len(results["free_issues"]) < 2:
                                    results["free_issues"].append(f"Found '{word}' in {file}")
                                else:
                                    results["paid_issues_count"] += 1
                except: continue

    with open("scan_results.json", "w") as f:
        json.dump(results, f)

if __name__ == "__main__":
    start_compliance_audit()
