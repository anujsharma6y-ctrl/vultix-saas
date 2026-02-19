import os
import json

def run_real_scan():
    # In keywords ko hum dhundenge
    sensitive_keys = ["password", "email", "api_key", "secret", "token"]
    found_issues = []
    
    # Files scan karna shuru
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith((".html", ".js", ".py", ".yml")):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            for key in sensitive_keys:
                                if key in line.lower():
                                    found_issues.append({
                                        "file": file,
                                        "line": i + 1,
                                        "type": key,
                                        "snippet": line.strip()[:30] + "..."
                                    })
                except: continue

    # Results ko JSON mein save karna
    report = {
        "score": max(100 - (len(found_issues) * 7), 20),
        "total_leaks": len(found_issues),
        "free_leaks": found_issues[:2], # Pehle 2 free
        "paid_leaks": found_issues[2:]  # Baaki sab paid
    }
    
    with open("scan_results.json", "w") as f:
        json.dump(report, f)

if __name__ == "__main__":
    run_real_scan()
    
