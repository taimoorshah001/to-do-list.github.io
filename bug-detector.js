#!/usr/bin/env node

/**
 * AI-Powered Bug Detection Agent
 * Autonomously scans JavaScript, HTML, and CSS files for common bugs and issues
 */

const fs = require('fs-extra');
const path = require('path');

class BugDetectionAgent {
  constructor() {
    this.bugs = [];
    this.warnings = [];
    this.suggestions = [];
  }

  // Bug detection patterns for JavaScript
  detectJavaScriptBugs(content, filename) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Common jQuery/JavaScript bug patterns
      this.checkPatterns(line, lineNum, filename, [
        {
          pattern: /\$\(.*\)\.click\(function\(\)/g,
          type: 'warning',
          message: 'Event handlers added inside loops may cause memory leaks',
          suggestion: 'Consider using event delegation with $(document).on() instead'
        },
        {
          pattern: /let\s+\w+\s*=.*\$\(/g,
          type: 'suggestion',
          message: 'Consider using const for jQuery elements that won\'t be reassigned',
          suggestion: 'Use const instead of let for immutable jQuery objects'
        },
        {
          pattern: /\.val\(\)\s*==\s*['"]/g,
          type: 'bug',
          message: 'Use === instead of == for strict equality comparison',
          suggestion: 'Replace == with === to avoid type coercion issues'
        },
        {
          pattern: /\.animate\(/g,
          type: 'warning',
          message: 'jQuery animations may cause performance issues',
          suggestion: 'Consider using CSS transitions or requestAnimationFrame'
        },
        {
          pattern: /\$\(.*\)\.remove\(\)/g,
          type: 'warning',
          message: 'Direct removal without cleanup may cause memory leaks',
          suggestion: 'Ensure event handlers are properly cleaned up before removal'
        },
        {
          pattern: /e\.which\s*===?\s*13/g,
          type: 'suggestion',
          message: 'Magic number for Enter key',
          suggestion: 'Define a constant like ENTER_KEY = 13 for better readability'
        }
      ]);
    });
  }

  // Bug detection patterns for HTML
  detectHTMLBugs(content, filename) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      this.checkPatterns(line, lineNum, filename, [
        {
          pattern: /<input[^>]*(?!.*aria-label)(?!.*aria-labelledby)/g,
          type: 'warning',
          message: 'Input missing accessibility label',
          suggestion: 'Add aria-label or associate with a label element'
        },
        {
          pattern: /<button[^>]*(?!.*aria-label)(?!.*title)/g,
          type: 'suggestion',
          message: 'Button could benefit from aria-label for screen readers',
          suggestion: 'Add aria-label for better accessibility'
        },
        {
          pattern: /src=['"](https?:)?\/\/[^'"]*['"]/g,
          type: 'warning',
          message: 'External resource without integrity check',
          suggestion: 'Consider adding integrity attribute for CDN resources'
        }
      ]);
    });
  }

  // Bug detection patterns for CSS
  detectCSSBugs(content, filename) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      this.checkPatterns(line, lineNum, filename, [
        {
          pattern: /animation:\s*[^;]*(?!.*ease)/g,
          type: 'suggestion',
          message: 'Animation without easing function',
          suggestion: 'Consider adding an easing function for smoother animations'
        },
        {
          pattern: /width:\s*calc\([^)]*\)/g,
          type: 'warning',
          message: 'Complex calc() expression',
          suggestion: 'Test across different browsers for calc() compatibility'
        },
        {
          pattern: /:hover(?![^{]*@media)/g,
          type: 'suggestion',
          message: 'Hover effects may not work on touch devices',
          suggestion: 'Consider adding :focus styles for better mobile UX'
        }
      ]);
    });
  }

  checkPatterns(line, lineNum, filename, patterns) {
    patterns.forEach(pattern => {
      if (pattern.pattern.test(line)) {
        const issue = {
          file: filename,
          line: lineNum,
          type: pattern.type,
          message: pattern.message,
          suggestion: pattern.suggestion,
          code: line.trim()
        };

        switch (pattern.type) {
          case 'bug':
            this.bugs.push(issue);
            break;
          case 'warning':
            this.warnings.push(issue);
            break;
          case 'suggestion':
            this.suggestions.push(issue);
            break;
        }
      }
    });
  }

  // Advanced analysis for common JavaScript patterns
  analyzeCodeQuality(content, filename) {
    // Check for missing error handling
    if (content.includes('$') && !content.includes('try') && !content.includes('catch')) {
      this.warnings.push({
        file: filename,
        line: 'N/A',
        type: 'warning',
        message: 'No error handling found in jQuery code',
        suggestion: 'Add try-catch blocks around jQuery operations',
        code: 'General pattern'
      });
    }

    // Check for potential XSS vulnerabilities
    if (content.includes('.html(') && !content.includes('.text(')) {
      this.bugs.push({
        file: filename,
        line: 'N/A',
        type: 'bug',
        message: 'Potential XSS vulnerability with .html()',
        suggestion: 'Use .text() instead of .html() for user input',
        code: 'General pattern'
      });
    }

    // Check for accessibility issues
    if (content.includes('click(') && !content.includes('keypress(')) {
      this.suggestions.push({
        file: filename,
        line: 'N/A',
        type: 'suggestion',
        message: 'Click handlers without keyboard support',
        suggestion: 'Add keyboard event handlers for accessibility',
        code: 'General pattern'
      });
    }
  }

  async scanFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const filename = path.basename(filePath);
      const ext = path.extname(filename).toLowerCase();

      switch (ext) {
        case '.js':
          this.detectJavaScriptBugs(content, filename);
          this.analyzeCodeQuality(content, filename);
          break;
        case '.html':
          this.detectHTMLBugs(content, filename);
          break;
        case '.css':
          this.detectCSSBugs(content, filename);
          break;
      }
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message);
    }
  }

  async scanDirectory(dirPath = '.') {
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isFile() && /\.(js|html|css)$/.test(file)) {
          await this.scanFile(filePath);
        }
      }
    } catch (error) {
      console.error('Error scanning directory:', error.message);
    }
  }

  generateReport() {
    console.log('\n🤖 AI Bug Detection Agent Report');
    console.log('================================\n');

    if (this.bugs.length > 0) {
      console.log('🚨 BUGS FOUND:');
      this.bugs.forEach((bug, index) => {
        console.log(`${index + 1}. ${bug.file}:${bug.line}`);
        console.log(`   Issue: ${bug.message}`);
        console.log(`   Code: ${bug.code}`);
        console.log(`   Fix: ${bug.suggestion}\n`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.file}:${warning.line}`);
        console.log(`   Issue: ${warning.message}`);
        console.log(`   Code: ${warning.code}`);
        console.log(`   Suggestion: ${warning.suggestion}\n`);
      });
    }

    if (this.suggestions.length > 0) {
      console.log('💡 SUGGESTIONS:');
      this.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.file}:${suggestion.line}`);
        console.log(`   Issue: ${suggestion.message}`);
        console.log(`   Code: ${suggestion.code}`);
        console.log(`   Improvement: ${suggestion.suggestion}\n`);
      });
    }

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`   Bugs: ${this.bugs.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Suggestions: ${this.suggestions.length}`);
    console.log(`   Total Issues: ${this.bugs.length + this.warnings.length + this.suggestions.length}\n`);

    // Return results for programmatic use
    return {
      bugs: this.bugs,
      warnings: this.warnings,
      suggestions: this.suggestions,
      totalIssues: this.bugs.length + this.warnings.length + this.suggestions.length
    };
  }
}

// Main execution
async function main() {
  const agent = new BugDetectionAgent();
  
  console.log('🔍 Starting AI Bug Detection Scan...');
  await agent.scanDirectory('.');
  
  const results = agent.generateReport();
  
  // Exit with error code if bugs are found
  if (results.bugs.length > 0) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = BugDetectionAgent;