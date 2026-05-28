#!/bin/bash
# Detects whether this project is still an unconfigured template.
# Output is injected into Claude's context at session start by the SessionStart hook.

if grep -q '\[Project Name\]' CLAUDE.md 2>/dev/null; then
  cat <<'EOF'
=== PROJECT SETUP REQUIRED ===

This project is still an unconfigured template — the placeholder "[Project Name]" is present in CLAUDE.md.

Your first task this session is to run the interactive onboarding flow. Greet the user warmly, explain that you'll ask a few quick questions to get their project set up, then follow the "## Onboarding" section in CLAUDE.md exactly.

Begin the onboarding immediately — do not wait for the user to ask.
EOF
fi
