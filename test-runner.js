#!/usr/bin/env node

/**
 * Simple Test Runner for Bug Detection Agent
 */

const BugDetectionAgent = require('./bug-detector');
const fs = require('fs-extra');

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async test(name, testFn) {
    try {
      console.log(`Running: ${name}`);
      await testFn();
      console.log(`✅ PASS: ${name}`);
      this.passed++;
    } catch (error) {
      console.log(`❌ FAIL: ${name} - ${error.message}`);
      this.failed++;
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  async runTests() {
    console.log('🧪 Running Bug Detection Agent Tests\n');

    // Test 1: Bug Detection Agent Creation
    await this.test('Bug Detection Agent Creation', async () => {
      const agent = new BugDetectionAgent();
      this.assert(agent instanceof BugDetectionAgent, 'Agent should be created');
      this.assert(Array.isArray(agent.bugs), 'Bugs array should exist');
      this.assert(Array.isArray(agent.warnings), 'Warnings array should exist');
      this.assert(Array.isArray(agent.suggestions), 'Suggestions array should exist');
    });

    // Test 2: JavaScript Bug Detection
    await this.test('JavaScript Bug Detection', async () => {
      const agent = new BugDetectionAgent();
      const testCode = `
        let taskText = $('#input').val();
        if (taskText == '') {
          return;
        }
      `;
      
      agent.detectJavaScriptBugs(testCode, 'test.js');
      this.assert(agent.bugs.length > 0 || agent.warnings.length > 0 || agent.suggestions.length > 0, 
        'Should detect issues in problematic code');
    });

    // Test 3: HTML Bug Detection
    await this.test('HTML Bug Detection', async () => {
      const agent = new BugDetectionAgent();
      const testHTML = '<input type="text" id="test-input">';
      
      agent.detectHTMLBugs(testHTML, 'test.html');
      this.assert(agent.warnings.length > 0, 'Should detect accessibility issues');
    });

    // Test 4: File Scanning
    await this.test('File Scanning Functionality', async () => {
      const agent = new BugDetectionAgent();
      
      // Check if main.js exists and can be scanned
      if (await fs.pathExists('./main.js')) {
        await agent.scanFile('./main.js');
        this.assert(true, 'Should be able to scan existing files');
      }
    });

    // Test 5: Report Generation
    await this.test('Report Generation', async () => {
      const agent = new BugDetectionAgent();
      
      // Add a test bug
      agent.bugs.push({
        file: 'test.js',
        line: 1,
        type: 'bug',
        message: 'Test bug',
        suggestion: 'Fix it',
        code: 'test code'
      });
      
      const results = agent.generateReport();
      this.assert(results.bugs.length === 1, 'Report should include added bug');
      this.assert(results.totalIssues === 1, 'Total issues should be calculated correctly');
    });

    // Summary
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${Math.round(this.passed / (this.passed + this.failed) * 100)}%`);

    return this.failed === 0;
  }
}

async function main() {
  const runner = new TestRunner();
  const success = await runner.runTests();
  
  if (!success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestRunner;