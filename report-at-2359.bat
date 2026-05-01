@echo off
cd /d "C:\Users\YS"
echo Sending progress report...
node -e "
const fs = require('fs');
const report = fs.readFileSync('C:\\Users\\YS\\project\\daily-report.md', 'utf8');
console.log('=== DAILY REPORT 2026-04-29 ===');
console.log(report);
console.log('===============================');
"