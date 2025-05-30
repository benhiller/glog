import React from 'react';

function LogEntry({ log }) {
  const parseAnsiColors = (text) => {
    // ANSI color codes mapping
    const colorMap = {
      '30': '#000000', '31': '#ff6b6b', '32': '#51cf66', '33': '#ffd43b',
      '34': '#339af0', '35': '#cc5de8', '36': '#22b8cf', '37': '#ffffff',
      '90': '#6b7280', '91': '#ff8787', '92': '#8ce99a', '93': '#ffe066',
      '94': '#74c0fc', '95': '#da77f2', '96': '#66d9ef', '97': '#f8f9fa'
    };
    
    const bgColorMap = {
      '40': '#000000', '41': '#ff6b6b', '42': '#51cf66', '43': '#ffd43b',
      '44': '#339af0', '45': '#cc5de8', '46': '#22b8cf', '47': '#ffffff',
      '100': '#6b7280', '101': '#ff8787', '102': '#8ce99a', '103': '#ffe066',
      '104': '#74c0fc', '105': '#da77f2', '106': '#66d9ef', '107': '#f8f9fa'
    };
    
    let html = '';
    let currentStyles = '';
    let i = 0;
    
    while (i < text.length) {
      if (text[i] === '\x1b') {
        // Check for different types of ANSI escape sequences
        if (text[i + 1] === '[') {
          // CSI (Control Sequence Introducer) sequences like colors
          let j = i + 2;
          while (j < text.length && /[0-9;]/.test(text[j])) {
            j++;
          }
          
          if (j < text.length && text[j] === 'm') {
            // This is a color/style sequence
            const codes = text.substring(i + 2, j).split(';');
            let styles = '';
            
            for (const code of codes) {
              if (code === '0' || code === '') {
                // Reset
                styles = '';
                break;
              } else if (code === '1') {
                styles += 'font-weight: bold; ';
              } else if (code === '3') {
                styles += 'font-style: italic; ';
              } else if (code === '4') {
                styles += 'text-decoration: underline; ';
              } else if (colorMap[code]) {
                styles += `color: ${colorMap[code]}; `;
              } else if (bgColorMap[code]) {
                styles += `background-color: ${bgColorMap[code]}; `;
              }
            }
            
            if (currentStyles && styles !== currentStyles) {
              html += '</span>';
            }
            
            if (styles) {
              html += `<span style="${styles}">`;
              currentStyles = styles;
            } else {
              currentStyles = '';
            }
            
            i = j + 1;
          } else {
            // Unknown CSI sequence - skip it entirely
            while (j < text.length && !/[a-zA-Z]/.test(text[j])) {
              j++;
            }
            if (j < text.length) {
              j++; // Skip the final letter
            }
            i = j;
          }
        } else if (text[i + 1] === ']') {
          // OSC (Operating System Command) sequences
          let j = i + 2;
          while (j < text.length && text[j] !== '\x07' && text[j] !== '\x1b') {
            j++;
          }
          if (j < text.length) {
            if (text[j] === '\x1b' && text[j + 1] === '\\') {
              j += 2; // Skip ESC\
            } else {
              j++; // Skip BEL
            }
          }
          i = j;
        } else {
          // Other escape sequences (ESC followed by single character)
          i += 2;
        }
      } else {
        html += text[i] === '<' ? '&lt;' : 
               text[i] === '>' ? '&gt;' : 
               text[i] === '&' ? '&amp;' : text[i];
        i++;
      }
    }
    
    if (currentStyles) {
      html += '</span>';
    }
    
    return html;
  };

  return (
    <div className="log-entry">
      <div className="timestamp">
        {new Date(log.timestamp).toLocaleTimeString()}
      </div>
      <div 
        className="message" 
        dangerouslySetInnerHTML={{ __html: parseAnsiColors(log.message) }}
      />
    </div>
  );
}

export default LogEntry;