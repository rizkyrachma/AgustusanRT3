const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-red-primary': 'bg-[#B91C1C]',
  'text-red-primary': 'text-[#B91C1C]',
  'border-red-primary': 'border-[#B91C1C]',
  'border-l-red-primary': 'border-l-[#B91C1C]',
  'border-t-red-primary': 'border-t-[#B91C1C]',
  'hover:bg-red-primary': 'hover:bg-[#B91C1C]',
  'hover:text-red-primary': 'hover:text-[#B91C1C]',
  'ring-red-primary': 'ring-[#B91C1C]',
  'bg-red-dark': 'bg-[#7F1D1D]',
  'text-gold': 'text-[#FFD700]',
  'border-gold': 'border-[#FFD700]',
  'bg-red-tint-bg': 'bg-[#FEF2F2]',
  'border-red-tint-border': 'border-[#FECACA]',
  'ring-red-tint-bg': 'ring-[#FEF2F2]',
  'bg-surface-1': 'bg-[#F3F4F6]',
  'hover:bg-surface-1': 'hover:bg-[#F3F4F6]',
  'text-text-secondary': 'text-[#4B5563]',
  'text-text-muted': 'text-[#9CA3AF]',
  'border-border-color': 'border-[#E5E7EB]',
  'text-income': 'text-[#86EFAC]',
  'text-expense': 'text-[#FCA5A5]'
};

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [key, value] of Object.entries(replacements)) {
        if (content.includes(key)) {
           // Replace using simple string replaceAll if supported, or split/join
           const newContent = content.split(key).join(value);
           if (newContent !== content) {
             content = newContent;
             changed = true;
           }
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

walkDir('app/admin');
