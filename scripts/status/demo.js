#!/usr/bin/env node

/**
 * Interactive 2-minute demo of the AI Coding Template
 * Shows the value proposition through simulation
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Helper function to colorize text
function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

// Helper function to pause execution
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Typing effect for dramatic presentation
async function typeText(text, color = 'white', delay = 30) {
    process.stdout.write(colors[color]);
    for (let char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write(colors.reset);
}

// Clear screen function
function clearScreen() {
    console.clear();
}

// Show header
function showHeader() {
    console.log(colorize('🚀 AI Coding Template - 2-Minute Demo', 'cyan'));
    console.log(colorize('=' .repeat(50), 'blue'));
    console.log();
}

// Demo scenario: Traditional AI vs Template approach
async function runDemo() {
    clearScreen();
    showHeader();

    console.log(colorize('Welcome! Let\'s see why this template changes everything.', 'white'));
    console.log();

    // Scenario setup
    console.log(colorize('📋 SCENARIO: Adding user authentication to your app', 'yellow'));
    console.log();
    await sleep(1000);

    // Traditional approach
    console.log(colorize('❌ TRADITIONAL AI APPROACH:', 'red'));
    console.log();

    await typeText('You: "Help me add user authentication"', 'white');
    console.log();
    await typeText('AI: "Here\'s a login component..."', 'white');
    console.log();
    await sleep(500);

    await typeText('You: "What about the backend?"', 'white');
    console.log();
    await typeText('AI: "Here\'s an auth service..." (forgets frontend decisions)', 'white');
    console.log();
    await sleep(500);

    await typeText('You: "How does this integrate with our database?"', 'white');
    console.log();
    await typeText('AI: "What database?" (lost all context)', 'white');
    console.log();
    await sleep(1000);

    console.log();
    console.log(colorize('Result: 3 hours of back-and-forth, inconsistent patterns', 'red'));
    console.log();

    await sleep(2000);

    // Template approach
    console.log(colorize('✅ AI TEMPLATE APPROACH:', 'green'));
    console.log();

    await typeText('/feature --new "User Authentication"', 'cyan', 20);
    console.log();
    await sleep(500);

    await typeText('🧭 Capturing business context, requirements, and success criteria...', 'blue');
    console.log();
    await typeText('🔗 Linking external issue tracker (AUTH-123)...', 'blue');
    console.log();
    await sleep(800);

    await typeText('/architect user-authentication', 'cyan', 20);
    console.log();
    await sleep(500);

    await typeText('🛡️  Security: "Consider OAuth vs JWT vs hybrid..."', 'blue');
    console.log();
    await typeText('🏗️  Architecture: "Impacts schema, API design, and session strategy..."', 'blue');
    console.log();
    await typeText('📋 ADR: JWT with refresh tokens + optional OAuth social login', 'green');
    console.log();
    await sleep(1000);

    await typeText('/plan --issue AUTH-123', 'cyan', 20);
    console.log();
    await sleep(500);

    await typeText('🔍 Context analysis: Express.js + PostgreSQL detected', 'blue');
    console.log();
    await typeText('🛡️  Security agent: "OWASP compliance requirements..."', 'blue');
    console.log();
    await typeText('🗄️  Database agent: "User table schema with proper indexing..."', 'blue');
    console.log();
    await typeText('⚛️  Frontend agent: "Login/signup components with validation..."', 'blue');
    console.log();
    await typeText('📋 Generated: 12 tasks across 3 phases with quality gates', 'green');
    console.log();
    await sleep(1000);

    await typeText('/develop', 'cyan', 20);
    console.log();
    await sleep(500);

    await typeText('⚡ P1.1.0: Database schema ✅', 'green');
    console.log();
    await typeText('⚡ P1.2.0: JWT service implementation ✅', 'green');
    console.log();
    await typeText('⚡ P1.3.0: Password hashing & validation ✅', 'green');
    console.log();
    await typeText('🎯 Phase 1 quality gates: All passed ✅', 'green');
    console.log();
    await typeText('⚡ P2.1.0: Login API endpoints ✅', 'green');
    console.log();
    await typeText('⚡ P2.2.0: Frontend auth components ✅', 'green');
    console.log();
    await typeText('⚡ P2.3.0: OAuth integration ✅', 'green');
    console.log();
    await typeText('⚡ P3.1.0: Comprehensive testing ✅', 'green');
    console.log();
    await typeText('⚡ P3.2.0: Security audit ✅', 'green');
    console.log();
    await typeText('⚡ P3.3.0: Documentation ✅', 'green');
    console.log();
    await sleep(1000);

    console.log();
    console.log(colorize('Result: 30 minutes, production-ready with full context preservation', 'green'));
    console.log();

    await sleep(2000);

    // Key differences
    console.log(colorize('🎯 KEY DIFFERENCES:', 'yellow'));
    console.log();
    console.log(colorize('  📝 Perfect Memory: Every decision preserved in HANDOFF.yml, RESEARCH.md', 'white'));
    console.log(colorize('  🧠 Expert Consultation: 18 specialist agents for every domain', 'white'));
    console.log(colorize('  🎯 Quality Gates: Automatic validation between every phase', 'white'));
    console.log(colorize('  📋 Systematic Planning: P1→P2→P3 phases with logical dependencies', 'white'));
    console.log(colorize('  🔄 Context Awareness: AI remembers everything across long sessions', 'white'));
    console.log();

    await sleep(2000);

    // Call to action
    console.log(colorize('🚀 READY TO TRY IT?', 'cyan'));
    console.log();
    console.log(colorize('Next steps:', 'white'));
    console.log(colorize('  1. ./scripts/setup-manager.sh quick', 'yellow'));
    console.log(colorize('  2. /idea --start "your feature idea"', 'yellow'));
    console.log(colorize('  3. Experience the difference!', 'yellow'));
    console.log();
    console.log(colorize('📖 Learn more: cat START-HERE.md', 'blue'));
    console.log(colorize('🎪 See all templates: cat TEMPLATES-EXAMPLES-INDEX.md', 'blue'));
    console.log();
}

// File existence check
function checkProjectStructure() {
    const requiredFiles = [
        'START-HERE.md',
        'TEMPLATES-EXAMPLES-INDEX.md',
        '.claude/agents/README.md',
        'scripts/ai-status.sh'
    ];

    const missing = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, '..', file)));

    if (missing.length > 0) {
        console.log(colorize('⚠️  Warning: Some template files are missing:', 'yellow'));
        missing.forEach(file => console.log(colorize(`   ${file}`, 'red')));
        console.log();
        console.log(colorize('This demo will still work, but run ./scripts/setup-manager.sh for full setup.', 'white'));
        console.log();
    }
}

// Main execution
async function main() {
    console.log(colorize('Starting demo...', 'cyan'));
    await sleep(500);

    checkProjectStructure();
    await runDemo();

    process.exit(0);
}

// Run the demo
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { runDemo };
